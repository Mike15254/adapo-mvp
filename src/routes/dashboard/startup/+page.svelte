<script lang="ts">
    import type { PageData } from './$types';
    import {
        DollarSign,
        Users,
        TrendingUp,
        AlertTriangle,
        BadgeCheck,
        Clock,
        Calendar,
        ChevronRight
    } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';
    
    export let data: PageData;
    
    $: ({ startup, stats, updates, error } = data);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format relative time
    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return formatDate(dateStr);
    };
</script>

<div class="space-y-6">
    <!-- Verification Banner -->
    {#if startup && startup.verification_status !== 'verified'}
        <div 
            class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md"
            in:fade
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <AlertTriangle class="h-5 w-5 text-yellow-400" />
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                        Verification Required
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                        <p>
                            Complete verification to unlock all features and build trust with investors.
                        </p>
                    </div>
                    <div class="mt-4">
                        <div class="-mx-2 -my-1.5 flex">
                            <a
                                href="/dashboard/startup/verification"
                                class="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                            >
                                Start Verification
                                <ChevronRight class="inline-block h-4 w-4 ml-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" in:fade>
        <!-- Total Funding -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <DollarSign class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Total Funding Raised
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(stats.totalFundsRaised)}
                                </div>
                                {#if stats.progressPercentage > 0}
                                    <div class="ml-2">
                                        <span class="text-sm text-gray-500">
                                            of {formatCurrency(stats.fundingGoal)}
                                        </span>
                                    </div>
                                {/if}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            {#if stats.fundingGoal > 0}
                <div class="bg-gray-50 px-5 py-3">
                    <div class="text-sm">
                        <div class="font-medium text-gray-700">
                            {stats.progressPercentage.toFixed(1)}% of goal
                        </div>
                        <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div
                                class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style="width: {stats.progressPercentage}%"
                            />
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Total Investors -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <Users class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Total Investors
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {stats.totalInvestors}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a 
                        href="/dashboard/startup/investors" 
                        class="font-medium text-indigo-600 hover:text-indigo-900"
                    >
                        View all investors
                        <ChevronRight class="inline-block h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>

        <!-- Verification Status -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        {#if startup?.verification_status === 'verified'}
                            <BadgeCheck class="h-6 w-6 text-green-500" />
                        {:else}
                            <AlertTriangle class="h-6 w-6 text-yellow-400" />
                        {/if}
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Verification Status
                            </dt>
                            <dd>
                                <span class="text-lg font-medium capitalize 
                                    {startup?.verification_status === 'verified' ? 'text-green-600' : 
                                     startup?.verification_status === 'pending' ? 'text-yellow-600' : 
                                     'text-gray-600'}">
                                    {startup?.verification_status || 'unverified'}
                                </span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            {#if startup?.verification_status !== 'verified'}
                <div class="bg-gray-50 px-5 py-3">
                    <div class="text-sm">
                        <a 
                            href="/dashboard/startup/verification" 
                            class="font-medium text-indigo-600 hover:text-indigo-900"
                        >
                            Complete verification
                            <ChevronRight class="inline-block h-4 w-4" />
                        </a>
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Recent Activity & Updates -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Recent Investments -->
        <div class="bg-white rounded-lg shadow" in:fade={{ delay: 200 }}>
            <div class="p-6">
                <h2 class="text-base font-medium text-gray-900">
                    Recent Investments
                </h2>
                <div class="mt-6 flow-root">
                    {#if stats.recentInvestments.length > 0}
                        <ul role="list" class="-my-5 divide-y divide-gray-200">
                            {#each stats.recentInvestments as investment}
                                <li class="py-4">
                                    <div class="flex items-center space-x-4">
                                        <div class="flex-shrink-0">
                                            <DollarSign class="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-sm font-medium text-gray-900">
                                                {formatCurrency(investment.amount)}
                                            </p>
                                            <p class="text-sm text-gray-500">
                                                {getRelativeTime(investment.transaction_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                {investment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                 investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                 'bg-gray-100 text-gray-800'}">
                                                {investment.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="text-center py-6">
                            <DollarSign class="mx-auto h-12 w-12 text-gray-400" />
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No investments yet</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Start fundraising to receive investments.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Recent Updates -->
        <div class="bg-white rounded-lg shadow" in:fade={{ delay: 300 }}>
            <div class="p-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-base font-medium text-gray-900">
                        Recent Updates
                    </h2>
                    <a
                        href="/dashboard/startup/updates/new"
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                        Post Update
                    </a>
                </div>
                <div class="mt-6 flow-root">
                    {#if updates.length > 0}
                        <ul role="list" class="-my-5 divide-y divide-gray-200">
                            {#each updates as update}
                                <li class="py-4">
                                    <div class="flex items-center space-x-4">
                                        <div class="flex-shrink-0">
                                            <Calendar class="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-sm font-medium text-gray-900">
                                                {update.title}
                                            </p>
                                            <p class="text-sm text-gray-500">
                                                {getRelativeTime(update.created)}
                                            </p>
                                        </div>
                                        <div>
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                {update.update_type === 'milestone' ? 'bg-green-100 text-green-800' : 
                                                 update.update_type === 'financial' ? 'bg-blue-100 text-blue-800' : 
                                                 'bg-gray-100 text-gray-800'}">
                                                {update.update_type}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="text-center py-6">
                            <Calendar class="mx-auto h-12 w-12 text-gray-400" />
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No updates yet</h3>
                            <p class="mt-1 text-sm text-gray-500">
                                Keep investors informed by posting regular updates.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>