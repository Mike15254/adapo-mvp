<script lang="ts">
	import { goto } from '$app/navigation';
	let firstName = '';
	let lastName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let errorMessage = '';
	let successMessage = '';
	let showPassword = false;
	let phoneNumber = '';

	let hasUpperCase = false;
	let hasLowerCase = false;
	let hasNumber = false;
	let hasSpecialChar = false;
	let isLongEnough = false;

	function validatePassword(pass: string) {
		hasUpperCase = /[A-Z]/.test(pass);
		hasLowerCase = /[a-z]/.test(pass);
		hasNumber = /[0-9]/.test(pass);
		hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(pass);
		isLongEnough = pass.length >= 8;
	}

	$: {
		validatePassword(password);
	}

	async function handleRegistration() {
		console.log('handleRegistration');
	}
</script>

<div class="absolute -top-1 -right-1 m-3">
	{#if successMessage}
		<p>Nice one</p>
	{/if}

	{#if errorMessage}
		<p>Not now</p>
	{/if}
</div>

<div class="max-w-md mx-auto border p-6 mt-10 rounded-lg shadow">
	<h2 class="text-xl font-bold">Sign Up</h2>
	<p class="text-sm text-gray-600 py-2">Enter your information to create an account</p>
	<form on:submit|preventDefault={handleRegistration} class="flex flex-col py-2 space-y-4">
		<div class="flex flex-row">
			<div class="flex flex-col w-1/2">
				<label for="name" class="block text-sm font-medium text-gray-700">First Name</label>
				<input
					type="text"
					id="name"
					placeholder="Michael"
					bind:value={firstName}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
					required
				/>
			</div>
			<div class="flex flex-col ml-4">
				<label for="name" class="block text-sm font-medium text-gray-700">Last Name</label>
				<input
					type="text"
					id="name"
					placeholder="Muia"
					bind:value={lastName}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
					required
				/>
			</div>
		</div>
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				placeholder="m@gmail.com"
				bind:value={email}
				class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				required
			/>
		</div>
		<div>
			<label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
			<input
				type="tel"
				id="phoneNumber"
				bind:value={phoneNumber}
				placeholder="+254"
				class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				required
			/>
		</div>
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<div class="relative">
				<input
					type="password"
					id="password"
					bind:value={password}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					class:hidden={showPassword}
				/>
				<input
					type="text"
					bind:value={password}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					class:hidden={!showPassword}
				/>
				<button
					type="button"
					class="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
					on:click={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
							<path
								fill-rule="evenodd"
								d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
								clip-rule="evenodd"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
								clip-rule="evenodd"
							/>
							<path
								d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
							/>
						</svg>
					{/if}
				</button>
			</div>
			{#if password.length > 0}
				<div class="mt-2 text-sm">
					<p class:text-green-500={isLongEnough} class:text-red-500={!isLongEnough}>
						{isLongEnough ? '✓' : '✗'} At least 8 characters long
					</p>
					<p class:text-green-500={hasUpperCase} class:text-red-500={!hasUpperCase}>
						{hasUpperCase ? '✓' : '✗'} Contains an uppercase letter
					</p>
					<p class:text-green-500={hasLowerCase} class:text-red-500={!hasLowerCase}>
						{hasLowerCase ? '✓' : '✗'} Contains a lowercase letter
					</p>
					<p class:text-green-500={hasNumber} class:text-red-500={!hasNumber}>
						{hasNumber ? '✓' : '✗'} Contains a number
					</p>
					<p class:text-green-500={hasSpecialChar} class:text-red-500={!hasSpecialChar}>
						{hasSpecialChar ? '✓' : '✗'} Contains a special character
					</p>
				</div>
			{/if}
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
				>Confirm Password</label
			>
			<div class="relative">
				<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					class:hidden={showPassword}
				/>
				<input
					type="text"
					bind:value={confirmPassword}
					class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					class:hidden={!showPassword}
				/>
			</div>
			{#if password && confirmPassword && password !== confirmPassword}
				<span class="text-xs text-red-500">Passwords do not match</span>
			{/if}
		</div>
		<button
			type="submit"
			class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			disabled={!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough) ||
				password !== confirmPassword}>Register</button
		>
	</form>

	<div class="flex flex-col items-center text-xs py-2">
		<h3 class="text-xs text-gray-800 items-center">By continung you agree with the Mzito</h3>
		<a href="/" class="text-amber-600 underline">terms and condtion</a>
	</div>
	<div class="mt-4 text-center text-xm">
		<a href="/account/login" class="text-sm text-indigo-600 hover:text-indigo-500"
			>Already have an account? Login</a
		>
	</div>
</div>
