<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<form class="my-5 mx-2 px-3 py-4 rounded-lg shadow-lg bg-gray-700">
	<div class="grid xl:grid-cols-2 xl:gap-6">
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="floating_first_name"
				id="floating_first_name"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-white focus:outline-none focus:ring-0 focus:border-white peer"
				placeholder=" "
				required=""
			/>
			<label
				for="floating_first_name"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>First name</label
			>
		</div>
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="floating_last_name"
				id="floating_last_name"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				required=""
			/>
			<label
				for="floating_last_name"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Last name</label
			>
		</div>
	</div>
	<div class="relative z-0 w-full mb-6 group">
		<input
			type="email"
			name="floating_email"
			class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
			placeholder=" "
			required=""
		/>
		<label
			for="floating_email"
			class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
			>Email address</label
		>
	</div>

	<div class="grid xl:grid-cols-2 xl:gap-6">
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="tel"
				pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
				name="floating_phone"
				id="floating_phone"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				required=""
			/>
			<label
				for="floating_phone"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Phone number (No spaces)</label
			>
		</div>
		<div class="relative z-0 w-full mb-6 group">
			<input
				type="text"
				name="floating_company"
				id="floating_company"
				class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
				placeholder=" "
				required=""
			/>
			<label
				for="floating_company"
				class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
				>Company (Ex. Google)</label
			>
		</div>
	</div>

	<div class="relative z-0 w-full mb-6 group">
		<input
			checked
			id="checked-checkbox"
			type="checkbox"
			value=""
			class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
		/>
		<label for="checked-checkbox" class="ml-2 text-sm font-normal text-gray-900 dark:text-gray-300"
			>Join the Dance Team</label
		>
	</div>

	<button
		type="submit"
		class="text-white bg-[#79535C] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-[#79535C] dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>Submit</button
	>
</form>
