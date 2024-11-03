<!-- src/routes/(dashboard)/startup/+layout.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { authStore } from '$lib/stores/auth.store';
    import { 
        Rocket, Users, Settings, BarChart, 
        Bell, PlusCircle, Menu, X, LogOut,
        ChevronDown, CreditCard
    } from 'lucide-svelte';
    import type { LayoutData } from './$types';
    import { goto } from '$app/navigation';

    export let data: LayoutData;

    const navigationItems = [
        { href: '/dashboard/startup', label: 'Overview', icon: BarChart },
        { href: '/dashboard/startup/campaign', label: 'Campaign', icon: Rocket },
        { href: '/dashboard/startup/investors', label: 'Investors', icon: Users }
    ];

    let isMobileMenuOpen = false;
    let isProfileMenuOpen = false;

    async function handleLogout() {
        await authStore.logout();
        goto('/login');
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    function toggleProfileMenu() {
        isProfileMenuOpen = !isProfileMenuOpen;
    }

    let profileMenuRef: HTMLDivElement;

    function handleClickOutside(event: MouseEvent) {
        if (profileMenuRef && !profileMenuRef.contains(event.target as Node)) {
            isProfileMenuOpen = false;
        }
    }

    $: pathName = $page.url.pathname;
</script>

<svelte:window on:click={handleClickOutside} />

<div class="min-h-screen bg-gray-100">
    <!-- Sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div class="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div class="flex items-center flex-shrink-0 px-4">
                    <!-- <img class="h-8 w-auto" src="/adapo.png" alt="Adapo" /> -->
                    <a href="/"> 
                    <img class="h-8 w-auto" src="/adapo.png" alt="Adapo" />

                    </a>
                </div>
                <nav class="mt-8 flex-1 px-2 space-y-2">
                    {#each navigationItems as item}
                        {@const isActive = pathName === item.href}
                        <a
                            href={item.href}
                            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                   {isActive ? 
                                     'bg-indigo-50 text-indigo-600' : 
                                     'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <svelte:component
                                this={item.icon}
                                class="flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors
                                    {isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}"
                            />
                            {item.label}
                        </a>
                    {/each}
                </nav>
            </div>

            <!-- Profile section -->
            <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div class="flex-shrink-0 w-full group block">
                    <div class="flex items-center">
                        <!-- <div>
                            <img
                                class="inline-block h-9 w-9 rounded-full"
                                src={data.user?.profile_picture || '/default-avatar.svg'}
                                alt="Profile"
                            />
                        </div> -->
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {data.user?.name}
                            </p>
                            <p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                                View settings
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMobileMenuOpen}
        <div class="fixed inset-0 z-40 lg:hidden" transition:fade={{ duration: 200 }}>
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75" on:click={toggleMobileMenu} />
            
            <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
                 transition:fly={{ x: -300, duration: 200 }}>
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                        type="button"
                        class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        on:click={toggleMobileMenu}
                    >
                        <X class="h-6 w-6 text-white" />
                    </button>
                </div>
                
                <div class="flex-shrink-0 flex items-center px-4">
                    <img class="h-8 w-auto" src="/adapo.png" alt="Adapo" />
                </div>
                
                <div class="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav class="px-2 space-y-1">
                        {#each navigationItems as item}
                            {@const isActive = pathName === item.href}
                            <a
                                href={item.href}
                                class="group flex items-center px-3 py-2 text-base font-medium rounded-md
                                       {isActive ?
                                         'bg-indigo-50 text-indigo-600' : 
                                         'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                            >
                                <svelte:component
                                    this={item.icon}
                                    class="mr-4 h-6 w-6 {isActive ? 
                                        'text-indigo-600' : 
                                        'text-gray-400 group-hover:text-gray-500'}"
                                />
                                {item.label}
                            </a>
                        {/each}
                    </nav>
                </div>
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <div class="md:pl-64 flex flex-col flex-1">
        <!-- Top header -->
        <header class="w-full">
            <div class="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
                <button
                    type="button"
                    class="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    on:click={toggleMobileMenu}
                >
                    <Menu class="h-6 w-6" />
                </button>

                <div class="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center">
                        {#if !data.campaign}
                            <a
                                href="/dashboard/startup/campaign/new"
                                class="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                                       rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <PlusCircle class="h-4 w-4 mr-2" />
                                Create Campaign
                            </a>
                        {/if}
                    </div>

                    <div class="ml-4 flex items-center md:ml-6">
                        <!-- Notification dropdown -->
                        <div class="relative">
                            <button
                                class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none 
                                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Bell class="h-6 w-6" />
                            </button>
                        </div>

                        <!-- Profile dropdown -->
                        <div class="ml-3 relative" bind:this={profileMenuRef}>
                            <div>
                                <button
                                    class="flex items-center max-w-xs text-sm rounded-full focus:outline-none 
                                           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    on:click={toggleProfileMenu}
                                >
                                    <img
                                        class="h-8 w-8 rounded-full"
                                        src={data.user?.profile_picture || '/default-avatar.svg'}
                                        alt=""
                                    />
                                    <ChevronDown class="ml-2 h-4 w-4 text-gray-400" />
                                </button>
                            </div>

                            {#if isProfileMenuOpen}
                                <div
                                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white 
                                           ring-1 ring-black ring-opacity-5 py-1"
                                    transition:fly={{ y: -10, duration: 200 }}
                                >
                                    {#each navigationItems.filter(item => item.label === 'Settings') as item}
                                        <a
                                            href={item.href}
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {item.label}
                                        </a>
                                    {/each}
                                    <button
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        on:click={handleLogout}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main content -->
        <main class="flex-1">
            <div class="py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</div>

<style>
    /* Add any custom styles here */
</style>