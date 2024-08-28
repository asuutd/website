<script lang="ts">
	import FamilyCard from './FamilyCard.svelte';
	import MemberCard from './MemberCard.svelte';
	import PointEarningMethodCard from './PointEarningMethodCard.svelte';

	export let data;
	const { topFamilies, topMembers } = data;

	let pointEarningMethods = [
		// {
		// 	title: 'Engage with ASU Socials',
		// 	description: "Earn points for liking, commenting, and sharing content from ASU's Instagram page."
		// },
		{
			title: 'Participate in Events',
			description: 'Earn 10 points for checking into events.'
		},
		{
			title: 'And more to be announced soon!',
			description: ''
		}
	];

	export const config = {
		isr: {
			// 10 minutes
			interval: 10 * 60,
		}
	}
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
	<h1 class="text-4xl font-bold mb-8">Family Leaderboard</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div>
			<h2 class="text-2xl mb-2">Top Families</h2>
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
			<h2 class="text-2xl mb-2">Top Individual Point Earners</h2>
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
	<div class="mt-8 flex flex-col gap-4">
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

	<a href="https://fam.utd-asu.com/admin"	>
		<button class="btn mt-4">
			ADMIN
		</button>
	</a>
</div>


