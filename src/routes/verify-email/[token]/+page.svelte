<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { AuthService } from '$lib/services/auth.service';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let isVerifying = true;
  let error: string | null = null;
  let success = false;

  onMount(async () => {
    const token = $page.params.token;
    try {
      await AuthService.verifyEmail(token);
      success = true;
      setTimeout(() => {
        goto('/login');
      }, 3000);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Verification failed';
    } finally {
      isVerifying = false;
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8" in:fade={{ duration: 300 }}>
    {#if isVerifying}
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Verifying your email...
        </h2>
      </div>
    {:else if success}
      <div class="bg-white p-8 rounded-lg shadow-sm text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="mt-4 text-2xl font-semibold text-gray-900">Email Verified Successfully!</h2>
        <p class="mt-2 text-sm text-gray-600">
          Your email has been verified. You will be redirected to login shortly...
        </p>
        <div class="mt-4">
          
          <a  href="/login"
            class="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Click here if you're not redirected
          </a>
        </div>
      </div>
    {:else}
      <div class="bg-white p-8 rounded-lg shadow-sm text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="mt-4 text-2xl font-semibold text-gray-900">Verification Failed</h2>
        <p class="mt-2 text-sm text-red-600">{error}</p>
        <div class="mt-4">
          <button
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            on:click={() => goto('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>