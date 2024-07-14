import { sum } from 'drizzle-orm'
import { PayloadRequest } from 'payload'

export const recalculateScores = async (req: PayloadRequest) => {
    const ledger_entries = req.payload.db.tables.ledger_entries
    const newScores = await req.payload.db.drizzle.select({
        familyId: ledger_entries.Family, 
        newScore: sum(ledger_entries.amount).as('new_score')
    }).from(ledger_entries)
    .groupBy(ledger_entries.Family)

    for (const { newScore, familyId } of newScores) {
        await req.payload.update(
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