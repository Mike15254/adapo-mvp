<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Confetti from 'svelte-confetti';
	import { pb } from '$lib/pocketbase';
	import { authStore } from '$lib/stores/authStore';
	import { onboardingStore } from '$lib/stores/onboardingStore';
	import { userType } from '$lib/stores/userStore';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	let error = '';
	let showConfetti = false;
	let isSubmitting = false;
	let formErrors: Record<string, string> = {};

	// Additional data for investors
	let investorData = {
		profession: '',
		type: 'individual',
		investment_focus: '',
		id_number: '',
		kra_pin: '',
		verificationStatus: 'pending'
	};

	// Additional data for startups
	let startupData = {
		company_name: '',
		description: '',
		industry: '',
		founding_date: '',
		business_registration_number: '',
		verification_status: 'pending'
	};

	let interests = [] as string[];
	const interestOptions = [
		'Technology',
		'Healthcare',
		'Finance',
		'Real Estate',
		'E-commerce',
		'Education',
		'Agriculture',
		'Manufacturing'
	];

	const totalSteps = 5;
	const stepTitles = ['Welcome', 'Choose Type', 'Account', 'Details', 'Complete'];

	$: selectedType = $userType;
	$: currentStep = $onboardingStore.currentStep;
	$: userData = $onboardingStore.userData;
	$: progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

	function validateInvestorData() {
		formErrors = {};
		if (!investorData.id_number) formErrors.id_number = 'ID number is required';
		if (!investorData.kra_pin) formErrors.kra_pin = 'KRA PIN is required';
		if (interests.length === 0) formErrors.interests = 'Select at least one interest';
		return Object.keys(formErrors).length === 0;
	}

	function validateStartupData() {
		formErrors = {};
		if (!startupData.company_name) formErrors.company_name = 'Company name is required';
		if (!startupData.business_registration_number)
			formErrors.business_registration_number = 'Registration number is required';
		if (!startupData.industry) formErrors.industry = 'Industry is required';
		if (!startupData.description || startupData.description.length < 50) {
			formErrors.description = 'Description should be at least 50 characters';
		}
		return Object.keys(formErrors).length === 0;
	}

	async function nextStep() {
		formErrors = {};
		error = '';

		if (currentStep === 3) {
			if (!validateForm()) return;
		} else if (currentStep === 4) {
			if (selectedType === 'investor') {
				if (!validateInvestorData()) return;
			} else {
				if (!validateStartupData()) return;
			}
		}

		// Add smooth transition
		await new Promise((resolve) => setTimeout(resolve, 300));
		onboardingStore.setStep(currentStep + 1);
	}

	function validateForm() {
		formErrors = {};

		if (!userData.name) formErrors.name = 'Name is required';
		if (!userData.email) formErrors.email = 'Email is required';
		if (!userData.password) formErrors.password = 'Password is required';
		if (userData.password !== userData.passwordConfirm) {
			formErrors.passwordConfirm = 'Passwords do not match';
		}
		if (userData.password && userData.password.length < 8) {
			formErrors.password = 'Password must be at least 8 characters';
		}
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (userData.email && !emailRegex.test(userData.email)) {
			formErrors.email = 'Invalid email format';
		}

		return Object.keys(formErrors).length === 0;
	}

	async function handleSubmit() {
		try {
			isSubmitting = true;
			error = '';

			// Create base user data
			const fullUserData = {
				...userData,
				account_status: 'pending',
				verification_status: 'unverified',
				registration_date: new Date().toISOString().split('T')[0]
			};

			// Create user in PocketBase
			const createdUser = await pb.collection('users').create(fullUserData);

			// Create additional profile
			if (selectedType === 'investor') {
				await pb.collection('investors').create({
					...investorData,
					user: createdUser.id,
					investment_focus: interests.join(', ')
				});
			} else {
				await pb.collection('startups').create({
					...startupData,
					user: createdUser.id
				});
			}

			// Login the user
			await authStore.login(userData.email, userData.password);

			// Show success state
			onboardingStore.complete();
			onboardingStore.setStep(5);
			showConfetti = true;

			// Redirect after delay
			setTimeout(() => goto(`/dashboard/${selectedType}`), 3000);
		} catch (err) {
			console.error('Registration error:', err);
			error = err instanceof Error ? err.message : 'Registration failed';
			onboardingStore.setStep(4); // Go back to form step
		} finally {
			isSubmitting = false;
		}
	}

	function prevStep() {
		onboardingStore.setStep(currentStep - 1);
	}

	function selectType(type: 'investor' | 'startup') {
		userType.set(type);
		onboardingStore.updateUserData({ role: type });
		nextStep();
	}

	onMount(() => {
		onboardingStore.reset();
	});
