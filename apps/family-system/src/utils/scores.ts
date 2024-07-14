import { desc, eq, sum } from 'drizzle-orm'
import type { BasePayload } from 'payload'

// TODO: use prepared statements - https://orm.drizzle.team/docs/perf-queries#prepared-statement

export const recalculateScores = async (payload: BasePayload) => {
    const ledger_entries = payload.db.tables.ledger_entries
    const newScores = await payload.db.drizzle.select({
        familyId: ledger_entries.Family, 
        newScore: sum(ledger_entries.amount).as('new_score')
    }).from(ledger_entries)
    .groupBy(ledger_entries.Family)

    for (const { newScore, familyId } of newScores) {
        await payload.update(
            {
                collection: 'families',
                id: familyId as number,
                data: {
                    score: Number(newScore) ?? 0
                }
            }
        )
    }
}

export const getTopMemberPointEarners = async (payload: BasePayload, limit = 5) => {
    // TODO: payload has poor typing with drizzle, need to manually type returned values
    const {ledger_entries, members, families_rels, families} = payload.db.tables
    
    const {drizzle: db} = payload.db

    const points = db.$with('points').as(
        db.select({
            memberId: ledger_entries.member,
            points: sum(ledger_entries.amount).as('points')
        }).from(ledger_entries)
        .groupBy(ledger_entries.member)
    )

    const topMembers = db.$with('topMembers').as(db.with(points).select({
        memberName: members.jonze_name,
        points: points.points,
        memberId: points.memberId,
        familyId: families_rels.parent,
    }).from(points).leftJoin(members, eq(members.id, points.memberId)).leftJoin(families_rels, eq(families_rels.membersID, members.id)).orderBy(desc(points.points)).limit(limit))

    const topMembersWithFamilies = await db.with(topMembers).select({
        memberName: topMembers.memberName,
        points: topMembers.points,
        memberId: topMembers.memberId,
        familyId: topMembers.familyId,
        familyName: families.family_name
    }).from(topMembers).leftJoin(families, eq(families.id, topMembers.familyId)).orderBy(desc(topMembers.points))

    return topMembersWithFamilies
}

export const getTopFamilies = async (payload: BasePayload, limit = 5) => {
    const top5Families = await payload.find({
        collection: 'families',
        page: 1,
        limit,
        sort: '-score'
    })

    return top5Families.docs
}