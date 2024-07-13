import { env } from './env/server.mjs'

type Member = {
    id: string,
    orgId: string,
    userId: string,
    role: "ADMIN"|"MEMBER"|"OWNER",
    additionalInfoId: string,
    createdAt: string,
    updatedAt: string,
    user: {
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        profilePictureUrl: string,
    },
    addtionalInfo: {
        id: string,
        formId: string,
        response: Record<string, unknown>,
        createdAt: string,
        updatedAt: string,
    }
}

type PartialMember = Pick<Member, "id"|
"orgId"|
"userId"|
"role"|
"additionalInfoId"|"createdAt"|"createdAt">

const JONZE_API_BASE = env.USE_JONZE_DEV ? "https://dev-api.jonze.co" : "https://api.jonze.co"

export const jonzeFetch = async (url: string, method: string, body?: any) => {
    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.JONZE_API_KEY,
        },
    }
    if (body) {
        fetchOptions.body = JSON.stringify(body)
    }
    const response = await fetch(JONZE_API_BASE + url, fetchOptions)

    if (response.ok) {
        return response.json()
    } else {
        throw new Error('Jonze API Error')
    }
}

export const getMembers = async () => {
    const members = await jonzeFetch('/members', 'GET') as PartialMember[]
    return members
}

export const getMember = async (id: string) => {
    const member = await jonzeFetch(`/members/${id}`, 'GET') as Member
    return member
}