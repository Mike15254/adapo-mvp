<script lang="ts">
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { authStore } from '$lib/stores/authStore';
    import type { LayoutData } from './$types';
    import {
        LayoutDashboard, Rocket, BadgeDollarSign, LineChart,
        Users, User, Settings, LogOut, Bell, Plus,
        FileText, ClipboardCheck, Home, ChevronDown,
        Briefcase, AlertTriangle, ChevronRight
    } from 'lucide-svelte';
    import logo from '$lib/assets/adapo-logo.png';
    
    export let data: LayoutData;
    
    $: ({ stats, startup } = data);
    $: userName = $authStore.user?.name || 'User';
    $: userEmail = $authStore.user?.email || '';
    $: isVerified = startup?.verification_status === 'verified';
    
    let isMobileMenuOpen = false;
    let isNotificationsOpen = false;

    const navigationItems = [
        {
            href: '/dashboard/startup',
            label: 'Overview',
            icon: LayoutDashboard,
            badge: null,
            description: 'Dashboard overview and key metrics'
        },
        {
            href: '/dashboard/startup/projects',
            label: 'Projects',
            icon: Rocket,
            badge: stats?.activeProjects,
            description: 'Manage your fundraising projects'
        },
        {
            href: '/dashboard/startup/funding',
            label: 'Funding',
            icon: BadgeDollarSign,
            badge: null,
            description: 'Track and manage investments'
        },
        {
            href: '/dashboard/startup/investors',
            label: 'Investors',
            icon: Users,
            badge: stats?.totalInvestors,
            description: 'View and interact with investors'
        },
        {
            href: '/dashboard/startup/updates',
            label: 'Updates',
            icon: FileText,
            badge: null,
            description: 'Share progress with stakeholders'
        }
    ];

    const quickActions = [
        {
            href: '/dashboard/startup/projects/new',
            label: 'New Project',
            icon: Plus,
            requiresVerification: true,
            description: 'Start a new fundraising project'
        },
        {
            href: '/dashboard/startup/updates/new',
            label: 'Post Update',
            icon: FileText,
            requiresVerification: true,
            description: 'Share progress with investors'
        },
        {
            href: '/dashboard/startup/verification',
            label: 'Complete Verification',
            icon: ClipboardCheck,
            requiresVerification: false,
            showIfVerified: false,
            description: 'Verify your startup profile'
        }
    ].filter(action => isVerified ? action.showIfVerified !== false : !action.requiresVerification);

    async function handleLogout() {
        await authStore.logout();
        window.location.href = '/';
    }
</script>

<!-- Verification Banner -->
{#if !isVerified}
    <!-- <div class="fixed top-0 left-0 right-0 z-50 border-b border-yellow-200" in:fade={{duration: 300}}>
        <div class="bg-yellow-50 px-4 py-3">
            <div class="flex items-center justify-between max-w-7xl mx-auto">
                <div class="flex items-center">
                    <AlertTriangle class="h-5 w-5 text-yellow-400" />
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                            Verification Required
                        </h3>
                        <p class="text-sm text-yellow-700 mt-0.5">
                            Complete verification to unlock all features
                        </p>
                    </div>
                </div>
                <a
                    href="/dashboard/startup/verification"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    Verify Now
                    <ChevronRight class="ml-1.5 h-4 w-4" />
                </a>
            </div>
        </div>
    </div> -->
{/if}

<div class="min-h-screen bg-gray-50 flex">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-5 lg:pb-4">
        <div class="flex items-center flex-shrink-0 px-6">
            <img class="h-8 w-auto" src={logo} alt="Company Logo" />
        </div>
        
        <!-- Navigation -->
        <div class="mt-6 flex flex-1 flex-col px-4 space-y-4">
            <nav class="flex-1 space-y-2">
                {#each navigationItems as item}
                    <a
                        href={item.href}
                        class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg"
                        class:bg-indigo-50={$page.url.pathname === item.href}
                        class:text-indigo-600={$page.url.pathname === item.href}
                        class:text-gray-700={$page.url.pathname !== item.href}
                    >
                    <svelte:component
                    this={item.icon}
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        $page.url.pathname === item.href ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                />
                        <span class="flex-1">{item.label}</span>
                        {#if item.badge}
                            <span class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {item.badge}
                            </span>
                        {/if}
                    </a>
                {/each}
            </nav>

            <!-- Quick Actions -->
            {#if quickActions.length}
                <div class="space-y-2">
                    <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Actions
                    </h3>
                    {#each quickActions as action}
                        <a
                            href={action.href}
                            class="group flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600"
                        >
                            <svelte:component
                                this={action.icon}
                                class="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-indigo-600"
                            />
                            {action.label}
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- User Menu -->
        <div class="border-t border-gray-200 p-4">
            <div class="flex items-center gap-3">
                <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`}
                    alt=""
                    class="h-9 w-9 rounded-full bg-gray-50"
                />
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                        {userName}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                        {userEmail}
                    </p>
                </div>
                <button
                    on:click={handleLogout}
                    class="p-1.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                    <LogOut class="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile header -->
    <div class="lg:hidden">
        <div class="fixed inset-0 flex z-40" class:hidden={!isMobileMenuOpen}>
            <!-- Overlay -->
            <div
                class="fixed inset-0 bg-gray-600 bg-opacity-75"
                on:click={() => (isMobileMenuOpen = false)}
                transition:fade={{duration: 200}}
            ></div>

            <!-- Mobile menu -->
            <div
                class="relative flex-1 flex flex-col max-w-xs w-full bg-white"
                transition:fly={{x: -300, duration: 300}}
            >
                <!-- Mobile menu content (same as desktop but adapted for mobile) -->
                <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <!-- Mobile nav content here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-72 flex flex-col flex-1">
        <!-- Mobile header -->
        <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
                type="button"
                class="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                on:click={() => (isMobileMenuOpen = true)}
            >
                <span class="sr-only">Open sidebar</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            <div class="flex-1 flex justify-between px-4">
                <div class="flex-1 flex items-center">
                    <h1 class="text-lg font-medium text-gray-900">
                        {startup?.company_name || 'Dashboard'}
                    </h1>
                </div>
            </div>
        </div>

        <!-- Main content area -->
        <main class="flex-1">
            <div class="py-6">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</div>