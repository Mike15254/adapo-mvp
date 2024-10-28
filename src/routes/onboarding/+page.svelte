<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { onboardingStore } from '$lib/stores/onboardingStore';
	import { userType } from '$lib/stores/userStore';
	import type { InvestorOnboardingData, StartupOnboardingData } from '$lib/types/onboarding.types';
	import type { RegisterData } from '$lib/types/auth.types';
	import { loadProgress } from '$lib/utils/progress';
	import { OnboardingService } from '$lib/services/onboarding.service';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	// Base state
	let error = '';
	let isSubmitting = false;
	let showPassword = false;
	let showConfirmPassword = false;

	// Password validation state
	let passwordValidation = {
		hasUpperCase: false,
		hasLowerCase: false,
		hasNumber: false,
		hasSpecialChar: false,
		isLongEnough: false
	};

	// Investor profile data
	let investorData: Omit<InvestorOnboardingData, 'user'> = {
		type: 'individual',
		investment_focus: '',
		verificationStatus: 'pending',
		id_number: '',
		kra_pin: ''
	};

	// Startup profile data
	let startupData: Omit<StartupOnboardingData, 'user'> = {
		company_name: '',
		business_registration_number: '',
		industry: '',
		verification_status: 'pending',
		description: ''
	};

	// Constants
	const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Agriculture', 'Other'];
	const totalSteps = 3;
	const stepTitles = ['Choose Type', 'Account', 'Details'];

	// Reactive declarations
	$: selectedType = $userType;
	$: currentStep = $onboardingStore.currentStep;
	$: userData = $onboardingStore.userData;
	$: progressWidth = (currentStep / totalSteps) * 100;

	// Password validation function
	function validatePassword(password: string) {
		passwordValidation = {
			hasUpperCase: /[A-Z]/.test(password),
			hasLowerCase: /[a-z]/.test(password),
			hasNumber: /[0-9]/.test(password),
			hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password),
			isLongEnough: password.length >= 8
		};
		return Object.values(passwordValidation).every(Boolean);
	}

	// Form validation - updates when relevant fields change
	$: isPasswordValid = userData.password && validatePassword(userData.password);
	$: isPasswordMatch = userData.password === userData.passwordConfirm;
	$: isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email || '');
	$: isNameValid = (userData.name || '').trim().length >= 2;

	// Step-specific validation
	$: isStep2Valid = isPasswordValid && isPasswordMatch && isEmailValid && isNameValid;
	$: isStep3Valid =
		selectedType === 'investor'
			? investorData.type && investorData.investment_focus && investorData.id_number
			: startupData.company_name &&
				startupData.business_registration_number &&
				startupData.industry;

	// Navigation functions
	function selectType(type: 'investor' | 'startup') {
		userType.set(type);
		onboardingStore.updateUserData({ role: type });
		nextStep();
	}

	function nextStep() {
		if (currentStep === 2 && !isStep2Valid) return;
		if (currentStep === 3 && !isStep3Valid) return;
		onboardingStore.setStep(currentStep + 1);
	}

	function prevStep() {
		if (currentStep > 1) {
			onboardingStore.setStep(currentStep - 1);
		}
	}

	// Handle form submission
	async function handleSubmit() {
		try {
			if (!isStep3Valid) return;

			isSubmitting = true;
			error = '';

			// Prepare registration data
			const registrationData: RegisterData = {
				email: userData.email,
				password: userData.password,
				passwordConfirm: userData.passwordConfirm,
				name: userData.name,
				role: selectedType,
				username: userData.email.split('@')[0]
			};

			// Prepare profile data
			const profileData =
				selectedType === 'investor'
					? {
							...investorData,
							verificationStatus: 'pending'
						}
					: {
							...startupData,
							verification_status: 'pending'
						};

			// Complete registration
			await OnboardingService.completeRegistration(registrationData, profileData);
			onboardingStore.complete();

			// Redirect to dashboard
			setTimeout(() => goto(`/dashboard/${selectedType}`), 2000);
		} catch (err: any) {
			error = err?.message || 'Registration failed. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	// Load saved progress on mount
	onMount(() => {
		const savedProgress = loadProgress();
		if (savedProgress) {
			onboardingStore.updateUserData(savedProgress.userData);
			onboardingStore.setStep(savedProgress.currentStep);
			if (savedProgress.userData.role) {
				userType.set(savedProgress.userData.role);
			}
		} else {
			onboardingStore.reset();
		}
	});
</script>

<Navbar />
<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col">
	<div class="max-w-6xl mx-auto mt-12 pt-6 w-full px-4">
		<!-- Error Alert -->
		{#if error}
			<div
				class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-between"
				role="alert"
				transition:fade
			>
				<span>{error}</span>
				<button class="text-red-400 hover:text-red-600" on:click={() => (error = '')}>
					<svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		{/if}

		<!-- Main Content Container -->
		<div class="p-4" in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
			{#if isSubmitting}
				<LoadingScreen message="Creating your account..." />
			{:else}
				<!-- Back Button -->
				{#if currentStep > 1}
					<button
						type="button"
						class="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
						on:click={prevStep}
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back
					</button>
				{/if}

				<!-- Step 1: Choose Type -->
				{#if currentStep === 1}
					<div class="text-center" in:fade={{ duration: 300 }}>
						<h1 class="text-center text-7xl font-semibold text-gray-800 pb-3">
							Hi, Welcome to Adapo
						</h1>
						<p class="text-gray-800 mb-8 text-center pb-8 font-thin text-lg">
							Select how you would like to join adapo
						</p>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
							<!-- Investor Card -->
							<button
								class="group bg-[#f6f6ff] p-6 border-2 border-[#eaeaff] rounded-lg
                                       hover:border-[#b8b8ff] transition-all duration-300 hover:shadow-lg
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								class:border-indigo-600={selectedType === 'investor'}
								on:click={() => selectType('investor')}
							>
								<div
									class="bg-indigo-100 mx-auto h-24 w-24 mb-4 rounded-full
                                            flex items-center justify-center group-hover:bg-indigo-200
                                            transition-colors"
								>
									<!-- Investor Icon -->
									<svg
										class="w-12 h-12 text-indigo-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-semibold">Investor</h3>
								<p class="mt-2 text-gray-800">Find and invest in promising startups</p>
								<ul class="mt-4 text-sm text-gray-500 space-y-2 text-left">
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Discover investment opportunities
									</li>
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Track your investments
									</li>
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Connect with startups
									</li>
								</ul>
							</button>

							<!-- Startup Card -->
							<button
								class="group p-6 border-2 rounded-lg hover:border-[#b8b8ff]
                                       transition-all duration-300 hover:shadow-lg
                                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								class:border-indigo-600={selectedType === 'startup'}
								on:click={() => selectType('startup')}
							>
								<div
									class="bg-indigo-100 mx-auto h-24 w-24 mb-4 rounded-full
                                            flex items-center justify-center group-hover:bg-indigo-200
                                            transition-colors"
								>
									<!-- Startup Icon -->
									<svg
										class="w-12 h-12 text-indigo-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<h3 class="text-xl font-semibold">Startup</h3>
								<p class="mt-2 text-gray-800">Raise funds and grow your business</p>
								<ul class="mt-4 text-sm text-gray-500 space-y-2 text-left">
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Create funding campaigns
									</li>
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Showcase your startup
									</li>
									<li class="flex items-center">
										<svg
											class="w-4 h-4 mr-2 text-green-500"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Engage with investors
									</li>
								</ul>
							</button>
						</div>
					</div>
					<!-- Step 2: Account Details -->
				{:else if currentStep === 2}
					<div class="max-w-4xl mx-auto" in:fade={{ duration: 300 }}>
						<h2 class="text-center text-4xl font-semibold text-gray-800 mb-8">
							Create your {userData.role} account
						</h2>

						<form
							class="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200"
							on:submit|preventDefault={nextStep}
						>
							<!-- Name Field -->
							<div>
								<label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
								<div class="mt-1 relative">
									<input
										type="text"
										id="name"
										bind:value={userData.name}
										class="block w-full px-4 py-3 rounded-md border border-gray-300
                           placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500
                           transition duration-150 ease-in-out sm:text-sm"
										class:border-red-300={!isNameValid && userData.name}
										placeholder="John Doe"
										required
									/>
									{#if !isNameValid && userData.name}
										<div
											class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
										>
											<svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									{/if}
								</div>
								{#if !isNameValid && userData.name}
									<p class="mt-2 text-sm text-red-600">Please enter your full name</p>
								{/if}
							</div>

							<!-- Email Field -->
							<div>
								<label for="email" class="block text-sm font-medium text-gray-700"
									>Email Address</label
								>
								<div class="mt-1 relative">
									<input
										type="email"
										id="email"
										bind:value={userData.email}
										class="block w-full px-4 py-3 rounded-md border border-gray-300
                           placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500
                           transition duration-150 ease-in-out sm:text-sm"
										class:border-red-300={!isEmailValid && userData.email}
										placeholder="you@example.com"
										required
									/>
									{#if !isEmailValid && userData.email}
										<div
											class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
										>
											<svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
									{/if}
								</div>
								{#if !isEmailValid && userData.email}
									<p class="mt-2 text-sm text-red-600">Please enter a valid email address</p>
								{/if}
							</div>

							<!-- Password Field -->
							<div>
								<label for="password" class="block text-sm font-medium text-gray-700"
									>Password</label
								>
								<div class="mt-1 relative">
								<!-- avoid error 'type' attribute cannot be dynamic if input uses two-way binding  -->

									<input
                                    
										type='password'
										id="password"
										bind:value={userData.password}
										class="block w-full px-4 py-3 rounded-md border border-gray-300
                           placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500
                           transition duration-150 ease-in-out sm:text-sm pr-10"
										class:border-red-300={!isPasswordValid && userData.password}
										required
									/>
									<button
										type="button"
										class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
										on:click={() => (showPassword = !showPassword)}
									>
										{#if showPassword}
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</svg>
										{:else}
											<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
												/>
											</svg>
										{/if}
									</button>
								</div>

								<!-- Password Requirements -->
								{#if userData.password}
									<div class="mt-4 space-y-2">
										{#each Object.entries(passwordValidation) as [requirement, isValid]}
											<div class="flex items-center gap-2 text-sm">
												<div
													class={`h-4 w-4 rounded-full flex items-center justify-center
                                ${isValid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
												>
													<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
														<path
															fill-rule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clip-rule="evenodd"
														/>
													</svg>
												</div>
												<span class={isValid ? 'text-green-700' : 'text-gray-500'}>
													{#if requirement === 'isLongEnough'}
														At least 8 characters
													{:else if requirement === 'hasUpperCase'}
														One uppercase letter
													{:else if requirement === 'hasLowerCase'}
														One lowercase letter
													{:else if requirement === 'hasNumber'}
														One number
													{:else}
														One special character
													{/if}
												</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Confirm Password Field -->
							<div>
								<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
									Confirm Password
								</label>
								<div class="mt-1 relative">
									<input
										type='password'
										id="confirmPassword"
										bind:value={userData.passwordConfirm}
										class="block w-full px-4 py-3 rounded-md border border-gray-300
                           placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500
                           transition duration-150 ease-in-out sm:text-sm pr-10"
										class:border-red-300={!isPasswordMatch && userData.passwordConfirm}
										required
									/>
									<button
										type="button"
										class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
										on:click={() => (showConfirmPassword = !showConfirmPassword)}
									>
										<!-- Same eye icons as password field -->
									</button>
								</div>
								{#if !isPasswordMatch && userData.passwordConfirm}
									<p class="mt-2 text-sm text-red-600">Passwords do not match</p>
								{/if}
							</div>

							<!-- Continue Button -->
							<button
								type="submit"
								class="w-full flex justify-center py-3 px-4 border border-transparent
                   rounded-md shadow-sm text-sm font-medium text-white
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   transition-colors duration-200"
								class:bg-indigo-600={isStep2Valid}
								class:hover:bg-indigo-700={isStep2Valid}
								class:bg-gray-400={!isStep2Valid}
								disabled={!isStep2Valid}
							>
								Continue
							</button>
						</form>
					</div>

					<!-- Step 3: Profile Details -->
				{:else if currentStep === 3}
					<div class="max-w-4xl mx-auto" in:fade={{ duration: 300 }}>
						<h2 class="text-center text-4xl font-semibold text-gray-800 mb-8">
							Complete your {selectedType} profile
						</h2>

						<form
							class="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200"
							on:submit|preventDefault={handleSubmit}
						>
							{#if selectedType === 'investor'}
								<!-- Investor Profile Fields -->
								<div class="space-y-6">
									<!-- Type of Investor -->
									<div>
										<label for="investor-type" class="block text-sm font-medium text-gray-700">
											Type of Investor
										</label>
										<select
											bind:value={investorData.type}
											class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300
                               focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                               sm:text-sm rounded-md"
											required
										>
											<option value="individual">Individual Investor</option>
											<option value="institution">Institutional Investor</option>
										</select>
									</div>

									<!-- Investment Focus -->
									<div>
										<label for="investment-focus" class="block text-sm font-medium text-gray-700">
											Investment Focus
										</label>
										<select
											bind:value={investorData.investment_focus}
											class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300
                               focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                               sm:text-sm rounded-md"
											required
										>
											<option value="">Select focus area</option>
											{#each industries as industry}
												<option value={industry.toLowerCase()}>{industry}</option>
											{/each}
										</select>
									</div>

									<!-- ID Number -->
									<div>
										<label for="id-number" class="block text-sm font-medium text-gray-700">
											ID Number
										</label>
										<input
											type="text"
											id="id-number"
											bind:value={investorData.id_number}
											class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md
                               shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											required
										/>
									</div>

									<!-- KRA PIN -->
									<div>
										<label for="kra-pin" class="block text-sm font-medium text-gray-700">
											KRA PIN
										</label>
										<input
											type="text"
											id="kra-pin"
											bind:value={investorData.kra_pin}
											class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md
                               shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											required
										/>
									</div>
								</div>
							{:else}
								<!-- Startup Profile Fields -->
								<div class="space-y-6">
									<!-- Company Name -->
									<div>
										<label for="company-name" class="block text-sm font-medium text-gray-700">
											Company Name
										</label>
										<input
											type="text"
											id="company-name"
											bind:value={startupData.company_name}
											class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md
                   shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Your Company Name"
											required
										/>
									</div>

									<!-- Business Registration Number -->
									<div>
										<label
											for="business-registration"
											class="block text-sm font-medium text-gray-700"
										>
											Business Registration Number
										</label>
										<input
											type="text"
											id="business-registration"
											bind:value={startupData.business_registration_number}
											class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md
                   shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											placeholder="Registration Number"
											required
										/>
									</div>

									<!-- Industry -->
									<div>
										<label for="industry" class="block text-sm font-medium text-gray-700">
											Industry
										</label>
										<select
											id="industry"
											bind:value={startupData.industry}
											class="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300
                   focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                   sm:text-sm rounded-md"
											required
										>
											<option value="">Select your industry</option>
											{#each industries as industry}
												<option value={industry.toLowerCase()}>{industry}</option>
											{/each}
										</select>
									</div>

									<!-- Company Description -->
									<div>
										<label for="description" class="block text-sm font-medium text-gray-700">
											Company Description
										</label>
										<div class="mt-1">
											<textarea
												id="description"
												bind:value={startupData.description}
												rows="4"
												class="block w-full px-4 py-3 border border-gray-300 rounded-md
                       shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
												placeholder="Describe your company, mission, and goals..."
												required
											></textarea>
										</div>
									</div>
								</div>
							{/if}

							<!-- Submit Button -->
							<button
								type="submit"
								class="w-full flex justify-center items-center py-3 px-4 border border-transparent
           rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
           disabled:opacity-50 disabled:cursor-not-allowed"
								class:bg-indigo-600={isStep3Valid}
								class:hover:bg-indigo-700={isStep3Valid}
								class:bg-gray-400={!isStep3Valid}
								disabled={!isStep3Valid || isSubmitting}
							>
								{#if isSubmitting}
									<svg
										class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										>
										</path>
									</svg>
									Creating Account...
								{:else}
									Complete Registration
								{/if}
							</button>

							<!-- Terms and Privacy -->
							<div class="mt-4 text-center text-sm text-gray-500">
								By completing registration, you agree to our
								<a href="/terms" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
								and
								<a href="/privacy" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
							</div>
						</form>
					</div>
				{/if}

				<!-- Progress Bar -->
				<div class="max-w-4xl mx-auto mt-8">
					<div class="relative">
						<!-- Progress Bar -->
						<div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
							<div
								class="transition-all duration-700 ease-out bg-indigo-600"
								style="width: {progressWidth}%"
							></div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	/* Smooth transitions */
	.form-transition {
    transition-property: all;
    transition-duration: 200ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

	/* Form inputs */
	input:focus,
	select:focus,
	textarea:focus {
		@apply outline-none ring-2 ring-indigo-500 ring-opacity-50 border-indigo-500;
	}

	/* Button hover effects */
	button:not(:disabled):hover {
		transform: translateY(-1px);
	}

	/* Progress bar animations */
	@keyframes progress {
		from {
			width: 0;
		}
		to {
			width: var(--progress-width);
		}
	}

	.progress-bar {
		animation: progress 0.5s ease-in-out;
	}

	/* Checkmark animations */
	@keyframes checkmark {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
    input:focus, select:focus, textarea:focus {
    outline: none;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    border-color: #6366F1;
}

/* Button hover effects */
button:not(:disabled):hover {
    transform: translateY(-1px);
}

	.checkmark {
		animation: checkmark 0.2s ease-in-out;
	}
</style>
