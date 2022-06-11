<script>
	const handleSubmit = async (event) => {
		const formData = new FormData(event.target);
		console.log(formData);

		const result = await fetch('/register/list', {
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
			<h3 class="text-3xl">Join our Mailing List</h3>
		</div>
	</div>
	<div class="flex justify-center">
		<form on:submit|preventDefault={handleSubmit} class="w-full max-w-sm">
			<div class="flex items-center border-b border-[#79535C] py-2">
				<input
					class="appearance-none bg-transparent border-none w-full text-slate-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
					type="email"
					placeholder="Email"
					aria-label="email"
					name="email"
				/>
				<button
					class="flex-shrink-0 bg-[#79535C] hover:bg-[#79424C] border-[#79535C] hover:border-[#79424C] text-sm border-4 text-slate-100 py-1 px-2 rounded"
					type="submit"
				>
					Sign Up
				</button>
			</div>
		</form>
	</div>
</div>
