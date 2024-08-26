import type { PageServerLoad } from './$types';
import { FAMILY_SYS_HOST, FAMILY_SYS_API_KEY } from '$env/static/private';

export const load: PageServerLoad = async () => {
    const [topFamiliesRes, topMembersRes] = await Promise.all([
        fetch(`${FAMILY_SYS_HOST}/api/agg/get_top_families`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': FAMILY_SYS_API_KEY
            }
        }),
        fetch(`${FAMILY_SYS_HOST}/api/agg/get_top_members`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': FAMILY_SYS_API_KEY
            }
        })
    ])

    if (!topFamiliesRes.ok || !topMembersRes.ok) {
        return {
            status: 500,
            error: 'Failed to fetch data'
        }
    }

    const [topFamilies, topMembers] = await Promise.all([topFamiliesRes.json(), topMembersRes.json()]);

    return {
        topFamilies,
        topMembers
    }
}