import { desc, eq, sql, sum } from 'drizzle-orm'
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
    const {ledger_entries, members, families} = payload.db.tables
    
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
        memberTags: members.jonze_tags,
    }).from(points).leftJoin(members, eq(members.id, points.memberId)))


    // TODO: figure out a way to get corresponding family for each top member

    return []
}

export const getTopFamilies = async (payload: BasePayload, limit = 5) => {
    const topFamilies = await payload.find({
        collection: 'families',
        page: 1,
        limit,
        sort: '-score'
    })

    const {drizzle: db} = payload.db
    const {members} = payload.db.tables

    const membersInFamilies = await Promise.all(
        topFamilies.docs.map(async (family) => {
            const tagAsJson = JSON.stringify(family.jonze_family_tag)
            return db.select().from(members)
            .where(sql`${members.jonze_tags} @> ${tagAsJson}::jsonb`)
        })
    )

    return topFamilies.docs.map((family, index) => {
        const membersInFamily = membersInFamilies[index]
        return {
            ...family,
            members: membersInFamily
        }
    })
}