<script>
	const handleSubmit = async (event) => {
		const formData = new FormData(event.target);
		console.log(formData);

		const result = await fetch('/api/register/list', {
			method: 'POST',
			body: formData
		});

		const response = await result.json();
		console.log(response);
	};
</script>

<div class="p-4">
	<div class="flex justify-center">
		<div>
			<h3 class="text-3xl text-secondary font-semibold font-epilogue">Join our Mailing List</h3>
		</div>
	</div>
	<div class="flex justify-center">
		<form on:submit|preventDefault={handleSubmit} class="w-full max-w-sm">
			<div class="flex items-center border-b border-secondary py-2">
				<input
					class="appearance-none bg-transparent border-none w-full text-neutral mr-3 py-1 px-2 leading-tight focus:outline-none focus: ring-secondary"
					type="email"
					placeholder="Email"
					aria-label="email"
					name="email"
				/>
				<button class="btn btn-primary btn-sm" type="submit"> Sign Up </button>
			</div>
		</form>
	</div>
</div>
