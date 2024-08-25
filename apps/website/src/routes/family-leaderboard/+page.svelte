<script>

	import FamilyCard from './FamilyCard.svelte';
	import MemberCard from './MemberCard.svelte';
	import PointEarningMethodCard from './PointEarningMethodCard.svelte';

	// import { getPayload } from '@/utils/payload';
	// import { getTopFamilies, getTopMemberPointEarners } from '@/utils/scores';

	let topFamilies = [];
	let topMembers = [];
	let pointEarningMethods = [
		{
			title: 'Engage with ASU Socials',
			description: "Earn points for liking, commenting, and sharing content from ASU's Instagram page."
		},
		{
			title: 'Participate in Events',
			description: 'Earn 10 points for checking into events.'
		}
	];

	// onMount(async () => {
	// 	const payload = await getPayload();
	// 	topFamilies = await getTopFamilies(payload);
	// 	topMembers = await getTopMemberPointEarners(payload);
	// });
</script>

<style>
	.container {
		width: 100%;
		max-width: 6xl;
		margin: 0 auto;
		padding: 12px 16px;
	}
	
</style>

<div class="container">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div>
			<h2 class="text-2xl">Top Families</h2>
			<div class="space-y-4">
				{#each topFamilies as family, index}
					<FamilyCard
						name={family.family_name}
						position={index + 1}
						points={family.score ?? -1}
						member_names={family.members.map(member => member.jonze_name)}
					/>
				{/each}
			</div>
		</div>
		<div>
			<h2 class="text-2xl">Top Individual Point Earners</h2>
			<div class="space-y-4">
				{#each topMembers as { member, family }, index}
					<MemberCard
						memberName={member.memberName}
						position={index + 1}
						points={Number(member.points)}
						familyName={family?.family_name ?? 'No family'}
					/>
				{/each}
			</div>
		</div>
	</div>
	<div class="mt-8">
		<h2 class="text-2xl">Ways to Earn Points</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{#each pointEarningMethods as method, index}
				<PointEarningMethodCard
					title={method.title}
					description={method.description}
				/>
			{/each}
		</div>
	</div>
</div>


