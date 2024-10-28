<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';
  import { AuthService } from '$lib/services/auth.service';
  import { browser } from '$app/environment';
  import logo from '$lib/assets/adapo-logo.png';

  let email = browser ? localStorage.getItem('rememberedEmail') || '' : '';
  let password = '';
  let error = '';
  let isLoading = false;
  let showPassword = false;
  let rememberMe = browser ? localStorage.getItem('rememberMe') === 'true' : false;
  let formElement: HTMLFormElement;
  let emailInput: HTMLInputElement;

  // Focus email input on mount if empty
  import { onMount } from 'svelte';
  onMount(() => {
      if (!email && emailInput) {
          emailInput.focus();
      }
  });

  async function handleSubmit() {
      if (!validateForm()) return;
      
      isLoading = true;
      error = '';
      
      try {
          const authData = await AuthService.login(email, password);
          
          // Handle remember me
          if (browser) {
              if (rememberMe) {
                  localStorage.setItem('rememberedEmail', email);
                  localStorage.setItem('rememberMe', 'true');
              } else {
                  localStorage.removeItem('rememberedEmail');
                  localStorage.removeItem('rememberMe');
              }
          }
          
          // Redirect based on user role
          const role = authData.record.role;
          await goto(role ? `/dashboard/${role}` : '/onboarding');
      } catch (err) {
          handleError(err);
          if (formElement) {
              formElement.classList.add('error-shake');
              setTimeout(() => formElement.classList.remove('error-shake'), 500);
          }
      } finally {
          isLoading = false;
      }
  }

  function validateForm(): boolean {
      if (!email) {
          error = 'Please enter your email address';
          return false;
      }
      if (!password) {
          error = 'Please enter your password';
          return false;
      }
      return true;
  }

  function handleError(err: any) {
      if (err instanceof Error) {
          if (err.message.includes('password')) {
              error = 'Incorrect password';
          } else if (err.message.includes('email')) {
              error = 'Email not found';
          } else if (err.message.includes('verification')) {
              error = 'Please verify your email first';
          } else {
              error = err.message;
          }
      } else {
          error = 'Login failed. Please try again.';
      }
  }

  function handleKeyPress(event: KeyboardEvent) {
      if (event.key === 'Enter' && !isLoading) {
          handleSubmit();
      }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div 
      class="sm:mx-auto sm:w-full sm:max-w-md"
      in:fly={{ y: 20, duration: 700, delay: 200 }}
  >
      <img 
          src={logo} 
          alt="Adapo Logo" 
          class="mx-auto h-12 w-auto transform hover:scale-105 transition-transform duration-300"
          in:scale={{ duration: 400 }}
      />
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

  <div 
      class="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      in:fly={{ y: 20, duration: 700, delay: 600 }}
  >
      <div class="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form 
              bind:this={formElement}
              class="space-y-6" 
              on:submit|preventDefault={handleSubmit}
          >
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
                              <p class="text-sm font-medium text-red-800">{error}</p>
                          </div>
                      </div>
                  </div>
              {/if}

              <div class="space-y-2">
                  <label 
                      for="email" 
                      class="block text-sm font-medium text-gray-700"
                  >
                      Email address
                  </label>
                  <div class="relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg 
                              class="h-5 w-5 text-gray-400" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              aria-hidden="true"
                          >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                      </div>
                      <input
                          bind:this={emailInput}
                          id="email"
                          type="email"
                          bind:value={email}
                          required
                          class="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow duration-200"
                          placeholder="you@example.com"
                          autocomplete="email"
                      />
                  </div>
              </div>

              <div class="space-y-2">
                  <label 
                      for="password" 
                      class="block text-sm font-medium text-gray-700"
                  >
                      Password
                  </label>
                  <div class="relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg 
                            class="h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path 
                                fill-rule="evenodd" 
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                                clip-rule="evenodd" 
                            />
                        </svg>
                    </div>
                    {#if showPassword}
                        <input
                            id="password"
                            type="text"
                            bind:value={password}
                            required
                            class="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow duration-200"
                            placeholder="••••••••"
                        />
                    {:else}
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                            class="pl-10 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow duration-200"
                            placeholder="••••••••"
                        />
                    {/if}
                    <button
                        type="button"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                        on:click={() => showPassword = !showPassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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

                  <div class="text-sm">
                      <a 
                          href="/forgot-password" 
                          class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                      >
                          Forgot your password?
                      </a>
                  </div>
              </div>

              <div>
                  <button
                      type="submit"
                      disabled={isLoading}
                      class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                      {#if isLoading}
                          <svg 
                              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                          >
                              <circle 
                                  class="opacity-25" 
                                  cx="12" 
                                  cy="12" 
                                  r="10" 
                                  stroke="currentColor" 
                                  stroke-width="4"
                              />
                              <path 
                                  class="opacity-75" 
                                  fill="currentColor" 
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                          </svg>
                          Signing in...
                      {:else}
                          Sign in
                      {/if}
                  </button>
              </div>
          </form>

         <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300" />
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                        <svg 
                            class="h-5 w-5" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            aria-hidden="true"
                        >
                            <path 
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                                fill="#4285F4"
                            />
                            <path 
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                                fill="#34A853"
                            />
                            <path 
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                                fill="#FBBC05"
                            />
                            <path 
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                                fill="#EA4335"
                            />
                        </svg>
                        <span class="ml-2">Google</span>
                    </button>

                    <button
                        type="button"
                        class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                        <svg 
                            class="h-5 w-5 text-[#24292F]" 
                            fill="currentColor" 
                            viewBox="0 0 24 24" 
                            aria-hidden="true"
                        >
                            <path 
                                fill-rule="evenodd" 
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" 
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span class="ml-2">GitHub</span>
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center text-sm">
                <p class="text-gray-600">
                    By signing in, you agree to our
                    <a 
                        href="/terms" 
                        class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                    >
                        Terms of Service
                    </a>
                    {" and "}
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
    /* Smooth animations */
    .error-shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform: translate3d(0, 0, 0);
    }

    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    /* Custom focus styles */
    input:focus, button:focus {
        @apply ring-2 ring-offset-2 ring-indigo-500 outline-none;
    }

    /* Smooth transitions */
    input, button {
        @apply transition-all duration-200;
    }

    /* Custom scrollbar for webkit browsers */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        @apply bg-gray-100 rounded-full;
    }

    ::-webkit-scrollbar-thumb {
        @apply bg-gray-300 rounded-full;
    }

    ::-webkit-scrollbar-thumb:hover {
        @apply bg-gray-400;
    }

    /* Remove autofill background */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-text-fill-color: theme('colors.gray.900');
        -webkit-box-shadow: 0 0 0px 1000px theme('colors.white') inset;
        transition: background-color 5000s ease-in-out 0s;
    }
</style>