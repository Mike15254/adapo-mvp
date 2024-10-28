<script lang="ts">
    import type { PageData } from './$types';
    import {
        TrendingUp,
        DollarSign,
        Briefcase,
        BarChart,
        ArrowUpRight,
        ArrowDownRight,
        ChevronRight,
		AlertTriangle,
    } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';

    export let data: PageData;

    $: ({ stats, profile } = data);

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
</script>

<!-- Verification Banner -->
{#if data.profile?.verificationStatus !== 'verified'}
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
                    
                </div>
            </div>
        </div>
{/if}

<div class="space-y-6 mt-6">
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                Investment Dashboard
            </h2>
            <p class="mt-1 text-sm text-gray-500">
                Track your investments and discover new opportunities
            </p>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
            <a
                href="/dashboard/investor/opportunities"
                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
                <TrendingUp class="h-4 w-4 mr-2" />
                Find Opportunities
            </a>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" in:fade>
        <!-- Total Invested -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <DollarSign class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="truncate text-sm font-medium text-gray-500">
                                Total Invested
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(stats.totalInvested)}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/investments" class="font-medium text-indigo-600 hover:text-indigo-900">
                        View all investments
                    </a>
                </div>
            </div>
        </div>

        <!-- Active Investments -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <Briefcase class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="truncate text-sm font-medium text-gray-500">
                                Active Investments
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {stats.activeInvestments}
                                </div>
                                <div class="ml-2">
                                    <span class="text-sm text-gray-500">
                                        projects
                                    </span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/investments" class="font-medium text-indigo-600 hover:text-indigo-900">
                        View portfolio
                    </a>
                </div>
            </div>
        </div>

        <!-- Portfolio Companies -->
        <div class="bg-white overflow-hidden rounded-lg shadow">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <BarChart class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="truncate text-sm font-medium text-gray-500">
                                Portfolio Companies
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {stats.portfolioCompanies}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/investments" class="font-medium text-indigo-600 hover:text-indigo-900">
                        View companies
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Investments & Industry Performance -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Recent Investments -->
        <div class="bg-white shadow rounded-lg" in:fly={{ y: 20, duration: 300, delay: 200 }}>
            <div class="p-6">
                <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Recent Investments
                </h3>
                <div class="mt-6 flow-root">
                    {#if stats.recentInvestments.length > 0}
                        <ul role="list" class="-my-5 divide-y divide-gray-200">
                            {#each stats.recentInvestments as investment}
                                <li class="py-4">
                                    <div class="flex items-center space-x-4">
                                        <div class="flex-shrink-0">
                                            <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <DollarSign class="h-5 w-5 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <p class="text-sm font-medium text-gray-900">
                                                {investment.expand?.startup?.company_name || 'Unknown Company'}
                                            </p>
                                            <p class="text-sm text-gray-500">
                                                {formatCurrency(investment.amount)} • {formatDate(investment.transaction_date)}
                                            </p>
                                        </div>
                                        <div>
                                            <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                ${investment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                  investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
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
                                Start investing to see your recent activity here.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Industry Performance -->
        <div class="bg-white shadow rounded-lg" in:fly={{ y: 20, duration: 300, delay: 300 }}>
            <div class="p-6">
                <h3 class="text-base font-semibold leading-6 text-gray-900">
                    Industry Performance
                </h3>
                <div class="mt-6">
                    {#each Object.entries(stats.performanceByIndustry) as [industry, data]}
                        {#if data.count > 0}
                            <div class="mb-4 last:mb-0">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center">
                                            <h4 class="text-sm font-medium text-gray-900 capitalize">
                                                {industry}
                                            </h4>
                                            <span class="ml-2 text-sm text-gray-500">
                                                ({data.count} investments)
                                            </span>
                                        </div>
                                        <div class="mt-1">
                                            <p class="text-sm text-gray-500">
                                                {formatCurrency(data.totalInvested)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <div class="overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            class="h-2 rounded-full bg-indigo-600"
                                            style="width: {(data.totalInvested / stats.totalInvested * 100)}%"
                                        />
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>