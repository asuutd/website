'use client';

import { Member } from '@/payload-types';

import { useDocumentInfo } from '@payloadcms/ui';
import { jonzeClient } from '@/utils/jonze';
import { useState, useEffect } from 'react';

function FamilyMembers() {
	const { initialData } = useDocumentInfo();
	const { jonze_family_tag } = initialData;

	const [allMembers, setAllMembers] = useState<Member[]>([]);
	const [membersByFamilyTag, setMembersByFamilyTag] = useState<Member[]>([]);

	useEffect(() => {
		if (!jonze_family_tag) {
			return;
		}
		const run = async () => {
			const res = await fetch(
				`/api/members-by-family-tag?tag=${encodeURIComponent(jonze_family_tag)}`
			);
			if (!res.ok) {
				return;
			}
			const members = await res.json();
			setMembersByFamilyTag(members);
		};
		run();
	}, [jonze_family_tag]);

	useEffect(() => {
		const run = async () => {
			const res = await fetch('/api/members?limit=1000');
			if (!res.ok) {
				return;
			}
			const members = await res.json();
			setAllMembers(members.docs);
		};
		run();
	}, []);

	const [memberId, setMemberId] = useState('');

	return (
		<div>
			<h1>Family Members</h1>
			<ul>
				{membersByFamilyTag.map((member: Member) => (
					<div key={member.id}>{member.jonze_name}</div>
				))}
			</ul>

			<select name="memberId" onChange={(e) => setMemberId(e.target.value)} value={memberId}>
				<option value="">Select a member</option>
				{allMembers.map((member: Member) => (
					<option key={member.jonze_member_id} value={member.jonze_member_id}>
						{member.jonze_name}
					</option>
				))}
			</select>
			<button
				type="button"
				onClick={async () => {
					await jonzeClient.addTagsToMember(memberId, [jonze_family_tag]);
				}}
			>
				Add Member
			</button>
		</div>
	);
}

export default FamilyMembers;
