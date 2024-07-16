import { arrayContains, desc, eq, sql, sum } from 'drizzle-orm';
import type { BasePayload } from 'payload';

// TODO: use prepared statements - https://orm.drizzle.team/docs/perf-queries#prepared-statement

export const recalculateScores = async (payload: BasePayload) => {
	const { ledger_entries, families } = payload.db.tables;
	const { drizzle: db } = payload.db;

	const newScores = db.$with('newScores').as(
		db
			.select({
				familyId: ledger_entries.Family,
				score: sum(ledger_entries.amount).as('score')
			})
			.from(ledger_entries)
			.groupBy(ledger_entries.Family)
	);

	// TODO: figure out why this doesn't work... the docs claim that this should work, but it doesn't
	// const update = await db.with(newScores).update(families).set({
	//     score: newScores.score
	// }).where(eq(families.id, newScores.familyId))
};

export const getTopMemberPointEarners = async (payload: BasePayload, limit = 5) => {
	// TODO: payload has poor typing with drizzle, need to manually type returned values
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

	// TODO: figure out a way to get corresponding family for each top member

	return [];
};

export const getTopFamilies = async (payload: BasePayload, limit = 5) => {
	const topFamilies = await payload.find({
		collection: 'families',
		page: 1,
		limit,
		sort: '-score'
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
	const tagAsJson = JSON.stringify(tag);
	console.log(tagAsJson);
	const membersByFamily = await db
		.select()
		.from(members)
		.where(arrayContains(members.jonze_tags, tagAsJson));
	return membersByFamily;
};
