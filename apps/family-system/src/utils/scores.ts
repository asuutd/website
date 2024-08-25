// import 'server-only'
import type { Family, Member } from '@/payload-types';
import { arrayContains, desc, eq, sql, sum, inArray, not, isNull } from 'drizzle-orm';
import type { BasePayload } from 'payload';

// TODO: use prepared statements - https://orm.drizzle.team/docs/perf-queries#prepared-statement

export const defaultFamily: Omit<Family, 'id' | 'createdAt' | 'updatedAt'> = {
	family_name: "No family assigned",
	jonze_family_tag: "#fam-no-family-assigned",
	score: 0
}

export const recalculateScores = async (payload: BasePayload, familyIds?: number[]) => {
	const { ledger_entries, families, members } = payload.db.tables;
	const { drizzle: db } = payload.db;

	const cond = familyIds ? inArray(ledger_entries.Family, familyIds) : sql`true`;

	const newFamilyScoresQuery = (await db
		.select({
			familyId: ledger_entries.Family,
			jonze_family_tag: families.jonze_family_tag,
			score: sum(ledger_entries.amount).as('score')
		})
		.from(ledger_entries)
		.where(cond)
		.leftJoin(families, eq(families.id, ledger_entries.Family))
		.groupBy(ledger_entries.Family)).map((family) => ({ ...family, score: Number(family.score) }))



	for (const familyIdx in newFamilyScoresQuery) {
		const family = newFamilyScoresQuery[familyIdx];
		const memberScores = await db
			.select({
				memberId: members.id,
				score: sum(ledger_entries.amount).as('score')
			})
			.from(ledger_entries)
			.leftJoin(members, eq(members.id, ledger_entries.memberId))
			.where(inArray(family.jonze_family_tag, members.jonze_tags))
			.groupBy(members.id);

		const sumOfMemberScores = memberScores.reduce((sum, memberScore) => sum + Number(memberScore.score), 0);

		newFamilyScoresQuery[familyIdx].score += sumOfMemberScores;
	}

	await Promise.all(
		newFamilyScoresQuery.map(async (newScore) => {
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
			.where(not(isNull(ledger_entries.member)))
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
		.orderBy(desc(topMembers.points)).limit(limit);

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
  		jonze_family_tag: {
  		  not_equals: defaultFamily.jonze_family_tag
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
