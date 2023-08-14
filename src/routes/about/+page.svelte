<script lang="ts">
	function handleAnchorClick(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLAnchorElement;
		},
		id: string
	) {
		const link = event.currentTarget;
		const anchor = document.getElementById(id);
		console.log(anchor);
		anchor.scrollIntoView({
			behavior: 'smooth'
		});
	}
	const board = [
		{
			name: 'Onyedi Ololo',
			role: 'President'
		},
		{
			name: 'Omolere Aliu',
			role: 'Vice President',
			image: '/images/officers/omolere.jpeg'
		},
		{
			name: 'Ayomide Dairo',
			role: 'Secretary',
			image: '/images/officers/ayomide.PNG'
		},
		{
			name: 'Ellen Elnour',
			role: 'Treasurer',
			image: '/images/officers/ellen.jpeg'
		},
		{
			name: 'Loluwa Olu-Osinowo',
			role: 'Public Relations'
		},
		{
			name: 'Dena Yemane',
			role: 'Event Coordinator',
			image: '/images/officers/dena.jpeg'
		},
		{
			name: 'Quincy Kemany',
			role: 'Event Coordinator (Student Experience)',
			image: '/images/officers/quincy.jpeg'
		},
		{
			name: 'Toluwanimi Ololade',
			role: 'Event Coordinator (Budget Specialist)',
			image: '/images/officers/tolu.jpeg'
		},
		{
			name: 'Inioluwa Adenekan',
			role: 'Commitee Chair',
			image: '/images/officers/inioluwa.jpeg'
		},
		{
			name: 'Maxwell Quaye',
			role: 'Membership Commitee Co-Chair',
			image: '/images/officers/maxwell.jpeg'
		},
		{
			name: 'AJ Olaoye',
			role: 'Sports Co-Chair',
			image: '/images/officers/aj.jpeg'
		},
		{
			name: 'Irving Baysah',
			role: 'Sports Co-Chair',
			image: '/images/officers/irving.jpeg'
		},
		{
			name: 'Pelumi Adegoke',
			role: 'Technical Director',
			image: '/images/officers/pelumi.jpeg'
		}
	];
</script>

