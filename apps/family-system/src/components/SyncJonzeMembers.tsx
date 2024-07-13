"use client"

import { useState } from "react"

export const SyncJonzeMembers = () => {
    const [logs, setLogs] = useState<string>('')

    return (
        <>
            <button type="button" className="btn btn-primary" onClick={async ()=>{
                setLogs('waiting....') 
                const members = await fetch('/api/sync-jonze-members', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'}
                })
                const reader = members.body?.getReader()
                if (!reader) {
                    throw new Error('No body reader')
                }
                const decoder = new TextDecoder()
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    setLogs((prev)=>prev + decoder.decode(value, { stream: true }))
                }
            }}>Sync All Member Data From Jonze</button>
            {logs.length > 0 && <pre>{logs}</pre>}
        </>
    )


}