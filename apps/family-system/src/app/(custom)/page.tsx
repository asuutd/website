import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getPayload } from '@/utils/payload';
import { Member } from '@/payload-types';
import { getTopFamilies, getTopMemberPointEarners } from '@/utils/scores';
import { Metadata } from 'next';

type PointEarningMethod = {
	title: string;
	description: string;
};

const pointEarningMethods: PointEarningMethod[] = [
	{
		title: 'Engage with ASU Socials',
		description:
			"Earn points for liking, commenting, and sharing content from ASU's Instagram page."
	},
	{
		title: 'Participate in Events',
		description: 'Earn XX points for checking into events.'
	}
];

export const metadata: Metadata = {
	title: 'ASU Family Leaderboard'
};

const payload = await getPayload();

async function HomePage() {
	const topFamilies = await getTopFamilies(payload);
	const topMembers = await getTopMemberPointEarners(payload);
	return (
		<div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div>
					<h2 className="text-2xl font-bold mb-4">Top Families</h2>
					<div className="space-y-4">
						{topFamilies.map((family, index) => (
							<FamilyCard
								key={`top-family-${family.id}`}
								name={family.family_name}
								position={index + 1}
								points={family.score ?? -1}
								member_names={family.members.map(
									(member) => (member as unknown as Member).jonze_name
								)}
							/>
						))}
					</div>
				</div>
				<div>
					<h2 className="text-2xl font-bold mb-4">Top Individual Point Earners</h2>
					<div className="space-y-4">
						{topMembers.map(({ member, family }, index) => (
							<MemberCard
								key={`top-member-${member.memberId}`}
								memberName={member.memberName}
								position={index + 1}
								points={Number(member.points)}
								familyName={family?.family_name ?? 'No family'}
							/>
						))}
					</div>
				</div>
			</div>
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Ways to Earn Points</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{pointEarningMethods.map((method, index) => (
						<PointEarningMethodCard
							key={`point-earning-method-${index}`}
							title={method.title}
							description={method.description}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export default HomePage;

function MemberCard(props: {
	memberName: string;
	position: number;
	points: number;
	familyName: string;
}) {
	const { memberName, position, points, familyName } = props;
	return (
		<div className="bg-background rounded-lg p-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
					{position}
				</div>
				<div>
					<h3 className="text-lg font-medium">{memberName}</h3>
					<p className="text-muted-foreground">{points.toLocaleString()} points</p>
				</div>
			</div>
			<div>
				<p className="text-muted-foreground">{familyName}</p>
			</div>
		</div>
	);
}

function PointEarningMethodCard(props: PointEarningMethod) {
	const { title, description } = props;
	return (
		<div className="bg-background rounded-lg p-4">
			<h3 className="text-lg font-medium mb-2">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}

function FamilyCard(props: {
	name: string;
	position: number;
	points: number;
	member_names: string[];
}) {
	const { name, position, points, member_names } = props;
	return (
		<div className="bg-background rounded-lg p-4 flex items-center justify-between">
			<div className="flex items-center gap-4">
				<div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
					{position}
				</div>
				<div>
					<h3 className="text-lg font-medium">{name}</h3>
					<p className="text-muted-foreground">{points.toLocaleString()} points</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				{member_names.map((member_name, index) => (
					<Avatar key={`${name}-${member_name}`}>
						<AvatarFallback>
							{member_name
								.split(/(?:\s|-)+/)
								.map((name) => name.slice(0, 1))
								.join('')
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				))}
			</div>
		</div>
	);
}
