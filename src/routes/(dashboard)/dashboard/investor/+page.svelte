<!-- src/routes/(dashboard)/investor/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { 
        Wallet, 
        TrendingUp, 
        Users, 
        DollarSign, 
        PieChart,
        ArrowUpRight,
        ArrowDownRight
    } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { investorStore, wallet, investments, availableCampaigns } from '$lib/stores/investor.store';

    export let data: PageData;
    let isSubmitting = false;

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    }

    $: walletBalance = $wallet?.balance || 0;
    $: totalInvested = $investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
    $: activeInvestments = $investments?.filter(inv => inv.status === 'completed').length || 0;
    $: verificationStatus = data.profile?.verificationStatus || 'unverified';

    
</script>

<div class="py-6" transition:fade>
    <!-- Verification Status Banner -->
    {#if verificationStatus !== 'verified'}
        <div class="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                        Verification Required
                    </h3>
                    <div class="mt-2 text-sm text-yellow-700">
                        <p>Please complete your verification to start investing.</p>
                    </div>
                    <div class="mt-4">
                        <div class="-mx-2 -my-1.5 flex">
                            <a
                                href="/dashboard/investor/verification"
                                class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100"
                            >
                                Complete Verification
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Wallet Balance -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <Wallet class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Wallet Balance
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(walletBalance)}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/wallet" class="font-medium text-indigo-700 hover:text-indigo-900">
                        View wallet
                    </a>
                </div>
            </div>
        </div>

        <!-- Total Invested -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <DollarSign class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Total Invested
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(totalInvested)}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/investments" class="font-medium text-indigo-700 hover:text-indigo-900">
                        View investments
                    </a>
                </div>
            </div>
        </div>

        

        <!-- Available Campaigns -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <TrendingUp class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Available Campaigns
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {$availableCampaigns.length}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                    <a href="/dashboard/investor/campaigns" class="font-medium text-indigo-700 hover:text-indigo-900">
                        View opportunities
                    </a>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity and Available Campaigns -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Activity -->
        <div class="bg-white shadow-sm rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg font-medium">Recent Activity</h2>
            </div>
            <div class="border-t border-gray-200">
                <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200">
                        {#each $wallet?.transactions?.slice(0, 5) || [] as transaction}
                            <li class="px-4 py-4 sm:px-6">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        {#if transaction.type === 'deposit'}
                                            <ArrowUpRight class="h-6 w-6 text-green-500" />
                                        {:else if transaction.type === 'withdrawal'}
                                            <ArrowDownRight class="h-6 w-6 text-red-500" />
                                        {:else}
                                            <DollarSign class="h-6 w-6 text-blue-500" />
                                        {/if}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">
                                            {transaction.description}
                                        </p>
                                        <p class="text-sm text-gray-500">
                                            {new Date(transaction.created).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                                              transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' : 
                                              'bg-blue-100 text-blue-800'}`}>
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Available Campaigns Preview -->
        <div class="bg-white shadow-sm rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h2 class="text-lg font-medium">Investment Opportunities</h2>
            </div>
            <div class="border-t border-gray-200">
                <div class="flow-root">
                    <ul role="list" class="divide-y divide-gray-200">
                        {#each $availableCampaigns.slice(0, 5) as campaign}
                            <li class="px-4 py-4 sm:px-6">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900 truncate">
                                            {campaign.company_name}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate">
                                            {campaign.industry.charAt(0).toUpperCase() + campaign.industry.slice(1)}
                                        </p>
                                    </div>
                                    <div class="inline-flex flex-col items-end">
                                        <span class="text-sm font-medium text-gray-900">
                                            {formatCurrency(campaign.funding_goal)}
                                        </span>
                                        <span class="text-sm text-gray-500">
                                            Target
                                        </span>
                                    </div>
                                    <div>
                                        <a
                                            href={`/dashboard/investor/campaigns/${campaign.id}`}
                                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                        >
                                            View
                                        </a>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
            <div class="px-4 py-4 sm:px-6">
                <a
                    href="/dashboard/investor/campaigns"
                    class="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                    View All Opportunities
                </a>
            </div>
        </div>
    </div>
</div>
