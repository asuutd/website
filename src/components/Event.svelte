<script>
	export let event;
	export let disabled;
	export let loading;

	console.log(loading);

	console.log(disabled);
	console.log(Math.floor(new Date(event?.date).getTime()));
	console.log(Date.now());
</script>

<div
	class="flex justify-center {Math.floor(new Date(event?.date).getTime()) < Date.now()
		? 'grayscale'
		: ''}"
>
	<div class="rounded-lg shadow-lg bg-gray-700 max-w-xs md:max-w-md max-h-sm">
		<div class="">
			<img
				class="rounded-t-lg object-scale-down"
				src={`${event?.image}-/scale_crop/500x500/smart/`}
				alt="It is what is it is"
			/>
		</div>
		<div class="p-6">
			<h5 class="text-slate-100 text-lg font-epilogue font-bold mb-2">{event?.description}</h5>
			<p class="text-gray-50 text-base mb-4">
				Some quick example text to build on the card title and make up the bulk of the card's
				content.
			</p>
			<button
				type="button"
				class=" inline-block px-6 py-2.5 bg-[#79535C] text-slate-100 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-[#79424C] hover:shadow-lg focus:bg-[#79424C] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#793B48] active:shadow-lg transition duration-150 ease-in-out"
				>REGISTER</button
			>
		</div>
	</div>
</div>
