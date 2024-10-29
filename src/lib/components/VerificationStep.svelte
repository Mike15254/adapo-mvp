<!-- src/lib/components/onboarding/VerificationStep.svelte -->
<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onboardingStore } from '$lib/stores/onboardingStore';
    import { AuthService } from '$lib/services/auth.service';
    
    let countdown = 60;
    let canResend = true;
    let error: string | null = null;
  
    async function handleResendVerification() {
      if (!canResend) return;
      
      try {
        await AuthService.resendVerification($onboardingStore.userData.email);
        canResend = false;
        
        const timer = setInterval(() => {
          countdown--;
          if (countdown <= 0) {
            clearInterval(timer);
            canResend = true;
            countdown = 60;
          }
        }, 1000);
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to resend verification email';
      }
    }
  </script>
  
  <div class="max-w-xl mx-auto pt-6" in:fade={{ duration: 300 }}>
    <h2 class="text-2xl lg:text-4xl font-semibold text-center text-gray-800 mb-8">
      Verify Your Email
    </h2>
  
    <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
      <div class="mb-8">
        <div class="bg-blue-50 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Check Your Email</h3>
        <p class="text-gray-600 mb-4">
          We've sent a verification link to:
          <span class="font-medium text-gray-900 block mt-1">
            {$onboardingStore.userData.email}
          </span>
        </p>
      </div>
  
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">
            Click the verification link in the email to continue with your registration.
          </p>
        </div>
  
        {#if error}
          <div class="p-4 bg-red-50 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        {/if}
  
        <div class="border-t pt-4">
          <p class="text-sm text-gray-600 mb-2">Didn't receive the email?</p>
          <button
            class="text-indigo-600 hover:text-indigo-500 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={handleResendVerification}
            disabled={!canResend}
          >
            {#if canResend}
              Resend verification email
            {:else}
              Resend available in {countdown}s
            {/if}
          </button>
        </div>
      </div>
    </div>
  
    <div class="mt-6 text-center text-sm text-gray-500">
      <p>
        Make sure to check your spam folder if you don't see the email in your inbox.
      </p>
    </div>
  </div>