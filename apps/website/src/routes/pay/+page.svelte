<script lang="ts">
	import { onMount } from 'svelte';
	import { loadStripe } from '@stripe/stripe-js/pure';
	import { fade, scale, fly } from 'svelte/transition';
	import { cubicIn, circIn, expoInOut, cubicOut } from 'svelte/easing';
	import type { PageData } from './$types';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import type {
		Stripe,
		StripeElement,
		StripeElements,
		StripePaymentElementOptions
	} from '@stripe/stripe-js';
	import { goto } from '$app/navigation';
	export let data: PageData;
	let stripe: Stripe;
	let elements: StripeElements;
	let processing = false;
	let error = null;

	onMount(async () => {
		stripe = await loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY);
		console.log(stripe);
	});

	async function handleSubmit(e) {
		console.log('HMMM');
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: ''
			}
		});
	}

	async function submit() {
		// avoid processing duplicates
		if (processing) return;

		processing = true;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required',
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: `${import.meta.env.VITE_PUBLIC_URL}`
			}
		});

		// log results, for debugging
		console.log({ result });

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Payment - ASU UTDallas</title>
	<meta name="description" content="Pay dues for ASU UTDallas and enjoy paid privileges" />
</svelte:head>

<!-- Hero -->
<div class="relative">
	<div
		class="mx-auto max-w-screen-md py-12 px-4 sm:px-6 md:max-w-screen-xl md:py-20 lg:py-32 md:px-8"
	>
		<div class=" md:w-1/2 xl:pr-0 xl:w-5/12">
			<!-- Title -->
			<h1
				class="text-3xl text-gray-800 font-bold md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight dark:text-gray-200"
				in:fade|global={{ delay: 700, duration: 750, easing: circIn }}
			>
				Become a <span class="text-primary">Paid</span> member
			</h1>
			<p
				class="mt-3 text-base text-gray-500"
				in:fade|global={{ delay: 1300, duration: 750, easing: circIn }}
			>
				For <span>$25</span> for the school year, you can become an ASU Paid member
			</p>
			<!-- End Title -->
			<div
				class="p-6 flex font-bold items-center uppercase before:flex-[1_1_0%] before:mr-6 after:flex-[1_1_0%] after:ml-6"
				in:fly|global={{ y: 300, delay: 5300, duration: 300, easing: cubicOut }}
			>
				PAY WITH
			</div>

			<div
				class="flex gap-10 justify-center pb-4"
				in:fly|global={{ y: 300, delay: 5300, duration: 300, easing: cubicOut }}
			>
				<div>
					<a href="https://cash.app/$EllenElnour/20.00">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 rounded-full"
							viewBox="0 0 64 64"
							><g fill-rule="nonzero" fill="#FFF"
								><path
									d="M41.7 0c6.4 0 9.6 0 13.1 1.1a13.6 13.6 0 0 1 8.1 8.1C64 12.7 64 15.9 64 22.31v19.37c0 6.42 0 9.64-1.1 13.1a13.6 13.6 0 0 1-8.1 8.1C51.3 64 48.1 64 41.7 64H22.3c-6.42 0-9.64 0-13.1-1.1a13.6 13.6 0 0 1-8.1-8.1C0 51.3 0 48.1 0 41.69V22.3c0-6.42 0-9.64 1.1-13.1a13.6 13.6 0 0 1 8.1-8.1C12.7 0 15.9 0 22.3 0h19.4z"
									fill="#00D632"
								/><path
									d="M42.47 23.8c.5.5 1.33.5 1.8-.0l2.5-2.6c.53-.5.5-1.4-.06-1.94a19.73 19.73 0 0 0-6.72-3.84l.79-3.8c.17-.83-.45-1.61-1.28-1.61h-4.84a1.32 1.32 0 0 0-1.28 1.06l-.7 3.38c-6.44.33-11.9 3.6-11.9 10.3 0 5.8 4.51 8.29 9.28 10 4.51 1.72 6.9 2.36 6.9 4.78 0 2.49-2.38 3.95-5.9 3.95-3.2 0-6.56-1.07-9.16-3.68a1.3 1.3 0 0 0-1.84-.0l-2.7 2.7a1.36 1.36 0 0 0 .0 1.92c2.1 2.07 4.76 3.57 7.792 4.4l-.74 3.57c-.17.83.44 1.6 1.27 1.61l4.85.04a1.32 1.32 0 0 0 1.3-1.06l.7-3.39C40.28 49.07 45 44.8 45 38.57c0-5.74-4.7-8.16-10.4-10.13-3.26-1.21-6.08-2.04-6.08-4.53 0-2.42 2.63-3.38 5.27-3.38 3.36 0 6.59 1.39 8.7 3.29z"
									fill="#FFF"
								/></g
							></svg
						>
					</a>
				</div>
				<div>
					<a
						href="https://venmo.com/?txn=pay&audience=private&recipients=utdasu&amount=20.00&note=Paid%20membership%202023"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-16 w-16 rounded-full"
							viewBox="0 0 1333.33 1333.33"
							shape-rendering="geometricPrecision"
							text-rendering="geometricPrecision"
							image-rendering="optimizeQuality"
							fill-rule="evenodd"
							clip-rule="evenodd"
							><g fill-rule="nonzero"
								><path
									d="M157.62 0h1018.09c87.04 0 157.62 70.58 157.62 157.62v1018.09c0 87.04-70.58 157.62-157.62 157.62H157.62C70.58 1333.33 0 1262.74 0 1175.7V157.62C0 70.58 70.59 0 157.63 0z"
									fill="#3396cd"
								/><path
									d="M995.24 271.32c28.68 47.29 41.55 96.05 41.55 157.62 0 196.38-167.62 451.42-303.67 630.49H422.45L297.88 314.34 570 288.5l66.17 530.15c61.5-100.31 137.55-257.93 137.55-365.32 0-58.84-10.08-98.84-25.84-131.78l247.36-50.23z"
									fill="#fff"
								/></g
							></svg
						>
					</a>
				</div>
			</div>
			{#if stripe}
				<Elements
					{stripe}
					clientSecret={data.clientSecret}
					theme="flat"
					labels="floating"
					variables={{ colorPrimary: '#7c4dff' }}
					rules={{ '.Input': { border: 'solid 1px #0002' } }}
					bind:elements
				>
					<form on:submit|preventDefault={submit}>
						<PaymentElement />

						<button disabled={processing} class="btn btn-primary">
							{#if processing}
								Processing...
							{:else}
								Pay
							{/if}
						</button>
					</form>
				</Elements>
			{:else}
				Loading...
			{/if}
		</div>
	</div>
	<div
		class=" md:block md:absolute md:top-0 md:left-1/2 md:right-0 h-full bg-no-repeat bg-center bg-cover max-w-2xl"
	>
		<!-- Icon Blocks -->
		<div
			class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
			in:scale|global={{ delay: 1700, duration: 1000, easing: expoInOut }}
		>
			<div class="grid grid-cols-2 items-center gap-2">
				<!-- Icon Block -->
				<a
					class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-slate-800"
					href="#"
				>
					<div class="flex justify-center items-center w-12 h-12 bg-primary rounded-xl">
						<svg
							version="1.1"
							id="Capa_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							class="p-1.5 w-12 md:w-24 m-auto"
							viewBox="0 0 295.526 295.526"
							style="enable-background:new 0 0 295.526 295.526;"
							xml:space="preserve"
						>
							<g class="">
								<path
									class="fill-white"
									d="M147.763,44.074c12.801,0,23.858-8.162,27.83-20.169c-7.578,2.086-17.237,3.345-27.83,3.345
                            c-10.592,0-20.251-1.259-27.828-3.345C123.905,35.911,134.961,44.074,147.763,44.074z"
								/>
								<path
									class="fill-white"
									d="M295.158,58.839c-0.608-1.706-1.873-3.109-3.521-3.873l-56.343-26.01c-11.985-4.06-24.195-7.267-36.524-9.611
                            c-0.434-0.085-0.866-0.126-1.292-0.126c-3.052,0-5.785,2.107-6.465,5.197c-4.502,19.82-22.047,34.659-43.251,34.659
                            c-21.203,0-38.749-14.838-43.25-34.659c-0.688-3.09-3.416-5.197-6.466-5.197c-0.426,0-0.858,0.041-1.292,0.126
                            c-12.328,2.344-24.538,5.551-36.542,9.611L3.889,54.965c-1.658,0.764-2.932,2.167-3.511,3.873
                            c-0.599,1.726-0.491,3.589,0.353,5.217l24.46,48.272c1.145,2.291,3.474,3.666,5.938,3.666c0.636,0,1.281-0.092,1.917-0.283
                            l27.167-8.052v161.97c0,3.678,3.001,6.678,6.689,6.678h161.723c3.678,0,6.67-3.001,6.67-6.678V107.66l27.186,8.052
                            c0.636,0.191,1.28,0.283,1.915,0.283c2.459,0,4.779-1.375,5.94-3.666l24.469-48.272C295.629,62.428,295.747,60.565,295.158,58.839z
                            "
								/>
							</g>
						</svg>
					</div>
					<div class="mt-5">
						<h3
							class="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400"
						>
							Free ASU Merch
						</h3>
						<p class="mt-1 text-gray-600 dark:text-gray-400">
							You get priority for ASU merchandise drops
						</p>
					</div>
				</a>
				<!-- End Icon Block -->

				<!-- Icon Block -->
				<div
					class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-slate-800"
					in:scale|global={{ delay: 2500, duration: 1000, easing: expoInOut }}
				>
					<div class="flex justify-center items-center w-12 h-12 bg-primary rounded-xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							version="1.1"
							width="256"
							height="256"
							class="p-1.5 h-auto w-12 md:w-24 m-auto"
							viewBox="0 0 256 256"
							xml:space="preserve"
						>
							<defs />
							<g
								style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;"
								transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
							>
								<path
									class="fill-white"
									d="M 34.004 30.61 c -4.348 0 -7.885 -3.537 -7.885 -7.885 s 3.537 -7.885 7.885 -7.885 c 4.348 0 7.885 3.537 7.885 7.885 S 38.352 30.61 34.004 30.61 z M 34.004 18.84 c -2.143 0 -3.885 1.743 -3.885 3.885 s 1.743 3.885 3.885 3.885 c 2.142 0 3.885 -1.743 3.885 -3.885 S 36.146 18.84 34.004 18.84 z"
									style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;"
									transform=" matrix(1 0 0 1 0 0) "
									stroke-linecap="round"
								/>
								<path
									class="fill-white"
									d="M 31.01 49.392 c -0.482 0 -0.966 -0.174 -1.35 -0.525 c -0.815 -0.746 -0.87 -2.011 -0.125 -2.825 L 57.515 15.49 c 0.746 -0.814 2.01 -0.871 2.825 -0.125 c 0.814 0.746 0.87 2.011 0.124 2.826 L 32.485 48.742 C 32.091 49.173 31.551 49.392 31.01 49.392 z"
									style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;"
									transform=" matrix(1 0 0 1 0 0) "
									stroke-linecap="round"
								/>
								<path
									class="fill-white"
									d="M 55.996 49.392 c -4.349 0 -7.886 -3.537 -7.886 -7.884 c 0 -4.348 3.537 -7.885 7.886 -7.885 c 4.348 0 7.885 3.537 7.885 7.885 C 63.881 45.854 60.344 49.392 55.996 49.392 z M 55.996 37.622 c -2.143 0 -3.886 1.743 -3.886 3.885 c 0 2.142 1.743 3.884 3.886 3.884 c 2.142 0 3.885 -1.743 3.885 -3.884 C 59.881 39.365 58.138 37.622 55.996 37.622 z"
									style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;"
									transform=" matrix(1 0 0 1 0 0) "
									stroke-linecap="round"
								/>
								<path
									class="fill-white"
									d="M 45 90 c -0.407 0 -0.813 -0.124 -1.161 -0.371 L 7.669 63.861 c -0.708 -0.505 -1.009 -1.409 -0.744 -2.238 c 0.265 -0.828 1.035 -1.391 1.905 -1.391 h 6.566 V 2 c 0 -1.104 0.896 -2 2 -2 h 55.208 c 1.104 0 2 0.896 2 2 v 58.232 h 6.567 c 0.87 0 1.64 0.563 1.905 1.391 c 0.265 0.829 -0.036 1.733 -0.745 2.238 L 46.16 89.629 C 45.813 89.876 45.407 90 45 90 z M 15.084 64.232 L 45 85.544 l 29.916 -21.312 h -2.313 c -1.104 0 -2 -0.896 -2 -2 V 4 H 19.396 v 58.232 c 0 1.104 -0.896 2 -2 2 H 15.084 z"
									style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10;  fill-rule: nonzero; opacity: 1;"
									transform=" matrix(1 0 0 1 0 0) "
									stroke-linecap="round"
								/>
							</g>
						</svg>
					</div>
					<div class="mt-5">
						<h3
							class="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400"
						>
							Event Discounts
						</h3>
						<p class="mt-1 text-gray-600 dark:text-gray-400">
							Components are easily customized and extendable
						</p>
					</div>
				</div>
				<!-- End Icon Block -->

				<!-- Icon Block -->
				<div
					class="group flex flex-col justify-center hover:bg-gray-50 rounded-xl p-4 md:p-7 dark:hover:bg-slate-800"
					in:scale|global={{ delay: 3300, duration: 1000, easing: expoInOut }}
				>
					<div class="flex justify-center items-center w-12 h-12 bg-primary rounded-xl">
						<svg
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							class="p-1.5 w-12 md:w-24 m-auto"
							viewBox="0 0 1000 1000"
							enable-background="new 0 0 1000 1000"
							xml:space="preserve"
						>
							<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
							<g
								><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"
									><path
										class="fill-white"
										d="M4941.8,4971c-21.8-21.8-43.6-59.4-49.5-83.2c-5.9-25.7-9.9-350.5-5.9-722.8c5.9-667.3,5.9-679.2,49.5-720.8c61.4-63.4,158.4-59.4,217.8,9.9l45.5,53.5v702.9v702.9l-49.5,47.5C5090.4,5022.5,4997.3,5026.4,4941.8,4971z"
									/><path
										class="fill-white"
										d="M3328,4109.6c-53.5-51.5-61.4-114.9-23.8-180.2c51.5-89.1,540.6-603.9,586.1-615.8c108.9-27.7,219.8,73.3,194.1,176.2c-11.9,43.6-443.6,540.6-552.5,635.6C3474.6,4175,3385.4,4169,3328,4109.6z"
									/><path
										class="fill-white"
										d="M6318,3824.5c-297-213.9-441.6-330.7-453.5-366.3c-43.6-116.8,69.3-241.6,180.2-198c65.3,25.7,857.4,590.1,893,635.6c39.6,53.5,29.7,152.5-21.8,200C6827,4178.9,6783.4,4159.1,6318,3824.5z"
									/><path
										class="fill-white"
										d="M2664.7,3008.7c-158.4-25.7-314.8-110.9-358.4-196c-53.5-103-176.2-988.1-237.6-1722.7c-33.7-378.2-33.7-1257.4-2-1534.6c71.3-613.8,213.9-1011.9,447.5-1249.5c105-106.9,132.7-124.8,215.8-136.6c51.5-7.9,93.1-25.7,93.1-37.6c0-13.9-61.4-413.8-138.6-889.1c-75.2-475.2-138.6-869.3-138.6-875.2c0-7.9-73.3-7.9-162.4,0c-362.4,27.7-712.8-55.4-871.3-207.9c-108.9-105-132.7-190.1-93.1-332.7c69.3-251.5,514.8-493.1,1083.1-588.1c285.2-47.5,750.5-33.7,936.6,25.7c170.3,55.4,289.1,142.6,336.6,247.5c49.5,112.9,47.5,166.3-15.9,293.1c-97,188.1-358.4,346.5-756.4,459.4c-138.6,37.6-156.4,49.5-150.5,83.2c21.8,95,267.3,1661.3,267.3,1704.9c0,45.5,4,45.5,124.8,33.7c110.9-9.9,138.6-4,237.6,43.6c322.8,158.4,619.8,546.5,871.3,1138.6c215.8,510.9,455.4,1360.4,598,2124.7c19.8,105,41.6,192.1,49.5,192.1c5.9,0,37.6-130.7,67.3-291.1c75.3-382.2,245.5-1057.4,348.5-1382.1c247.5-766.3,526.7-1295,837.6-1588.1c196.1-182.2,334.7-249.5,495.1-239.6l118.8,5.9l134.6-841.6c73.3-463.4,138.6-865.3,144.6-893c9.9-49.5,3.9-53.5-156.4-93.1c-184.2-45.5-451.5-164.3-578.2-259.4c-190.1-140.6-261.4-318.8-188.1-481.2c47.5-110.9,142.6-184.2,316.8-249.5c112.9-41.6,174.2-51.5,431.7-59.4c895-27.7,1685.1,342.6,1621.7,762.4c-19.8,130.7-146.5,255.4-326.7,316.8c-172.3,59.4-447.5,91.1-647.5,75.2c-91.1-7.9-164.3-9.9-164.3-4s-61.4,400-138.6,875.2c-75.2,475.2-138.6,877.2-138.6,891.1c0,15.8,37.6,29.7,95,39.6c81.2,11.9,108.9,29.7,213.8,138.6c287.1,297,437.6,837.6,473.3,1702.9c25.7,580.2-69.3,1744.5-207.9,2574.2c-35.6,209.9-39.6,219.8-114.8,291.1c-128.7,118.8-247.5,144.6-657.4,142.6c-673.3-4-1487.1-184.2-1867.3-411.9l-112.9-69.3l-112.9,69.3C4432.9,2880,3227,3097.8,2664.7,3008.7z M3490.4,2683.9c261.4-35.6,594-104.9,841.6-180.2c194-57.4,447.5-174.2,461.4-209.9c4-13.8-15.8-158.4-45.5-322.8c-49.5-269.3-57.4-297-93.1-293.1c-75.2,9.9-2059.4,322.8-2116.8,334.6l-55.4,11.9l13.9,122.8c5.9,65.4,27.7,209.9,45.5,318.8l33.7,196l79.2,23.8C2767.6,2721.5,3217.1,2719.6,3490.4,2683.9z M7329.9,2691.8c47.5-11.9,91.1-27.7,95.1-35.6c15.8-25.7,95-617.8,85.1-627.7c-9.9-9.9-1972.2-328.7-2142.5-348.5l-59.4-5.9l-55.4,306.9l-53.5,306.9l51.5,43.6c144.6,114.8,732.7,281.2,1251.5,352.5C6743.8,2715.6,7213.1,2721.5,7329.9,2691.8z M3557.7,1535.4c578.2-91.1,1057.4-170.3,1061.4-176.2c11.9-11.9-53.5-328.7-142.6-685.1c-295-1176.2-661.4-1950.4-1053.4-2219.7c-97-67.3-124.7-69.3-421.8-17.8c-219.8,37.6-229.7,41.6-293.1,112.9c-142.6,162.4-247.5,455.4-314.8,885.1c-49.5,308.9-49.5,1334.6,0,1853.4c39.6,411.9,41.6,415.8,83.2,415.8C2492.4,1703.8,2979.5,1628.5,3557.7,1535.4z M7563.6,1670.1c5.9-19.8,25.7-196,43.5-392.1c43.6-445.5,51.5-1508.9,11.9-1782.1c-63.4-439.6-180.2-782.2-324.7-946.5c-63.4-71.3-73.3-75.3-293.1-112.9c-297-51.5-324.8-49.5-421.8,17.8c-318.8,219.8-635.6,792.1-885.1,1611.8c-132.7,427.7-334.6,1269.3-312.9,1293c11.9,11.9,2037.6,338.6,2118.8,342.6C7533.9,1703.8,7555.6,1691.9,7563.6,1670.1z M2638.9-3979.2c140.6-23.8,320.8-63.4,402-91.1c176.2-57.4,388.1-176.2,431.7-243.6c29.7-43.5,27.7-47.5-5.9-75.2c-63.4-45.5-227.7-85.1-407.9-99c-429.7-29.7-1077.2,136.6-1285.1,330.7c-73.3,67.3-69.3,97,11.9,138.6C1957.8-3933.7,2262.7-3919.9,2638.9-3979.2z M8139.8-3989.1c188.1-63.4,188.1-118.8-4-233.7c-326.7-194.1-877.2-305-1271.2-255.4c-194.1,23.8-358.4,83.2-358.4,130.7c0,35.6,116.8,128.7,237.6,190.1c150.5,77.2,299,120.8,564.3,170.3C7617-3931.7,7975.4-3931.7,8139.8-3989.1z"
									/><path
										class="fill-white"
										d="M3080.5,945.4c-25.7-13.9-61.4-47.5-77.2-75.3C2932,741.4,3108.2,596.8,3233,684c93.1,65.3,71.3,227.7-37.6,265.3c-33.7,11.9-61.4,21.8-63.4,21.8C3130,971.1,3108.2,959.2,3080.5,945.4z"
									/><path
										class="fill-white"
										d="M3397.3,416.7c-23.8-23.8-39.6-65.4-39.6-108.9c0-136.6,150.5-198,247.5-99c99,97,39.6,247.5-99,247.5C3462.7,456.3,3421.1,440.4,3397.3,416.7z"
									/><path
										class="fill-white"
										d="M2900.3,62.2c-57.4-45.5-61.4-160.4-7.9-219.8c55.4-61.4,174.2-53.5,225.7,11.9c55.4,69.3,51.5,136.6-7.9,196C3052.8,109.7,2965.7,115.7,2900.3,62.2z"
									/><path
										class="fill-white"
										d="M3270.6-436.8c-91.1-71.3-51.5-247.5,57.4-257.4c120.8-9.9,188.1,43.6,188.1,148.5c0,77.2-73.3,150.5-148.5,150.5C3343.9-395.2,3300.3-413,3270.6-436.8z"
									/><path
										d="M6791.3,949.3c-93.1-45.5-110.9-172.3-37.6-245.5c75.2-77.2,202-53.5,245.5,43.6c31.7,69.3,27.7,97-21.8,152.5C6924,959.2,6850.7,977,6791.3,949.3z"
									/><path
										class="fill-white"
										d="M6387.3,416.7c-59.4-59.4-53.5-164.4,11.9-215.8c69.3-55.4,148.5-53.5,202,4c95,99,29.7,251.5-104.9,251.5C6452.7,456.3,6411.1,440.4,6387.3,416.7z"
									/><path
										class="fill-white"
										d="M6892.3,50.3c-59.4-59.4-63.4-126.7-7.9-196c85.2-108.9,263.4-43.6,263.4,97C7147.7,89.9,6991.3,151.3,6892.3,50.3z"
									/><path
										class="fill-white"
										d="M6537.8-436.8c-91.1-73.3-49.5-249.5,63.4-257.4c118.8-7.9,182.2,43.6,182.2,150.5c0,75.2-73.3,148.5-148.5,148.5C6611.1-395.2,6567.5-413,6537.8-436.8z"
									/></g
								></g
							>
						</svg>
					</div>
					<div class="mt-5">
						<h3
							class="group-hover:text-gray-600 text-lg font-semibold text-gray-800 dark:text-white dark:group-hover:text-gray-400"
						>
							Exclusive Events
						</h3>
						<p class="mt-1 text-gray-600 dark:text-gray-400">
							Get access to member only events year round
						</p>
					</div>
				</div>
				<!-- End Icon Block -->
			</div>
		</div>
		<!-- End Icon Blocks -->
	</div>
	<!-- End Col -->
</div>
<!-- End Hero -->