</script>

<div class="min-h-screen">
	<!-- Progress Steps -->
	<div class="max-w-4xl mx-auto pt-8 px-4">
		<div class="relative">
			<div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
				<div
					class="transition-all duration-700 ease-out bg-indigo-600"
					style="width: {progressWidth}%"
				/>
			</div>
			<div class="flex justify-between text-sm">
				{#each stepTitles as step, i}
					<div
						class="flex flex-col items-center transition-colors duration-300"
						class:text-indigo-600={i + 1 <= currentStep}
						class:text-gray-400={i + 1 > currentStep}
					>
						<div
							class="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors duration-300"
							class:border-indigo-600={i + 1 <= currentStep}
							class:border-gray-300={i + 1 > currentStep}
							class:bg-indigo-600={i + 1 < currentStep}
							class:text-white={i + 1 < currentStep}
						>
							{i + 1 < currentStep ? '✓' : i + 1}
						</div>
						<span class="hidden md:block">{step}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Content Area -->
	<div class="max-w-4xl mx-auto mt-12 px-4 pb-12">
		<div
			class="bg-white rounded-2xl shadow-xl p-8"
			in:fly={{ y: 20, duration: 400 }}
			out:fade={{ duration: 200 }}
		>
			{#if error}
				<div class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg" role="alert">
					{error}
				</div>
			{/if}

			{#if isSubmitting}
				<LoadingScreen message="Creating your account..." />
			{:else}
				<!-- Your step content here -->
				{#if currentStep === 1}
					<!-- Welcome Step Content -->
					<div class="text-center" in:fade={{ duration: 300 }}>
            <h1 class="text-4xl font-bold text-gray-900">
              Welcome to ADAPO
            </h1>
            <p class="mt-4 text-xl text-gray-600">
              Join our community of investors and innovative startups
            </p>
            <div class="mt-12 space-y-4">
              <p class="text-gray-500">
                Get ready to:
              </p>
              <div class="grid gap-4 max-w-lg mx-auto">
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <span class="font-medium text-indigo-600">✓ Connect</span>
                  <p class="text-sm text-gray-600 mt-1">
                    Join a vibrant community of innovators and investors
                  </p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <span class="font-medium text-indigo-600">✓ Grow</span>
                  <p class="text-sm text-gray-600 mt-1">
                    Access resources and opportunities for growth
                  </p>
                </div>
                <div class="p-4 bg-indigo-50 rounded-lg">
                  <span class="font-medium text-indigo-600">✓ Succeed</span>
                  <p class="text-sm text-gray-600 mt-1">
                    Achieve your investment or startup goals
                  </p>
                </div>
              </div>
            </div>
            <button
              class="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 transform hover:-translate-y-1"
              on:click={nextStep}
            >
              Get Started
            </button>
          </div>
				{:else if currentStep === 2}
					<!-- Account Type Selection Content -->
					<div class="text-center" in:fade={{ duration: 300 }}>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Choose your path</h2>
            <p class="text-gray-600 mb-8">Select how you want to participate in our platform</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                class="group p-6 border-2 rounded-lg hover:border-indigo-600 transition-all duration-200 hover:shadow-lg"
                class:border-indigo-600={selectedType === 'investor'}
                on:click={() => selectType('investor')}
              >
                <div class="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span class="text-2xl">💰</span>
                </div>
                <h3 class="text-xl font-semibold">Investor</h3>
                <p class="mt-2 text-gray-600">Find and invest in promising startups</p>
                <ul class="mt-4 text-sm text-gray-500 space-y-2 text-left">
                  <li>✓ Discover investment opportunities</li>
                  <li>✓ Track your investments</li>
                  <li>✓ Connect with startups</li>
                </ul>
              </button>
        
              <button
                class="group p-6 border-2 rounded-lg hover:border-indigo-600 transition-all duration-200 hover:shadow-lg"
                class:border-indigo-600={selectedType === 'startup'}
                on:click={() => selectType('startup')}
              >
                <div class="h-12 w-12 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span class="text-2xl">🚀</span>
                </div>
                <h3 class="text-xl font-semibold">Startup</h3>
                <p class="mt-2 text-gray-600">Raise funds and grow your business</p>
                <ul class="mt-4 text-sm text-gray-500 space-y-2 text-left">
                  <li>✓ Create funding campaigns</li>
                  <li>✓ Showcase your startup</li>
                  <li>✓ Engage with investors</li>
                </ul>
              </button>
            </div>
          </div>
				{:else if currentStep === 3}
					<!-- Account Creation Content -->
					<div class="max-w-md mx-auto" in:fade={{ duration: 300 }}>
            <h2 class="text-3xl font-semibold text-center mb-8">Create your account</h2>
            <form class="space-y-6" on:submit|preventDefault={nextStep}>
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  bind:value={userData.name}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  class:border-red-300={formErrors.name}
                />
                {#if formErrors.name}
                  <p class="mt-1 text-sm text-red-600">{formErrors.name}</p>
                {/if}
              </div>
        
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  bind:value={userData.email}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  class:border-red-300={formErrors.email}
                />
                {#if formErrors.email}
                  <p class="mt-1 text-sm text-red-600">{formErrors.email}</p>
                {/if}
              </div>
        
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  bind:value={userData.password}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  minlength="8"
                  class:border-red-300={formErrors.password}
                />
                {#if formErrors.password}
                  <p class="mt-1 text-sm text-red-600">{formErrors.password}</p>
                {/if}
                <p class="mt-1 text-sm text-gray-500">
                  Must be at least 8 characters
                </p>
              </div>
        
              <div>
                <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  bind:value={userData.passwordConfirm}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                  class:border-red-300={formErrors.passwordConfirm}
                />
                {#if formErrors.passwordConfirm}
                  <p class="mt-1 text-sm text-red-600">{formErrors.passwordConfirm}</p>
                {/if}
              </div>
        
              <button
                type="submit"
                class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Continue
              </button>
            </form>
          </div>
        
				{:else if currentStep === 4}
					<!-- Type-specific details Content -->
					<div class="max-w-md mx-auto" in:fade={{ duration: 300 }}>
  <h2 class="text-3xl font-semibold text-center mb-4">
    {selectedType === 'investor' ? 'Investment Details' : 'Company Details'}
  </h2>
  <p class="text-gray-600 text-center mb-8">
    {selectedType === 'investor' 
      ? 'Tell us more about your investment preferences'
      : 'Tell us more about your company'
    }
  </p>
  
  {#if selectedType === 'investor'}
    <div class="space-y-6">
      <!-- Investor Type Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Type of Investor <span class="text-red-500">*</span>
        </label>
        <select
          bind:value={investorData.type}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="individual">Individual</option>
          <option value="institution">Institution</option>
        </select>
        <p class="mt-1 text-sm text-gray-500">
          Select whether you're investing as an individual or institution
        </p>
      </div>
      
      <!-- ID Number -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          ID Number <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={investorData.id_number}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your National ID number"
          required
          class:border-red-300={formErrors.id_number}
        />
        {#if formErrors.id_number}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.id_number}
          </p>
        {/if}
      </div>

      <!-- KRA PIN -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          KRA PIN <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={investorData.kra_pin}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your KRA PIN"
          required
          class:border-red-300={formErrors.kra_pin}
        />
        {#if formErrors.kra_pin}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.kra_pin}
          </p>
        {/if}
        <p class="mt-1 text-sm text-gray-500">
          Your KRA PIN is required for tax compliance
        </p>
      </div>

      <!-- Investment Interests -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Investment Interests <span class="text-red-500">*</span>
        </label>
        <p class="text-sm text-gray-500 mb-3">
          Select the sectors you're interested in investing in
        </p>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Investment interests">
          {#each interestOptions as interest}
            <button
              type="button"
              class={`px-4 py-2 rounded-full text-sm transition-all duration-200 transform hover:scale-105 ${
                interests.includes(interest)
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              on:click={() => {
                if (interests.includes(interest)) {
                  interests = interests.filter(i => i !== interest);
                } else {
                  interests = [...interests, interest];
                }
              }}
              aria-pressed={interests.includes(interest)}
            >
              {interest}
            </button>
          {/each}
        </div>
        {#if formErrors.interests}
          <p class="mt-2 text-sm text-red-600" role="alert">
            {formErrors.interests}
          </p>
        {/if}
      </div>
    </div>

  {:else}
    <div class="space-y-6">
      <!-- Company Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Company Name <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={startupData.company_name}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your company name"
          required
          class:border-red-300={formErrors.company_name}
        />
        {#if formErrors.company_name}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.company_name}
          </p>
        {/if}
      </div>

      <!-- Business Registration -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Business Registration Number <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          bind:value={startupData.business_registration_number}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your registration number"
          required
          class:border-red-300={formErrors.business_registration_number}
        />
        {#if formErrors.business_registration_number}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.business_registration_number}
          </p>
        {/if}
        <p class="mt-1 text-sm text-gray-500">
          Your official business registration number from the government
        </p>
      </div>

      <!-- Industry -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Industry <span class="text-red-500">*</span>
        </label>
        <select
          bind:value={startupData.industry}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          class:border-red-300={formErrors.industry}
        >
          <option value="">Select your industry</option>
          <option value="tech">Technology</option>
          <option value="health">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="agriculture">Agriculture</option>
          <option value="other">Other</option>
        </select>
        {#if formErrors.industry}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.industry}
          </p>
        {/if}
      </div>

      <!-- Company Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Company Description <span class="text-red-500">*</span>
        </label>
        <textarea
          bind:value={startupData.description}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="4"
          placeholder="Describe your company, mission, and goals..."
          required
          class:border-red-300={formErrors.description}
        />
        {#if formErrors.description}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.description}
          </p>
        {/if}
        <p class="mt-1 text-sm text-gray-500">
          Minimum 50 characters. Be detailed about your company's mission and goals.
          <span class="text-indigo-600 font-medium">
            {startupData.description ? `${startupData.description.length}/50 characters` : '0/50 characters'}
          </span>
        </p>
      </div>

      <!-- Founding Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Founding Date <span class="text-red-500">*</span>
        </label>
        <input
          type="date"
          bind:value={startupData.founding_date}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          max={new Date().toISOString().split('T')[0]}
          class:border-red-300={formErrors.founding_date}
        />
        {#if formErrors.founding_date}
          <p class="mt-1 text-sm text-red-600" role="alert">
            {formErrors.founding_date}
          </p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Submit Button -->
  <button
    class="mt-8 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 flex items-center justify-center"
    on:click={handleSubmit}
    disabled={isSubmitting}
  >
    {#if isSubmitting}
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {/if}
    {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
  </button>

  <p class="mt-4 text-sm text-gray-500 text-center">
    By completing registration, you agree to our{' '}
    <a href="/terms" class="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
    {' '}and{' '}
    <a href="/privacy" class="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
  </p>
</div>
				{:else if currentStep === 5}
					<!-- Success Step Content -->
					<div class="text-center" in:fade={{ duration: 400 }}>
            <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
              <svg class="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5m18 14l8-8L43 31l-5 5L26 24l-8 8-9-9 8-8 3 3z"/>
              </svg>
            </div>
        
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome aboard!</h2>
            <p class="text-xl text-gray-600 mb-8">
              {#if selectedType === 'investor'}
                Your investor account has been created successfully.
              {:else}
                Your startup account has been created successfully.
              {/if}
            </p>
            
            <p class="text-gray-500 mb-8">
              Redirecting you to your dashboard in a moment...
            </p>
        
            {#if showConfetti}
              <div class="fixed inset-0 pointer-events-none">
                <Confetti
                  amount={150}
                  size={12}
                  duration={3000}
                  colorArray={['#818CF8', '#6366F1', '#4F46E5', '#C7D2FE']}
                  particlesShape="circle"
                />
              </div>
            {/if}
        
            <div class="mt-8 flex justify-center space-x-4">
              <div class="animate-pulse flex space-x-2">
                <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <div class="w-2 h-2 bg-indigo-600 rounded-full" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-indigo-600 rounded-full" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        {/if}

				<!-- Navigation Buttons -->
				{#if currentStep > 1 && currentStep < 5}
					<div class="mt-8 flex justify-between">
						<button class="text-gray-600 hover:text-gray-900 flex items-center" on:click={prevStep}>
							<span class="mr-2">←</span>
							Back
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
<style>
  /* Smooth transitions for all interactive elements */
  button, input, select, textarea {
    @apply transition-all duration-200;
  }

  /* Custom focus states */
  input:focus, select:focus, textarea:focus {
    @apply ring-2 ring-indigo-500 ring-opacity-50 border-indigo-500;
    outline: none;
  }

  /* Custom scrollbar for textarea */
  textarea {
    scrollbar-width: thin;
    scrollbar-color: #E5E7EB transparent;
  }

  textarea::-webkit-scrollbar {
    width: 8px;
  }

  textarea::-webkit-scrollbar-track {
    background: transparent;
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #E5E7EB;
    border-radius: 4px;
  }

  /* Button hover animation */
  button:not(:disabled):hover {
    transform: translateY(-1px);
  }

  /* Required field indicator */
  .required:after {
    content: " *";
    color: #EF4444;
  }
</style>