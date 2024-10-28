<script lang="ts">
    import { page } from '$app/stores';
    import {
        LayoutDashboard,
        TrendingUp,
        Settings,
        LogOut,
        Home,
        User,
        AlertTriangle
    } from 'lucide-svelte';
    import type { LayoutData } from './$types';
	import { AuthService } from '$lib/services/auth.service';

    export let data: LayoutData;

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

    let mobileMenuOpen = false;
    async function handleLogout() {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
</script>

<div class="min-h-screen bg-gray-50">
    

    <!-- Sidebar -->
    <nav class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div class="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
            <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div class="flex flex-shrink-0 items-center px-4">
                    <img class="h-8 w-auto" src="/adapo.png" alt="Your Company" />
                </div>
                <nav class="mt-5 flex-1 space-y-1 px-2">
                    {#each navigation as item}
                        <a
                            href={item.href}
                            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md
                            {$page.url.pathname === item.href ? 
                                'bg-gray-100 text-gray-900' : 
                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
                        >
                            <svelte:component
                                this={item.icon}
                                class="mr-3 h-5 w-5 flex-shrink-0 {
                                    $page.url.pathname === item.href ?
                                        'text-gray-500' :
                                        'text-gray-400 group-hover:text-gray-500'
                                }"
                            />
                            {item.name}
                        </a>
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
                                            <div class="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span class="text-indigo-600 font-medium text-lg">
                                                    {data.user?.name?.[0]?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        {/if}
                                        <span class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring-1 ring-white" />
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

    <!-- Mobile menu -->
    <!-- Add mobile menu here -->

    <!-- Main content -->
    <div class="md:pl-64">
        <main class="py-6">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <slot />
            </div>
        </main>
    </div>
</div>