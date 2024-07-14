import { sum } from 'drizzle-orm'
import type { BasePayload } from 'payload'

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