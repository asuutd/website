"use client"

export const RefreshFamilyScores = () => {
    return (
        <button type="button" onClick={async ()=>{
            const res = await fetch('/api/refresh-scores', {
                method: 'POST'
            })
            if (!res.ok) {
                throw new Error('Failed to refresh scores')
            }
        }}>Refresh Family Scores</button>
    )
}