<script lang="ts">
	import Navbar from '../components/Navbar.svelte';
	import Footer from '../components/Footer.svelte';
	import { page } from '$app/stores';

	let links: { href: string; name: string }[] = [
		{ href: '/', name: 'Home' },
		{ href: '/about', name: 'About' },
		{ href: '/gallery', name: 'Gallery' },
		{ href: '/pay', name: 'Pay Dues' },

		{ href: '/register', name: 'JOIN ASU' }
	];

	import Transition from '../components/Transition.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const moveSidebar = (href: string) => {
		console.log('HELLO');
		const drawercheck = document.getElementById('my-drawer-3') as HTMLInputElement | null;
		goto(href);
		setTimeout(() => {
			if (drawercheck?.checked && drawercheck?.checked === true) {
				drawercheck.checked = false;
			}
		});
	};
</script>

<!-- ... -->

<div class="drawer p-0 mx-auto m-0 drawer-end">
	<input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<div class="">
			<Navbar {links} />
			<div class="max-w-screen-3xl mx-auto">
				<div class="min-h-full">
					<Transition url={$page.url}>
						<slot />
						{#if $page.url.pathname !== '/pay'}
							<Footer />
						{/if}
					</Transition>
				</div>
			</div>
		</div>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-3" class="drawer-overlay" />
		<div class="overflow-y-auto h-screen">
			<div class="w-64 bg-base-100 h-screen justify-center flex-col">
				<div class="grid grid-rows-4 p-4">
					{#each links as link}
						<div class="mx-2">
							<div
								role="button"
								on:click={() => moveSidebar(link.href)}
								on:mouseenter={() => console.log(link.href + ' ' + $page.url.pathname)}
								class={`p-4 btn btn-primary mx-2 my-4 btn-lg w-full text-3xl
									${$page.url.pathname !== link.href && 'btn-outline'}`}
							>
								{link.name}
							</div>
						</div>
					{/each}
				</div>

				<div />
				<div class="justify-center flex gap-2">
					<div class="grid grid-cols-3">
						<div>
							<a href="https://twitter.com/utdallasasu" class="fill-[#00acee]">
								<xml version="1.0" encoding="UTF-8">
									<!-- Generator: Adobe Illustrator 24.2.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
									<svg
										version="1.1"
										id="Logo"
										class="h-16 w-16 mx-4"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										x="0px"
										y="0px"
										viewBox="0 0 248 204"
										style="enable-background:new 0 0 248 204;"
										xml:space="preserve"
									>
										<style type="text/css">
											.st0 {
												fill: #1d9bf0;
											}
										</style>
										<g id="Logo_1_">
											<path
												id="white_background"
												class="st0"
												d="M221.95,51.29c0.15,2.17,0.15,4.34,0.15,6.53c0,66.73-50.8,143.69-143.69,143.69v-0.04   C50.97,201.51,24.1,193.65,1,178.83c3.99,0.48,8,0.72,12.02,0.73c22.74,0.02,44.83-7.61,62.72-21.66   c-21.61-0.41-40.56-14.5-47.18-35.07c7.57,1.46,15.37,1.16,22.8-0.87C27.8,117.2,10.85,96.5,10.85,72.46c0-0.22,0-0.43,0-0.64   c7.02,3.91,14.88,6.08,22.92,6.32C11.58,63.31,4.74,33.79,18.14,10.71c25.64,31.55,63.47,50.73,104.08,52.76   c-4.07-17.54,1.49-35.92,14.61-48.25c20.34-19.12,52.33-18.14,71.45,2.19c11.31-2.23,22.15-6.38,32.07-12.26   c-3.77,11.69-11.66,21.62-22.2,27.93c10.01-1.18,19.79-3.86,29-7.95C240.37,35.29,231.83,44.14,221.95,51.29z"
											/>
										</g>
									</svg>
								</xml></a
							>
						</div>

						<div>
							<a href="https://www.instagram.com/utdallasasu">
								<xml version="1.0">
									<svg
										style="enable-background:new 0 0 512 512;"
										version="1.1"
										viewBox="0 0 512 512"
										xml:space="preserve"
										class="h-16 w-16 mx-4"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
										><style type="text/css">
											.st1 {
												fill: url(#SVGID_1_);
											}
											.st2 {
												fill: url(#SVGID_2_);
											}
											.st3 {
												fill: #654c9f;
											}
										</style><g id="Edges" /><g id="Symbol"
											><g
												><radialGradient
													cx="56.3501"
													cy="19.2179"
													gradientTransform="matrix(0.9986 -5.233596e-02 4.448556e-02 0.8488 -36.9742 443.8014)"
													gradientUnits="userSpaceOnUse"
													id="SVGID_1_"
													r="711.335"
													><stop offset="0" style="stop-color:#FED576" /><stop
														offset="0.2634"
														style="stop-color:#F47133"
													/><stop offset="0.6091" style="stop-color:#BC3081" /><stop
														offset="1"
														style="stop-color:#4C63D2"
													/></radialGradient
												><path
													class="st1"
													d="M96.1,23.2c-16.2,6.3-29.9,14.7-43.6,28.4C38.8,65.2,30.4,79,24.1,95.1c-6.1,15.6-10.2,33.5-11.4,59.7    c-1.2,26.2-1.5,34.6-1.5,101.4s0.3,75.2,1.5,101.4c1.2,26.2,5.4,44.1,11.4,59.7c6.3,16.2,14.7,29.9,28.4,43.6    c13.7,13.7,27.4,22.1,43.6,28.4c15.6,6.1,33.5,10.2,59.7,11.4c26.2,1.2,34.6,1.5,101.4,1.5c66.8,0,75.2-0.3,101.4-1.5    c26.2-1.2,44.1-5.4,59.7-11.4c16.2-6.3,29.9-14.7,43.6-28.4c13.7-13.7,22.1-27.4,28.4-43.6c6.1-15.6,10.2-33.5,11.4-59.7    c1.2-26.2,1.5-34.6,1.5-101.4s-0.3-75.2-1.5-101.4c-1.2-26.2-5.4-44.1-11.4-59.7C484,79,475.6,65.2,462,51.6    c-13.7-13.7-27.4-22.1-43.6-28.4c-15.6-6.1-33.5-10.2-59.7-11.4c-26.2-1.2-34.6-1.5-101.4-1.5s-75.2,0.3-101.4,1.5    C129.6,12.9,111.7,17.1,96.1,23.2z M356.6,56c24,1.1,37,5.1,45.7,8.5c11.5,4.5,19.7,9.8,28.3,18.4c8.6,8.6,13.9,16.8,18.4,28.3    c3.4,8.7,7.4,21.7,8.5,45.7c1.2,25.9,1.4,33.7,1.4,99.4s-0.3,73.5-1.4,99.4c-1.1,24-5.1,37-8.5,45.7c-4.5,11.5-9.8,19.7-18.4,28.3    c-8.6,8.6-16.8,13.9-28.3,18.4c-8.7,3.4-21.7,7.4-45.7,8.5c-25.9,1.2-33.7,1.4-99.4,1.4s-73.5-0.3-99.4-1.4    c-24-1.1-37-5.1-45.7-8.5c-11.5-4.5-19.7-9.8-28.3-18.4c-8.6-8.6-13.9-16.8-18.4-28.3c-3.4-8.7-7.4-21.7-8.5-45.7    c-1.2-25.9-1.4-33.7-1.4-99.4s0.3-73.5,1.4-99.4c1.1-24,5.1-37,8.5-45.7c4.5-11.5,9.8-19.7,18.4-28.3c8.6-8.6,16.8-13.9,28.3-18.4    c8.7-3.4,21.7-7.4,45.7-8.5c25.9-1.2,33.7-1.4,99.4-1.4S330.7,54.8,356.6,56z"
												/><radialGradient
													cx="154.0732"
													cy="134.5501"
													gradientTransform="matrix(0.9986 -5.233596e-02 4.448556e-02 0.8488 -24.3617 253.2946)"
													gradientUnits="userSpaceOnUse"
													id="SVGID_2_"
													r="365.2801"
													><stop offset="0" style="stop-color:#FED576" /><stop
														offset="0.2634"
														style="stop-color:#F47133"
													/><stop offset="0.6091" style="stop-color:#BC3081" /><stop
														offset="1"
														style="stop-color:#4C63D2"
													/></radialGradient
												><path
													class="st2"
													d="M130.9,256.3c0,69.8,56.6,126.3,126.3,126.3s126.3-56.6,126.3-126.3S327,130,257.2,130    S130.9,186.5,130.9,256.3z M339.2,256.3c0,45.3-36.7,82-82,82s-82-36.7-82-82c0-45.3,36.7-82,82-82S339.2,211,339.2,256.3z"
												/><circle class="st3" cx="388.6" cy="125" r="29.5" /></g
											></g
										></svg
									>
								</xml>
							</a>
						</div>

						<div>
							<a href="https://www.tiktok.com/@utdallasasu">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill-rule="evenodd"
									clip-rule="evenodd"
									image-rendering="optimizeQuality"
									shape-rendering="geometricPrecision"
									text-rendering="geometricPrecision"
									viewBox="0 0 512 512"
									class="h-16 w-16 mx-4"
									><path
										d="M353.97 0.43c0.03,7.81 2.31,120.68 120.76,127.72 0,32.55 0.04,56.15 0.04,87.21 -8.97,0.52 -77.98,-4.49 -120.93,-42.8l-0.13 169.78c1.63,117.84 -85.09,189.55 -198.44,164.78 -195.46,-58.47 -130.51,-348.37 65.75,-317.34 0,93.59 0.05,-0.03 0.05,93.59 -81.08,-11.93 -108.2,55.52 -86.65,103.81 19.6,43.97 100.33,53.5 128.49,-8.53 3.19,-12.14 4.78,-25.98 4.78,-41.52l0 -337.13 86.28 0.43z"
									/></svg
								>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@10..48,200;10..48,300;10..48,400;10..48,500;10..48,600;10..48,700;10..48,800&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	:global(:root) {
		font-family: 'Bricolage Grotesque';
	}
</style>
