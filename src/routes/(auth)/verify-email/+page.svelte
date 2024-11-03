<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { authStore } from '$lib/stores/auth.store';
	import { Loader, Mail, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-svelte';

	export let data;

	let isLoading = false;
	let error: string | null = null;
	let success: string | null = null;
	let resendDisabled = false;
	let resendCountdown = 60;

	$: token = $page.url.searchParams.get('token');
	$: email = data.user?.email || '';

	onMount(async () => {
		if (token) {
			await verifyEmail(token);
		}
	});

	async function verifyEmail(verificationToken: string) {
		isLoading = true;
		error = null;
		success = null;

		try {
			const response = await fetch('/api/auth/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token: verificationToken })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message);
			}

			success = 'Email verified successfully!';

			// Initialize auth store
			await authStore.initialize();

			// Redirect after delay
			setTimeout(async () => {
				const user = await authStore.getCurrentUser();
				if (user?.role) {
					await goto(`/dashboard/${user.role}`);
				}
			}, 2000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Verification failed';
		} finally {
			isLoading = false;
		}
	}

	async function handleResendVerification() {
		if (resendDisabled || !email) return;

		isLoading = true;
		error = null;
		success = null;

		try {
			const response = await fetch('/api/auth/verify', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message);
			}

			success = 'Verification email sent successfully!';

			// Start countdown
			resendDisabled = true;
			const countdownInterval = setInterval(() => {
				resendCountdown--;
				if (resendCountdown <= 0) {
					resendDisabled = false;
					resendCountdown = 60;
					clearInterval(countdownInterval);
				}
			}, 1000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to resend verification email';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<div class="text-center">
			{#if isLoading}
				<Loader class="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
			{:else if success}
				<CheckCircle class="mx-auto h-12 w-12 text-green-600" />
			{:else if error}
				<AlertTriangle class="mx-auto h-12 w-12 text-red-600" />
			{:else}
				<Mail class="mx-auto h-12 w-12 text-indigo-600" />
			{/if}
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Verify Your Email
			</h2>
		</div>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-4" transition:fade>
					<div class="flex">
						<div class="flex-shrink-0">
							<AlertTriangle class="h-5 w-5 text-red-400" />
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Verification Failed</h3>
							<div class="mt-2 text-sm text-red-700">
								<p>{error}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if success}
				<div class="rounded-md bg-green-50 p-4 mb-4" transition:fade>
					<div class="flex">
						<div class="flex-shrink-0">
							<CheckCircle class="h-5 w-5 text-green-400" />
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-green-800">Success</h3>
							<div class="mt-2 text-sm text-green-700">
								<p>{success}</p>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div class="text-center">
				{#if !token}
					<p class="text-sm text-gray-600 mb-6">
						We've sent a verification link to your email address. Please check your inbox and click
						the link to verify your account.
					</p>

					<div class="flex flex-col items-center gap-4">
						<button
							type="button"
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
							on:click={handleResendVerification}
							disabled={isLoading || resendDisabled}
						>
							{#if isLoading}
								<Loader class="animate-spin -ml-1 mr-2 h-4 w-4" />
							{:else}
								<RefreshCw class="-ml-1 mr-2 h-4 w-4" />
							{/if}
							{resendDisabled ? `Resend in ${resendCountdown}s` : 'Resend Verification Email'}
						</button>

						<a href="/login" class="text-sm text-indigo-600 hover:text-indigo-500">
							Return to login
						</a>
					</div>
				{:else if !success}
					<p class="text-sm text-gray-600">Verifying your email...</p>
				{/if}
			</div>
		</div>
	</div>
</div>