<!-- Features -->
<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
	<div class="relative p-6 md:p-16">
		<!-- Grid -->
		<div class="relative z-10 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
			<div class="mb-10 lg:mb-0 lg:col-span-6 lg:col-start-8 lg:order-2">
				<h2 class="text-2xl text-gray-800 font-bold sm:text-3xl dark:text-gray-200">
					About Our Organization
				</h2>

				<!-- Tab Navs -->
				<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
				<nav class="grid gap-4 mt-5 md:mt-10" aria-label="Tabs" role="tablist">
					<button
						type="button"
						class="max-w-xs hs-tab-active:bg-base-100 hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700 active"
						id="tabs-with-card-item-1"
						data-hs-tab="#tabs-with-card-1"
						aria-controls="tabs-with-card-1"
						role="tab"
					>
						<span class="flex">
							<svg
								class="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 text-gray-800 dark:text-gray-200"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									d="M5.5 2A3.5 3.5 0 0 0 2 5.5v5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V8a.5.5 0 0 1 1 0v2.5a4.5 4.5 0 0 1-4.5 4.5h-5A4.5 4.5 0 0 1 1 10.5v-5A4.5 4.5 0 0 1 5.5 1H8a.5.5 0 0 1 0 1H5.5z"
								/>
								<path d="M16 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
							</svg>
							<span class="grow ml-6">
								<span class="block text-lg font-semibold text-gray-800 dark:text-gray-200"
									>What is ASU?</span
								>
							</span>
						</span>
					</button>

					<button
						type="button"
						class="max-w-xs hs-tab-active:bg-base-100 hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700"
						id="tabs-with-card-item-2"
						data-hs-tab="#tabs-with-card-2"
						aria-controls="tabs-with-card-2"
						role="tab"
					>
						<span class="flex">
							<svg
								class="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 text-gray-800 dark:text-gray-200"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1H6.374z"
								/>
							</svg>
							<span class="grow ml-6">
								<span class="block text-lg font-semibold text-gray-800 dark:text-gray-200"
									>Our Mission</span
								>
							</span>
						</span>
					</button>

					<button
						type="button"
						class="max-w-xs hs-tab-active:bg-base-100 hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700"
						id="tabs-with-card-item-3"
						data-hs-tab="#tabs-with-card-3"
						aria-controls="tabs-with-card-3"
						role="tab"
					>
						<span class="flex">
							<svg
								class="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 text-gray-800 dark:text-gray-200"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
								/>
							</svg>
							<span class="grow ml-6">
								<span class="block text-lg font-semibold text-gray-800 dark:text-gray-200"
									>Our Goals</span
								>
							</span>
						</span>
					</button>

					<a
						type="button"
						class="max-w-xs hs-tab-active:bg-base-100 hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-left hover:bg-gray-200 p-4 md:p-5 rounded-xl dark:hs-tab-active:bg-slate-900 dark:hover:bg-gray-700"
						id="tabs-with-card-item-3"
						data-hs-tab="#tabs-with-card-4"
						aria-controls="tabs-with-card-4"
						role="tab"
						href="#board"
						on:click|preventDefault={(e) => handleAnchorClick(e, 'board')}
					>
						<span class="flex">
							<svg
								class="flex-shrink-0 mt-2 h-6 w-6 md:w-7 md:h-7 text-gray-800 dark:text-gray-200"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"
								/>
							</svg>
							<span class="grow ml-6">
								<span class="block text-lg font-semibold text-gray-800 dark:text-gray-200"
									>The Board & Committees</span
								>
							</span>
						</span>
					</a>
				</nav>
				<!-- End Tab Navs -->
			</div>
			<!-- End Col -->

			<div class="lg:col-span-6">
				<div class="relative">
					<!-- Tab Content -->
					<div>
						<div id="tabs-with-card-1" role="tabpanel" aria-labelledby="tabs-with-card-item-1">
							<div class="h-[45rem] bg-white rounded-xl my-auto flex">
								<h1 class="m-auto text-3xl mx-10">
									The UTD <span class="text-primary font-semibold">A</span>frican
									<span class="text-primary font-semibold">S</span>tudent
									<span class="text-primary font-semibold">U</span>nion unites students, staff, and
									supporters of African heritage to celebrate our diverse backgrounds and discuss
									our experiences as members of the African diaspora on campus. We create a
									welcoming community for those away from home.
								</h1>
							</div>
						</div>

						<div
							id="tabs-with-card-2"
							class="hidden"
							role="tabpanel"
							aria-labelledby="tabs-with-card-item-2"
						>
							<div class="h-[45rem] bg-white rounded-xl my-auto flex overflow-y-auto">
								<h1 class="m-auto text-xl md:text-3xl mx-10">
									As we wish to be more involved in the community and to have a greater connection
									between our students and our surrounding areas, we would like to involve you
									through our journey. Events, such as our annual Fall Ball and African Night, are
									ways for a greater reach and as we expand, we ask you to provide services that
									would benefit both of us and allow your name to reach your targeted audiences.
								</h1>
							</div>
						</div>

						<div
							id="tabs-with-card-3"
							class="hidden"
							role="tabpanel"
							aria-labelledby="tabs-with-card-item-3"
						>
							<div
								class="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto h-[45rem] overflow-y-auto"
							>
								<!-- Grid -->
								<div class="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">
														To encourage
													</h3>
													<p class="text-sm text-gray-500">
														unity and collaboration between African and non-African students at the
														University of Texas at Dallas
													</p>
												</div>
											</div>
										</div>
									</div>
									<!-- End Card -->

									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">
														To welcome
													</h3>
													<p class="text-sm text-gray-500">
														African and non-African students to The University of Texas at Dallas
													</p>
												</div>
											</div>
										</div>
									</div>
									<!-- End Card -->

									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">To host</h3>
													<p class="text-sm text-gray-500">
														African awareness events and engage all students at the University of
														Texas at Dallas so that they may learn African cultures and traditions
													</p>
												</div>
											</div>
										</div>
									</div>

									<!-- End Card -->

									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">
														To support
													</h3>
													<p class="text-sm text-gray-500">
														the beliefs and standards for which The University of Texas at Dallas
														stands for
													</p>
												</div>
											</div>
										</div>
									</div>
									<!-- End Card -->
									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">
														To educate
													</h3>
													<p class="text-sm text-gray-500">
														Africa to the interested person(s) including faculty and staff members
													</p>
												</div>
											</div>
										</div>
									</div>
									<!-- End Card -->
									<!-- Card -->
									<div
										class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md transition dark:bg-slate-900 dark:border-gray-800"
									>
										<div class="p-4 md:p-5">
											<div class="flex">
												<div class="grow ml-5">
													<h3 class=" font-semibold text-gray-800 dark:text-gray-200">
														To recruit
													</h3>
													<p class="text-sm text-gray-500">
														members in order to create a community of people interested in learning
														about African countries& culture
													</p>
												</div>
											</div>
										</div>
									</div>
									<!-- End Card -->
								</div>
								<!-- End Grid -->
							</div>
							<!-- End Card Section -->
						</div>
					</div>
					<!-- End Tab Content -->

					<!-- SVG Element -->
					<div class="hidden absolute top-0 right-0 translate-x-20 md:block lg:translate-x-20">
						<svg
							class="w-16 h-auto text-orange-500"
							width="121"
							height="135"
							viewBox="0 0 121 135"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
							<path
								d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
							<path
								d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
								stroke="currentColor"
								stroke-width="10"
								stroke-linecap="round"
							/>
						</svg>
					</div>
					<!-- End SVG Element -->
				</div>
			</div>
			<!-- End Col -->
		</div>
		<!-- End Grid -->

		<!-- Background Color -->
		<div class="absolute inset-0 grid grid-cols-12 w-full h-full">
			<div
				class="col-span-full lg:col-span-7 lg:col-start-6 bg-base-200 w-full h-5/6 rounded-xl sm:h-3/4 lg:h-full dark:bg-white/[.075]"
			/>
		</div>
		<!-- End Background Color -->
	</div>
</div>
<!-- End Features -->

<!-- Features -->

<!-- Team -->
<div class="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" id="board">
	<!-- Title -->
	<div class="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
		<h2 class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
			The Executive Board
		</h2>
	</div>
	<!-- End Title -->

	<!-- Grid -->
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
		{#each board as person}
			<div class="text-center">
				<img
					class="rounded-full w-24 h-24 mx-auto object-cover"
					src={person.image ?? '/images/officers/avatar.png'}
					alt="?"
				/>
				<div class="mt-2 sm:mt-4">
					<h3 class="font-medium text-gray-800 dark:text-gray-200">{person.name}</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400">{person.role}</p>
				</div>
			</div>
		{/each}
	</div>
	<!-- End Grid -->
</div>

<!-- End Team -->
