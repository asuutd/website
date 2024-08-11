'use server';
export type Member = {
	id: string;
	orgId: string;
	userId: string;
	role: 'ADMIN' | 'MEMBER' | 'OWNER';
	additionalInfoId: string;
	createdAt: string;
	updatedAt: string;
	user: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		email: string;
		profilePictureUrl: string;
	};
	additionalInfo: {
		id: string;
		formId: string;
		response: Record<string, unknown>;
		createdAt: string;
		updatedAt: string;
	};
	tags?: {
		id: string;
		names: string[];
		createdAt: string;
		updatedAt: string;
	};
};

export type PartialMember = Pick<
	Member,
	'id' | 'orgId' | 'userId' | 'role' | 'additionalInfoId' | 'createdAt' | 'createdAt'
>;


export type Event = {
    id: string
    name: string
    start?: string
    end?: string
    description: string
    image: string
    orgId: string
    formId: string
    createdAt?: string
    updatedAt?: string  
}

export class JonzeClient {
	private apiBase: string;
	private apiKey: string;

	constructor(apiKey: string, useDev: boolean = false) {
		this.apiKey = apiKey;
		this.apiBase = useDev ? 'https://dev-api.jonze.co' : 'https://api.jonze.co';
	}

	private async fetch(url: string, method: string, body?: any) {
		const fetchOptions: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.apiKey
			}
		};
		if (body) {
			fetchOptions.body = JSON.stringify(body);
		}
		const response = await fetch(this.apiBase + url, fetchOptions);

		if (response.ok) {
			return response.json();
		} else {
			throw new Error('Jonze API Error');
		}
	}

	async getMembers(): Promise<PartialMember[]> {
		return this.fetch('/members', 'GET') as Promise<PartialMember[]>;
	}

	async getMember(id: string): Promise<Member> {
		return this.fetch(`/members/${id}`, 'GET') as Promise<Member>;
	}

	async addTagsToMember(memberId: string, tags: string[]): Promise<void> {
		const body = { tags };
		await this.fetch(`/members/${memberId}/tags`, 'PUT', body);
	}
    
    async getEvents(): Promise<Event[]> {
        return this.fetch('/events', 'GET') as Promise<Event[]>;
    }
}
