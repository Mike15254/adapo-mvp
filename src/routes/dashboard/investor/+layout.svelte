<script lang="ts">
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import {
        LayoutDashboard,
        TrendingUp,
        Settings,
        LogOut,
        Home,
        Menu,
        X,
    } from 'lucide-svelte';
    import type { LayoutData } from './$types';
    import { fade, fly } from 'svelte/transition';
    import { AuthService } from '$lib/services/auth.service';
    import { goto } from '$app/navigation';
    import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import { tick } from 'svelte';
    
    export let data: LayoutData;
    
    let isLoading = false;
    let isMobileMenuOpen = false;
    let isPageTransitioning = false;
    
    // Enhanced navigation tracking
    const navigation = [
        {
            name: 'Overview',
            href: '/dashboard/investor',
            icon: LayoutDashboard
        },
        {
            name: 'Investment Opportunities',
            href: '/dashboard/investor/opportunities',
            icon: TrendingUp
        },
        {
            name: 'Account',
            href: '/dashboard/investor/account',
            icon: Settings
        }
    ];
    
    // Safe navigation function
    async function navigationTo(href: string) {
        try {
            if (!browser || !href) return;
            
            // Check if we're already on the target page
            if ($page?.url?.pathname === href) {
                isMobileMenuOpen = false;
                return;
            }
    
            isPageTransitioning = true;
            isMobileMenuOpen = false;
    
            await goto(href, {
    invalidateAll: true
});
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            // Short delay to ensure smooth transition
            isPageTransitioning = false;

            // Wait for page transition to complete
            await tick();
            
            
        }
    }
    
    
    // Safe logout function
    async function handleLogout() {
        if (!browser) return;
        
        isLoading = true;
        try {
            await AuthService.logout();
            // Optionally redirect to login page after logout
            await goto('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            isLoading = false;
        }
    }
    
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
    
    // Safe way to check active route
    function isActiveRoute(href: string): boolean {
        if (!browser || !$page?.url?.pathname) return false;
        return $page.url.pathname === href;
    }
    
    function getNavItemClasses(isActive: boolean): string {
        return `group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold transition-all duration-200 
            ${isActive 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`;
    }
    
    function getIconClasses(isActive: boolean): string {
        return `h-5 w-5 shrink-0 transition-colors duration-200 
            ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`;
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && isMobileMenuOpen) {
            isMobileMenuOpen = false;
        }
    }
    </script>
    <svelte:window on:keydown={handleKeydown}/>
    
    <div class="min-h-screen bg-gray-50">
        <!-- Mobile header -->
        <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 md:hidden"
             in:fly={{ y: -20, duration: 300 }}>
            <button 
                type="button" 
                class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                on:click={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
            >
                <span class="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                <Menu class={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} />
                <X class={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} />
            </button>
            
            <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">
                Investor Dashboard
            </div>
        </div>
    
        <!-- Mobile menu overlay -->
        {#if isMobileMenuOpen}
        <button 
            class="fixed inset-0 z-40 md:hidden"
            transition:fade={{ duration: 200 }}
            on:click={toggleMobileMenu}
        >
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />

        </button>
        {/if}
    
        <!-- Mobile menu panel -->
        {#if isMobileMenuOpen}
        <div 
            class="fixed inset-y-0 left-0 z-40 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 md:hidden"
            transition:fly={{ x: -300, duration: 300, opacity: 1 }}
        >
            <div class="flex items-center justify-between">
                <img class="h-8 w-auto" src="/adapo.png" alt="Adapo" />
                <button
                    type="button"
                    class="-m-2.5 rounded-md p-2.5 text-gray-700"
                    on:click={toggleMobileMenu}
                >
                    <span class="sr-only">Close menu</span>
                    <X class="h-6 w-6" />
                </button>
            </div>
            
            <div class="mt-6 flow-root">
                <div class="-my-6 divide-y divide-gray-500/10">
                    <div class="space-y-2 py-6">
                        {#each navigation as item}
                        <button
                            class={getNavItemClasses(isActiveRoute(item.href))}
                            on:click={() => navigationTo(item.href)}
                        >
                            <svelte:component
                                this={item.icon}
                                class={getIconClasses(isActiveRoute(item.href))}
                            />
                            {item.name}
                        </button>
                    {/each}
                    </div>
                    
                    <!-- Profile section -->
                    <div class="py-6">
                        <div class="flex items-center gap-x-4">
                            <div class="relative h-10 w-10 flex-none rounded-full bg-gray-50">
                                {#if data.user?.profile_picture}
                                    <img
                                        src={data.user.profile_picture}
                                        alt=""
                                        class="h-full w-full rounded-full object-cover"
                                    />
                                {:else}
                                    <div class="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span class="text-indigo-600 font-medium text-lg">
                                            {data.user?.name?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                {/if}
                                <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white"/>
                            </div>
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm font-semibold text-gray-900">{data.user?.name || 'User'}</p>
                                <p class="truncate text-xs text-gray-500">{data.user?.email}</p>
                            </div>
                        </div>
                        
                        <div class="mt-6 space-y-2">
                            <a
                                href="/"
                                class="group -mx-3 flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <Home class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
                                Home
                            </a>
                            <button
                                on:click={handleLogout}
                                class="group -mx-3 flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <LogOut class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    
        <!-- Desktop sidebar -->
        <nav class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            <!-- Sidebar content -->
            <div class="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
				<div class="flex flex-shrink-0 items-center px-4">
					<img class="h-8 w-auto" src="/adapo.png" alt="Your Company" />
				</div>
				<nav class="mt-5 flex-1 space-y-1 px-2">
					{#each navigation as item}
    <button
        class={getNavItemClasses(isActiveRoute(item.href))}
        on:click={() => navigationTo(item.href)}
    >
        <svelte:component
            this={item.icon}
            class={getIconClasses(isActiveRoute(item.href))}
        />
        {item.name}
    </button>
{/each}
				</nav>
			</div>
			<div class="flex flex-shrink-0 border-t border-gray-200 p-4">
				<div class="group block w-full flex-shrink-0">
					<div class="flex items-center">
						<li class="mt-auto">
							<div class="flex flex-col gap-y-4">
								<!-- Profile Section -->
								<div class="flex items-center gap-x-4 py-3 text-sm">
									<div class="relative h-10 w-10 flex-none rounded-full bg-gray-50">
										{#if data.user?.profile_picture}
											<img
												src={data.user.profile_picture}
												alt=""
												class="h-full w-full rounded-full object-cover"
											/>
										{:else}
											<div
												class="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center"
											>
												<span class="text-indigo-600 font-medium text-lg">
													{data.user?.name?.[0]?.toUpperCase() || 'U'}
												</span>
											</div>
										{/if}
										<span
											class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white"
										/>
									</div>
									<div class="min-w-0 flex-auto">
										<p class="truncate text-xs text-gray-500">
											{data.user?.name || 'User'}
										</p>
										<p class="truncate text-xs text-gray-500">
											{data.user?.email}
										</p>
									</div>
								</div>

								<!-- Action Buttons -->
								<div class="flex flex-col gap-2">
									<a
										href="/"
										class="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
									>
										<Home class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
										Home
									</a>
									<button
										on:click={handleLogout}
										class="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
									>
										<LogOut class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" />
										Sign out
									</button>
								</div>
							</div>
						</li>
					</div>
				</div>
			</div>
            </div>
        </nav>
    
        <!-- Main content -->
        <div class="md:pl-64 flex-1">
            {#if isPageTransitioning}
                <LoadingScreen message="" />
            {:else}
                <main class="py-6">
                    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8"
                         in:fade={{ duration: 200, delay: 100 }}>
                        <slot />
                    </div>
                </main>
            {/if}
        </div>
    </div>
    
    <style lang="postcss">
        /* Smooth transitions */
        :global(.page-transition-enter) {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
        }
    
        :global(.page-transition-enter-active) {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 300ms, transform 300ms;
        }
    
        /* Mobile menu animations */
        @keyframes slideIn {
            from {
                transform: translateX(-100%);
            }
            to {
                transform: translateX(0);
            }
        }
    
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    
        /* Improved focus styles */
        button:focus {
            @apply outline-none ring-2 ring-offset-2 ring-indigo-500;
        }
    
        /* Better touch targets for mobile */
        @media (max-width: 768px) {
            button, a {
                @apply min-h-[44px];
            }
        }
    </style>