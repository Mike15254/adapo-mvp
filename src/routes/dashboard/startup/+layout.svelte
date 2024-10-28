<script lang="ts">
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import type { LayoutData } from './$types';
    import {
        LayoutDashboard,
        FileEdit,
        BadgeCheck,
        LogOut,
        Home
    } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { AuthService } from '$lib/services/auth.service';

    export let data: LayoutData;
    
    $: ({ user, startup, stats } = data);
    $: isVerified = startup?.verification_status === 'verified';

    const navigationItems = [
        {
            href: '/dashboard/startup',
            label: 'Overview',
            icon: LayoutDashboard,
            description: 'Dashboard overview and metrics'
        },
        {
            href: '/dashboard/startup/updates',
            label: 'Updates',
            icon: FileEdit,
            description: 'Manage project updates'
        },
        {
            href: '/dashboard/startup/verification',
            label: 'Verification',
            icon: BadgeCheck,
            description: 'Complete startup verification',
            hidden: isVerified
        }
    ].filter(item => !item.hidden);

    let isMobileMenuOpen = false;

    async function handleLogout() {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    function getIconClasses(isActive: boolean): string {
        return `h-6 w-6 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`;
    }
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
            <div class="flex h-16 shrink-0 items-center">
                <!-- Your logo or brand -->
                <span class="text-xl font-semibold text-gray-900">Adapo</span>
            </div>
            
            <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <!-- Main Navigation -->
                    <li>
                        <ul role="list" class="-mx-2 space-y-1">
                            {#each navigationItems as item}
                                <li>
                                    <a
                                        href={item.href}
                                        class="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                        class:text-indigo-600={$page.url.pathname === item.href}
                                        class:bg-indigo-50={$page.url.pathname === item.href}
                                        class:text-gray-700={$page.url.pathname !== item.href}
                                        class:hover:text-indigo-600={$page.url.pathname !== item.href}
                                        class:hover:bg-gray-50={$page.url.pathname !== item.href}
                                    >
                                    <svelte:component
                                    this={item.icon}
                                    strokeWidth={1.5}
                                    class={getIconClasses($page.url.pathname === item.href)}
                                />
                                        {item.label}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </li>

                    <!-- User Section -->
                    <li class="mt-auto">
                        <div class="flex flex-col gap-y-4">
                            <!-- Profile Section -->
                            <div class="flex items-center gap-x-4 py-3 text-sm">
                                <div class="relative h-10 w-10 flex-none rounded-full bg-gray-50">
                                    {#if user?.profile_picture}
                                        <img 
                                            src={user.profile_picture} 
                                            alt="" 
                                            class="h-full w-full rounded-full object-cover"
                                        />
                                    {:else}
                                        <div class="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span class="text-indigo-600 font-medium text-lg">
                                                {user?.name?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    {/if}
                                    <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white" />
                                </div>
                                <div class="min-w-0 flex-auto">
                                    <p class="text-sm font-semibold text-gray-900">
                                        {startup?.company_name || user?.name || 'User'}
                                    </p>
                                    <p class="truncate text-xs text-gray-500">
                                        {user?.email}
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
                </ul>
            </nav>
        </div>
    </div>

    <!-- Mobile header -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button 
            type="button" 
            class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            on:click={() => isMobileMenuOpen = true}
        >
            <span class="sr-only">Open sidebar</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
        <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">
            {startup?.company_name || 'Dashboard'}
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMobileMenuOpen}
        <div 
            class="relative z-50 lg:hidden" 
            role="dialog" 
            aria-modal="true"
            transition:fade={{ duration: 200 }}
        >
            <div class="fixed inset-0 bg-gray-900/80" />

            <div class="fixed inset-0 flex">
                <div 
                    class="relative mr-16 flex w-full max-w-xs flex-1"
                    transition:fly={{ x: -320, duration: 200 }}
                >
                    <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button 
                            type="button" 
                            class="-m-2.5 p-2.5"
                            on:click={() => isMobileMenuOpen = false}
                        >
                            <span class="sr-only">Close sidebar</span>
                            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Mobile menu content -->
                    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                        <div class="flex h-16 shrink-0 items-center">
                            <span class="text-xl font-semibold text-gray-900">Adapo</span>
                        </div>
                        <nav class="flex flex-1 flex-col">
                            <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                <!-- Navigation items -->
                                <li>
                                    <ul role="list" class="-mx-2 space-y-1">
                                        {#each navigationItems as item}
                                            <li>
                                                <a
                                                    href={item.href}
                                                    class="group flex gap-x-3 round ed-md p-2 text-sm font-semibold leading-6"
                                                    class:text-indigo-600={$page.url.pathname === item.href}
                                                    class:bg-indigo-50={$page.url.pathname === item.href}
                                                    class:text-gray-700={$page.url.pathname !== item.href}
                                                    on:click={() => isMobileMenuOpen = false}
                                                >
                                                <svelte:component
                                                this={item.icon}
                                                strokeWidth={1.5}
                                                class={getIconClasses($page.url.pathname === item.href)}
                                            />
                                                    {item.label}
                                                </a>
                                            </li>
                                        {/each}
                                    </ul>
                                </li>

                                <!-- Mobile user section -->
                                <li class="mt-auto">
                                    <div class="flex flex-col gap-y-4">
                                        <div class="flex items-center gap-x-4 py-3 text-sm">
                                            <div class="relative h-10 w-10 flex-none rounded-full bg-gray-50">
                                                {#if user?.profile_picture}
                                                    <img 
                                                        src={user.profile_picture} 
                                                        alt="" 
                                                        class="h-full w-full rounded-full object-cover"
                                                    />
                                                {:else}
                                                    <div class="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <span class="text-indigo-600 font-medium text-lg">
                                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                {/if}
                                            </div>
                                            <div class="min-w-0 flex-auto">
                                                <p class="text-sm font-semibold text-gray-900">
                                                    {startup?.company_name || user?.name || 'User'}
                                                </p>
                                                <p class="truncate text-xs text-gray-500">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="flex flex-col gap-2">
                                            <a
                                                href="/"
                                                class="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                on:click={() => isMobileMenuOpen = false}
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
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <main class="py-10 lg:pl-72">
        <div class="px-4 sm:px-6 lg:px-8">
            <slot />
        </div>
    </main>
</div>

<style>
    /* Add any custom styles here */
</style>