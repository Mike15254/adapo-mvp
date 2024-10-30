<script lang="ts">
    import { goto } from '$app/navigation';
    import { fade, fly, scale } from 'svelte/transition';
    import { AuthService, AuthError } from '$lib/services/auth.service';
    import { browser } from '$app/environment';
    import logo from '$lib/assets/adapo-logo.png';
    import LoadingScreen from '$lib/components/LoadingScreen.svelte';
    import type { LoginData } from '$lib/types/auth.types';

    // Form state
    let email = browser ? localStorage.getItem('rememberedEmail') || '' : '';
    let password = '';
    let showPassword = false;
    let rememberMe = browser ? localStorage.getItem('rememberMe') === 'true' : false;
    let isSubmitting = false;
	let isLoading = false;
	let isValid = false;

	interface FormError {
    type: 'UNVERIFIED_EMAIL' | 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED' | 'SERVER_ERROR' | 'VALIDATION_ERROR';
    message: string;
}

let error: FormError | null = null;
    
    // DOM refs
    let formElement: HTMLFormElement;
    let emailInput: HTMLInputElement;

    // Error handling types
    type ErrorType = 'INVALID_CREDENTIALS' | 'UNVERIFIED_EMAIL' | 'ACCOUNT_DISABLED' | 'SERVER_ERROR' | 'VALIDATION_ERROR';

    interface FormError {
        type: ErrorType;
        message: string;
    }

    interface FieldErrors {
        email: string;
        password: string;
    }

    
    let fieldErrors: FieldErrors = {
        email: '',
        password: ''
    };

    // Focus email input on mount if empty
    import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import LoadingButton from '$lib/components/LoadingButton.svelte';
    onMount(() => {
        if (!email && emailInput) {
            emailInput.focus();
        }
    });

    function validateForm(): boolean {
        let isValid = true;
        fieldErrors = {
            email: '',
            password: ''
        };

        // Email validation
        if (!email) {
            fieldErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            fieldErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (!password) {
            fieldErrors.password = 'Password is required';
            isValid = false;
        }

        if (!isValid) {
            error = {
                type: 'VALIDATION_ERROR',
                message: 'Please fix the errors below'
            };
        }

        return isValid;
    }


    // Update the handleError function
    function handleError(err: any) {
        const message = err?.response?.message || err?.message || 'An unexpected error occurred';
        
        if (message.includes('password') || message.includes('email')) {
            error = {
                type: 'INVALID_CREDENTIALS',
                message: 'Incorrect email or password. Please try again.'
            };
            fieldErrors.password = 'Incorrect password';
        } else if (message.includes('verification')) {
            error = {
                type: 'UNVERIFIED_EMAIL',
                message: 'Please verify your email before logging in.'
            };
        } else if (message.includes('disabled') || message.includes('suspended')) {
            error = {
                type: 'ACCOUNT_DISABLED',
                message: 'Your account has been disabled. Please contact support.'
            };
        } else {
            error = {
                type: 'SERVER_ERROR',
                message: 'An unexpected error occurred. Please try again later.'
            };
        }
    }

	async function handleSubmit() {
    if (!validateForm()) {
        return;
    }
    
    isSubmitting = true;
    error = null;

    try {
        await AuthService.login({ email, password });
    } catch (err) {
		logError(err, 'Login failed');
        
        if (err instanceof AuthError) {
            error = {
                type: err.code,
                message: err.message
            };
        } else {
            error = {
                type: 'SERVER_ERROR',
                message: err instanceof Error ? err.message : 'An unexpected error occurred'
            };
        }
    } finally {
        isSubmitting = false;
    }
}
function logError(error: unknown, context: string) {
    if (error instanceof AuthError) {
        console.error(`${context}:`, {
            type: error.code,
            message: error.message
        });
    } else if (error instanceof Error) {
        console.error(`${context}:`, {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    } else {
        console.error(`${context}:`, error);
    }
}
    async function handleResendVerification(userEmail: string) {
        try {
            isSubmitting = true;
            await AuthService.resendVerification(userEmail);
            error = {
                type: 'UNVERIFIED_EMAIL',
                message: 'A new verification email has been sent to your inbox.'
            };
        } catch (err) {
            error = {
                type: 'SERVER_ERROR',
                message: 'Failed to resend verification email. Please try again later.'
            };
        } finally {
            isSubmitting = false;
        }
    }


    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter' && !isSubmitting) {
            handleSubmit();
        }
    }

    
</script>

<Navbar/>

<div
	class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center sm:px-6 lg:px-8"
>

	<div class="sm:mx-auto sm:w-full sm:max-w-md" in:fly={{ y: 20, duration: 700, delay: 200 }}>
		
		<h2
			class="mt-6 text-center text-3xl font-extrabold text-gray-900"
			in:fly={{ y: 20, duration: 700, delay: 400 }}
		>
			Welcome back
		</h2>
		<p
			class="mt-2 text-center text-sm text-gray-600 space-x-1"
			in:fly={{ y: 20, duration: 700, delay: 500 }}
		>
			<span>New to Adapo?</span>
			<a
				href="/onboarding"
				class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
			>
				Start your journey with us
			</a>
		</p>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md" in:fly={{ y: 20, duration: 700, delay: 600 }}>
		<div class="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-100">
           
			<form bind:this={formElement} class="space-y-6" on:submit|preventDefault={handleSubmit}>
				{#if error}
    <div
        class="rounded-md bg-red-50 p-4 shadow-sm"
        in:fly={{ y: -20, duration: 300 }}
        out:fade
        role="alert"
    >
        <div class="flex">
            <div class="flex-shrink-0">
                <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                    />
                </svg>
            </div>
            <div class="ml-3">
                <!-- Change this line -->
                <p class="text-sm font-medium text-red-800">{error.message}</p>
                
                {#if error.type === 'UNVERIFIED_EMAIL'}
                    <button 
                        class="mt-2 text-sm text-red-800 underline"
                        on:click={() => handleResendVerification(email)}
                        disabled={isSubmitting}
                    >
                        Resend verification email
                    </button>
                {/if}
            </div>
        </div>
    </div>
{/if}

				<div class="space-y-2">
					<label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
					<div class="relative rounded-md shadow-sm">
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							
						</div>
						<input
							bind:this={emailInput}
							id="email"
							type="email"
							bind:value={email}
							required
							class="block w-full  px-4 py-3 border {fieldErrors.email
								? 'border-red-300'
								: 'border-gray-300'} 
           rounded-md shadow-sm placeholder-gray-400
           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							placeholder="you@example.com"
							class:border-red-300={fieldErrors.email}
							aria-invalid={fieldErrors.email ? 'true' : 'false'}
						/>
						{#if fieldErrors.email}
							<p class="mt-2 text-sm text-red-600" id="email-error">{fieldErrors.email}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
						<div class="relative rounded-md shadow-sm">
							<div class="absolute inset-y-0 left-0 px-4 flex items-center pointer-events-none">
								
							</div>
							{#if showPassword}
								<input
									id="password"
									type="text"
									bind:value={password}
									required
									class="px-4 py-3 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow duration-200"
									placeholder="••••••••"
								/>
							{:else}
								<input
									id="password"
									type="password"
									bind:value={password}
									required
									class="px-4 py-3 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow duration-200"
									placeholder="••••••••"
								/>
							{/if}
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center"
								on:click={() => (showPassword = !showPassword)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								<svg
									class="h-5 w-5 text-gray-400 hover:text-gray-500 transition-colors duration-200"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									{#if showPassword}
										<!-- Eye-off icon -->
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
										/>
									{:else}
										<!-- Eye icon -->
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
									{/if}
								</svg>
							</button>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<input
								id="remember-me"
								type="checkbox"
								bind:checked={rememberMe}
								class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
							/>
							<label for="remember-me" class="ml-2 block text-sm text-gray-900">
								Remember me
							</label>
						</div>

					</div>

					<div>
						<LoadingButton
							type="submit"
							text="Sign in"
							loadingText="Signing in..."
							loading={isSubmitting}
							
						/>
					</div>
				</div>
			</form>
         

			<div class="mt-6 text-center text-sm">
				<p class="text-gray-600">
					By signing in, you agree to our
					<a
						href="/terms"
						class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
					>
						Terms of Service
					</a>
					{' and '}
					<a
						href="/privacy"
						class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
					>
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	</div>
    
</div>


<style lang="postcss">
	/* Error shake animation */
	@keyframes error-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-10px);
		}
		75% {
			transform: translateX(10px);
		}
	}

	:global(.error-shake) {
		animation: error-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}

	/* Smooth focus transitions */
	input,
	button {
		@apply transition-all duration-200;
	}

	/* Input focus states */
	input:focus {
		@apply ring-2 ring-offset-2 ring-indigo-500 outline-none;
	}

	/* Error input states */
	input.border-red-300:focus {
		@apply ring-red-500 border-red-500;
	}
</style>
