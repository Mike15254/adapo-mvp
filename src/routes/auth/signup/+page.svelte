<script lang="ts">
    import { onMount } from 'svelte';
    import Stepper from '$lib/components/Stepper.svelte';
    import { goto } from '$app/navigation';
    import { Toast, Spinner } from 'flowbite-svelte';
    import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
    import { registerUser, verifyUser } from '$lib/userService';
    import type { User } from '$lib/userService';

    let currentStep: 'type' | 'info' | 'verify' | 'success' = 'type';

    let firstName = '';
    let lastName = '';
    let email = '';
    let password = '';
    let passwordConfirm = '';
    let profession = '';
    let userType: 'investor' | 'entrepreneur' | null = null;
    let investmentPreference: 'tech' | 'health' | 'finance' | 'other' | '' = '';
    let companyName = '';

    let verificationCode = '';
    let generatedCode = '';

    let errorMessage = '';
    let successMessage = '';
    let isLoading = false;

    function handleSelectUserType(type: 'investor' | 'entrepreneur') {
        userType = type;
        currentStep = 'info';
    }

    function goBack() {
        if (currentStep === 'info') {
            currentStep = 'type';
        } else if (currentStep === 'verify') {
            currentStep = 'info';
        }
    }

    async function handleSignup() {
        if (!userType) {
            errorMessage = "Please select a user type";
            return;
        }

        if (password !== passwordConfirm) {
            errorMessage = "Passwords do not match";
            return;
        }

        isLoading = true;
        errorMessage = '';

        try {
            const newUser: User = {
                id: Date.now().toString(),
                email,
                name: `${firstName} ${lastName}`,
                userType,
                password,
                verified: false
            };

            await registerUser(newUser);
            generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("Verification code:", generatedCode); // In a real app, this would be sent via email
            currentStep = 'verify';
            successMessage = 'Registration successful! Please check your email for the verification code.';
        } catch (error) {
            console.error('Error registering user:', error);
            errorMessage = 'An error occurred during registration. Please try again.';
        } finally {
            isLoading = false;
        }
    }

    async function handleVerifyEmail() {
        // we don't need to verify email for now
        // await pb.collection('users').update(user.id, { emailVerified: true });
       successMessage = 'Email verified! You can now log in.';
       goto('/auth/login');
        
    }
</script>

<div class="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
    <Stepper {currentStep} />

    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {#if currentStep === 'type'}
            <h2 class="text-2xl font-bold mb-6 text-center">Choose Your Account Type</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    on:click={() => handleSelectUserType('investor')}
                    class="py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1"
                >
                    Investor
                </button>
                <button
                    on:click={() => handleSelectUserType('entrepreneur')}
                    class="py-4 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out transform hover:-translate-y-1"
                >
                    Entrepreneur
                </button>
            </div>
        {:else if currentStep === 'info'}
            <h2 class="text-2xl font-bold mb-6 text-center">Tell us about yourself</h2>
            <form on:submit|preventDefault={handleSignup} class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" id="firstName" bind:value={firstName} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" id="lastName" bind:value={lastName} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" bind:value={email} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" bind:value={password} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input type="password" id="confirmPassword" bind:value={passwordConfirm} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="profession" class="block text-sm font-medium text-gray-700">What is your profession?</label>
                    <input type="text" id="profession" bind:value={profession} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                {#if userType === 'investor'}
                    <div>
                        <label for="investmentPreference" class="block text-sm font-medium text-gray-700">Investment Preference</label>
                        <select id="investmentPreference" bind:value={investmentPreference} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select preference</option>
                            <option value="tech">Technology</option>
                            <option value="health">Healthcare</option>
                            <option value="finance">Finance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                {:else if userType === 'entrepreneur'}
                    <div>
                        <label for="companyName" class="block text-sm font-medium text-gray-700">Company Name</label>
                        <input type="text" id="companyName" bind:value={companyName} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                {/if}
                <div class="flex justify-between">
                    <button type="button" on:click={goBack} class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Back
                    </button>
                    <button type="submit" class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center" disabled={isLoading}>
                        {#if isLoading}
                            <Spinner class="mr-2" size="4" color="white" />
                        {/if}
                        Next
                    </button>
                </div>
            </form>
        {:else if currentStep === 'verify'}
            <h2 class="text-2xl font-bold mb-6 text-center">Verify your email address</h2>
            <p class="mb-4 text-center">We've sent a six-digit code to <strong>{email}</strong>. Enter the code below to confirm your email address.</p>
            <form on:submit|preventDefault={handleVerifyEmail} class="space-y-4">
                <div>
                    <label for="verificationCode" class="block text-sm font-medium text-gray-700">Verification Code</label>
                    <input type="text" id="verificationCode" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div class="flex justify-between">
                    <button type="button" on:click={goBack} class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Back
                    </button>
                    <button type="submit" class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center" disabled={isLoading}>
                        {#if isLoading}
                            <Spinner class="mr-2" size="4" color="white" />
                        {/if}
                        Verify Email
                    </button>
                </div>
            </form>
        {:else if currentStep === 'success'}
            <div class="text-center">
                <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 class="mt-4 text-2xl font-bold text-gray-900">Registration Successful!</h2>
                <p class="mt-2 text-gray-600">Your account has been created and your email has been verified.</p>
                <button
                    on:click={() => goto('/auth/login')}
                    class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Log In
                </button>
            </div>
        {/if}
    </div>
</div>

{#if successMessage}
    <Toast color="green" class="fixed bottom-4 right-4 z-50">
        <svelte:fragment slot="icon">
            <CheckCircleSolid class="w-5 h-5" />
        </svelte:fragment>
        {successMessage}
    </Toast>
{/if}

{#if errorMessage}
    <Toast color="red" class="fixed bottom-4 right-4 z-50">
        <svelte:fragment slot="icon">
            <CloseCircleSolid class="w-5 h-5" />
        </svelte:fragment>
        {errorMessage}
    </Toast>
{/if}