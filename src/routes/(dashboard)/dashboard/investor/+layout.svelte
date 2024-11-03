<!-- src/routes/(dashboard)/investor/+layout.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import {
		LayoutDashboard,
		Wallet,
		LineChart,
		Briefcase,
		Settings,
		ShieldCheck,
		Building2,
		History,
		Home,
		LogOut
	} from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { authStore } from '$lib/stores/auth.store';
	import { goto } from '$app/navigation';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';

	export let data: LayoutData;
	let isSubmitting = false;

	const navigationItems = [
		{
			href: '/dashboard/investor',
			label: 'Overview',
			icon: LayoutDashboard,
			requiresVerification: false
		},
		{
			href: '/dashboard/investor/wallet',
			label: 'Wallet',
			icon: Wallet,
			requiresVerification: true
		},
		{
			href: '/dashboard/investor/campaigns',
			label: 'Opportunities',
			icon: Building2,
			requiresVerification: true
		}
	];

	const secondaryNavigation = [
		{
			href: '/dashboard/investor/verification',
			label: 'Verification',
			icon: ShieldCheck,
			requiresVerification: false
		},
		{
			href: '/',
			label: 'Home',
			icon: Home,
			requiresVerification: true
		}
	];

	$: verificationStatus = data.profile?.verificationStatus || 'unverified';
	$: isVerified = verificationStatus === 'verified';

	const handleLogout = async () => {
		try {
			isSubmitting = true;
			await authStore.logout();
			await goto('/');
		} catch (error) {
		} finally {
			isSubmitting = false;
		}
	};
</script>

{#if isSubmitting}
	<LoadingScreen />
{:else}
	<div class="h-screen flex overflow-hidden bg-gray-100">
		<!-- Sidebar -->
		<div class="hidden md:flex md:flex-shrink-0">
			<div class="flex flex-col w-64">
				<div class="flex flex-col h-0 flex-1 bg-white shadow">
					<!-- Logo -->
					<div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
						<div class="flex items-center flex-shrink-0 px-4">
							<img class="h-8 w-auto" src="/adapo.png" alt="Adapo" />
						</div>

						<!-- Main Navigation -->
						<nav class="mt-8 flex-1 px-2 space-y-1">
							{#each navigationItems as item}
								{@const isActive = $page.url.pathname === item.href}
								{@const isDisabled = item.requiresVerification && !isVerified}

								<a
									href={isDisabled ? '/dashboard/investor/verification' : item.href}
									class="group flex items-center px-2 py-2 text-sm font-medium rounded-md
                                    {isActive
										? 'bg-indigo-50 text-indigo-600'
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    {isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
									aria-current={isActive ? 'page' : undefined}
								>
									<svelte:component
										this={item.icon}
										class="mr-3 h-5 w-5 {isActive
											? 'text-indigo-500'
											: 'text-gray-400 group-hover:text-gray-500'}"
									/>
									{item.label}
									{#if isDisabled}
										<span class="ml-auto">
											<span
												class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
											>
												Verify First
											</span>
										</span>
									{/if}
								</a>
							{/each}
						</nav>

						<!-- Secondary Navigation -->
						<div class="mt-auto pb-4">
							<div class="border-t border-gray-200 pt-4">
								<nav class="px-2 space-y-1">
									{#each secondaryNavigation as item}
										{@const isActive = $page.url.pathname === item.href}

										<a
											href={item.href}
											class="group flex items-center px-2 py-2 text-sm font-medium rounded-md
                                            {isActive
												? 'bg-indigo-50 text-indigo-600'
												: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
										>
											<svelte:component
												this={item.icon}
												class="mr-3 h-5 w-5 {isActive
													? 'text-indigo-500'
													: 'text-gray-400 group-hover:text-gray-500'}"
											/>
											{item.label}
											{#if item.href === '/dashboard/investor/verification' && !isVerified}
												<span class="ml-auto">
													<span
														class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
													>
														Required
													</span>
												</span>
											{/if}
										</a>
									{/each}
									<button
										on:click={handleLogout}
										class="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
									>
										<LogOut class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
										Sign out
									</button>
								</nav>
							</div>

							<!-- User Profile -->
							<div class="mt-6 px-4">
								<div class="flex items-center">
									<div>
										<img
											class="h-8 w-8 rounded-full"
											src={$authStore.user?.profile_picture || '/default-avatar.svg'}
											alt=""
										/>
									</div>
									<div class="ml-3">
										<p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
											{$authStore.user?.name}
										</p>
										<p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
											{$authStore.user?.email}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile header -->
		<div class="flex md:hidden">
			<div class="fixed inset-0 flex z-40">
				<!-- Mobile menu button -->
				<button
					type="button"
					class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
				>
					<span class="sr-only">Open sidebar</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Main content -->
		<div class="flex flex-col w-0 flex-1 overflow-hidden">
			<main class="flex-1 relative overflow-y-auto focus:outline-none">
				<div class="py-6">
					<div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<slot />
					</div>
				</div>
			</main>
		</div>
	</div>
{/if}
