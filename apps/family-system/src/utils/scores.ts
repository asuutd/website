import type { Family, Member } from '@/payload-types';
import { arrayContains, desc, eq, sql, sum, inArray } from 'drizzle-orm';
import type { BasePayload } from 'payload';

// TODO: use prepared statements - https://orm.drizzle.team/docs/perf-queries#prepared-statement

export const defaultFamily: Family = {
  id: -1,
	family_name: "No family assigned",
	jonze_family_tag: "__default",
	score: 0,
	createdAt: new Date().toUTCString(),
	updatedAt: new Date().toUTCString()
}

export const recalculateScores = async (payload: BasePayload, familyIds?: number[]) => {
	const { ledger_entries, families } = payload.db.tables;
	const { drizzle: db } = payload.db;

	const cond = familyIds ? inArray(ledger_entries.Family, familyIds) : sql`true`;

	const newScoresQuery = await db
		.select({
			familyId: ledger_entries.Family,
			score: sum(ledger_entries.amount).as('score')
		})
		.from(ledger_entries)
		.where(cond)
		.groupBy(ledger_entries.Family);

	await Promise.all(
		newScoresQuery.map(async (newScore) => {
			db.update(families)
				.set({
					score: newScore.score
				})
				.where(eq(families.id, newScore.familyId));
		})
	);
};

export const getTopMemberPointEarners = async (payload: BasePayload, limit = 5) => {
	const { ledger_entries, members, families } = payload.db.tables;

	const { drizzle: db } = payload.db;

	const points = db.$with('points').as(
		db
			.select({
				memberId: ledger_entries.member,
				points: sum(ledger_entries.amount).as('points')
			})
			.from(ledger_entries)
			.groupBy(ledger_entries.member)
	);

	const topMembers = db.$with('topMembers').as(
		db
			.with(points)
			.select({
				memberName: members.jonze_name,
				points: points.points,
				memberId: points.memberId,
				memberTags: members.jonze_tags
			})
			.from(points)
			.leftJoin(members, eq(members.id, points.memberId))
	);

	const topMembersWithFamilies = await db
		.with(topMembers)
		.select()
		.from(topMembers)
		.leftJoin(
			families,
			arrayContains(topMembers.memberTags, sql`to_jsonb(${families.jonze_family_tag})`)
		)
		.orderBy(desc(topMembers.points));

	const out = topMembersWithFamilies.map(
		(result) =>
			({
				member: result.topMembers,
				family: result.families
			} as {
				member: {
					memberName: string;
					points: string;
					memberId: number;
					memberTags: string[];
				};
				family: Family | null;
			})
	);

	return out;
};

export const getTopFamilies = async (payload: BasePayload, limit = 5) => {
	const topFamilies = await payload.find({
		collection: 'families',
		page: 1,
		limit,
		sort: '-score',
		where: {
		id: {
		  not_equals: defaultFamily.id
		}
	}
	});

	const membersInFamilies = await Promise.all(
		topFamilies.docs.map(async (family) => {
			return getMembersByFamilyTag(payload, family.jonze_family_tag);
		})
	);

	return topFamilies.docs.map((family, index) => {
		const membersInFamily = membersInFamilies[index];
		return {
			...family,
			members: membersInFamily
		};
	});
};

export const getMembersByFamilyTag = async (payload: BasePayload, tag: string) => {
	const { members } = payload.db.tables;
	const { drizzle: db } = payload.db;

	const membersByFamily = await db
		.select()
		.from(members)
		.where(arrayContains(members.jonze_tags, tag));

	return membersByFamily as unknown as Member[];
};
