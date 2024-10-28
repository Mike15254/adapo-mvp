<script lang="ts">
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { authStore } from '$lib/stores/authStore';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import { 
        LayoutDashboard, 
        PiggyBank, 
        Lightbulb, 
        UserCircle, 
        Home, 
        LogOut, 
        TrendingUp,
        Bell,
        Settings
    } from 'lucide-svelte';

    export let data: PageData;
    let isLoading = true;

    const investorNavItems = [
        { 
            href: '/dashboard/investor', 
            label: 'Overview', 
            icon: LayoutDashboard,
            description: 'Dashboard overview'
        },
        { 
            href: '/dashboard/investor/investments', 
            label: 'My Investments', 
            icon: PiggyBank,
            description: 'View your investments'
        },
        { 
            href: '/dashboard/investor/opportunities', 
            label: 'Opportunities', 
            icon: Lightbulb,
            description: 'Find new opportunities'
        },
        { 
            href: '/dashboard/investor/analytics', 
            label: 'Analytics', 
            icon: TrendingUp,
            description: 'Investment analytics'
        },
        { 
            href: '/dashboard/investor/profile', 
            label: 'Profile', 
            icon: UserCircle,
            description: 'Manage your profile'
        }
    ];

    const bottomNavItems = [
        { 
            href: '/', 
            label: 'Home', 
            icon: Home,
            description: 'Back to home'
        },
        { 
            href: '/dashboard/investor/settings', 
            label: 'Settings', 
            icon: Settings,
            description: 'Account settings'
        }
    ];

    let isMobileMenuOpen = false;
    
    // Get avatar URL using DiceBear
    $: avatarUrl = $authStore.user ? 
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent($authStore.user.email)}&backgroundColor=4F46E5&textColor=ffffff` : '';

    $: ({ investments, opportunities, totalInvested, activeInvestments, error } = data);

    function handleLogout() {
        authStore.logout();
        window.location.href = '/';
    }

    onMount(async () => {
        isLoading = false;
    });
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div class="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <!-- Logo Area -->
            <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200">
                <span class="text-2xl font-bold text-indigo-600">ADAPO</span>
                <p class="text-sm text-gray-500">Investor Dashboard</p>
            </div>

            <!-- Main Navigation -->
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav class="flex-1 px-4 space-y-1">
                    {#each investorNavItems as item}
                        <a
                            href={item.href}
                            class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150"
                            class:bg-indigo-50={$page.url.pathname === item.href}
                            class:text-indigo-600={$page.url.pathname === item.href}
                            class:text-gray-700={$page.url.pathname !== item.href}
                            class:hover:bg-gray-50={$page.url.pathname !== item.href}
                        >
                            <svelte:component 
                                this={item.icon} 
                                class="mr-3 h-5 w-5"
                               
                               
                            />
                            <span class="flex-1">{item.label}</span>
                            {#if item.label === 'Opportunities' && opportunities?.length > 0}
                                <span class="bg-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs">
                                    {opportunities.length}
                                </span>
                            {/if}
                        </a>
                    {/each}
                </nav>

                <!-- Bottom Navigation -->
                <div class="px-4 space-y-1">
                    <div class="pt-4 mt-4 border-t border-gray-200">
                        {#each bottomNavItems as item}
                            <a
                                href={item.href}
                                class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                            >
                                <svelte:component this={item.icon} class="mr-3 h-5 w-5 text-gray-400" />
                                {item.label}
                            </a>
                        {/each}

                        <!-- Logout Button -->
                        <button
                            on:click={handleLogout}
                            class="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                            <LogOut class="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <!-- User Profile -->
            <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div class="flex-shrink-0 w-full group block">
                    <div class="flex items-center">
                        <div class="h-9 w-9 rounded-full overflow-hidden">
                            <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-700">{$authStore.user?.name}</p>
                            <p class="text-xs font-medium text-gray-500">Investor Account</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-2">
        <div class="flex items-center justify-between">
            <button
                type="button"
                class="inline-flex items-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                on:click={() => isMobileMenuOpen = !isMobileMenuOpen}
            >
                <span class="sr-only">Open menu</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <span class="text-lg font-semibold text-indigo-600">ADAPO</span>
            <div class="flex items-center space-x-4">
                <button class="p-2 text-gray-400 hover:text-gray-500">
                    <Bell class="h-6 w-6" />
                </button>
                <div class="h-8 w-8 rounded-full overflow-hidden">
                    <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMobileMenuOpen}
        <div 
            class="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
            on:click={() => isMobileMenuOpen = false}
            transition:fade={{ duration: 200 }}
        />

        <div
            class="lg:hidden fixed inset-y-0 left-0 flex flex-col w-72 bg-white z-40"
            transition:fly={{ x: -300, duration: 300 }}
        >
            <!-- Mobile menu header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <span class="text-2xl font-bold text-indigo-600">ADAPO</span>
                <button
                    class="rounded-md text-gray-400 hover:text-gray-500"
                    on:click={() => isMobileMenuOpen = false}
                >
                    <span class="sr-only">Close menu</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Mobile menu content -->
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav class="flex-1 px-4 space-y-1">
                    {#each investorNavItems as item}
                        <a
                            href={item.href}
                            class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150"
                            class:bg-indigo-50={$page.url.pathname === item.href}
                            class:text-indigo-600={$page.url.pathname === item.href}
                            class:text-gray-700={$page.url.pathname !== item.href}
                            class:hover:bg-gray-50={$page.url.pathname !== item.href}
                            on:click={() => isMobileMenuOpen = false}
                        >
                            <svelte:component 
                                this={item.icon} 
                                class="mr-3 h-5 w-5"
                            />
                            <span class="flex-1">{item.label}</span>
                            {#if item.label === 'Opportunities' && opportunities?.length > 0}
                                <span class="bg-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs">
                                    {opportunities.length}
                                </span>
                            {/if}
                        </a>
                    {/each}

                    <!-- Mobile Bottom Navigation -->
                    <div class="pt-4 mt-4 border-t border-gray-200">
                        {#each bottomNavItems as item}
                            <a
                                href={item.href}
                                class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                on:click={() => isMobileMenuOpen = false}
                            >
                                <svelte:component this={item.icon} class="mr-3 h-5 w-5 text-gray-400" />
                                {item.label}
                            </a>
                        {/each}

                        <!-- Mobile Logout Button -->
                        <button
                            on:click={handleLogout}
                            class="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                            <LogOut class="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </nav>
            </div>

            <!-- Mobile User Profile -->
            <div class="border-t border-gray-200 p-4">
                <div class="flex items-center">
                    <div class="h-9 w-9 rounded-full overflow-hidden">
                        <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700">{$authStore.user?.name}</p>
                        <p class="text-xs font-medium text-gray-500">Investor Account</p>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Main Content -->
    <div class="lg:pl-72">
        <main class="flex-1">
            <div class="py-6">
                <!-- Mobile top spacing -->
                <div class="lg:hidden h-14"></div>
                
                <!-- Page content -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <slot></slot>
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    /* Ensure proper scrolling */
    :global(body) {
        @apply overflow-hidden;
    }

    main {
        min-height: 100vh;
        overflow-y: auto;
    }
</style>