<!-- src/routes/(dashboard)/investor/+page.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { 
        Wallet, TrendingUp, DollarSign, AlertCircle,
        ArrowUpRight, ArrowDownRight, Briefcase
    } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { investorStore, wallet, investments, availableCampaigns } from '$lib/stores/investor.store';

    export let data: PageData;

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function calculateProgress(campaign: any): number {
        return (campaign.funds_raised / campaign.funding_goal) * 100;
    }

    $: walletBalance = $wallet?.balance || 0;
    $: totalInvested = $investments?.reduce((sum, inv) => 
        inv.status === 'complete' ? sum + inv.amount : sum, 0) || 0;
    $: activeInvestments = $investments?.filter(inv => 
        inv.status === 'complete').length || 0;
    $: verificationStatus = data.profile?.verificationStatus || 'unverified';
</script>

<div class="py-6" in:fade={{ duration: 300 }}>
    <!-- Verification Banner -->
    {#if verificationStatus !== 'verified'}
        <div class="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
                <AlertCircle class="h-5 w-5 text-yellow-400" />
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">
                        Complete Your Verification
                    </h3>
                    <p class="mt-2 text-sm text-yellow-700">
                        Get verified to unlock full investment capabilities and higher limits.
                    </p>
                    
                     <a   href="/dashboard/investor/verification"
                        class="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                    >
                        Complete Verification
                    </a>
                </div>
            </div>
        </div>
    {/if}

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
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
                                Available Balance
                            </dt>
                            <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                {formatCurrency(walletBalance)}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <a href="/dashboard/investor/wallet" class="text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    Manage Wallet →
                </a>
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
                                <span class="ml-2 text-sm text-gray-500">
                                    {activeInvestments} active
                                </span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <a href="/dashboard/investor/investments" class="text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    View Portfolio →
                </a>
            </div>
        </div>

        <!-- Investment Opportunities -->
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
            <div class="p-5">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <Briefcase class="h-6 w-6 text-gray-400" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                Available Campaigns
                            </dt>
                            <dd class="mt-1 text-2xl font-semibold text-gray-900">
                                {$availableCampaigns.length}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
                <a href="/dashboard/investor/campaigns" class="text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    View Opportunities →
                </a>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
                <p class="mt-1 text-sm text-gray-500">Your latest transactions and investments</p>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200">
                    {#each ($wallet?.transactions || []).slice(0, 5) as transaction}
                        <li class="px-6 py-5 hover:bg-gray-50 transition-colors">
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
                                    <p class="text-sm font-medium text-gray-900">
                                        {transaction.description}
                                    </p>
                                    <div class="mt-1 flex items-center text-sm text-gray-500">
                                        <span>{formatDate(transaction.created)}</span>
                                        {#if transaction.reference}
                                            <span class="mx-2">•</span>
                                            <span>{transaction.reference}</span>
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex flex-col items-end space-y-1">
                                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' : 
                                          'bg-blue-100 text-blue-800'}`}>
                                        {formatCurrency(transaction.amount)}
                                    </span>
                                    <span class={`text-xs ${
                                        transaction.status === 'complete' ? 'text-green-600' :
                                        transaction.status === 'pending' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>

        <!-- Investment Opportunities -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Featured Opportunities</h2>
                <p class="mt-1 text-sm text-gray-500">Verified campaigns ready for investment</p>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200">
                    {#each $availableCampaigns.filter(c => c.verification_status === 'verified').slice(0, 5) as campaign}
                        <li class="px-6 py-5 hover:bg-gray-50 transition-colors">
                            <div class="flex items-center space-x-4">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900">
                                        {campaign.company_name}
                                    </p>
                                    <p class="mt-1 text-sm text-gray-500">
                                        {campaign.industry.charAt(0).toUpperCase() + campaign.industry.slice(1)}
                                    </p>
                                    <div class="mt-2">
                                        <div class="flex items-center">
                                            <div class="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    class="bg-indigo-600 h-2 rounded-full"
                                                    style={`width: ${Math.min(calculateProgress(campaign), 100)}%`}
                                                ></div>
                                            </div>
                                            <span class="ml-2 text-xs text-gray-500">
                                                {Math.round(calculateProgress(campaign))}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end">
                                    <span class="text-sm font-medium text-gray-900">
                                        {formatCurrency(campaign.funding_goal)}
                                    </span>
                                    
                                    <a    href={`/dashboard/investor/campaigns/${campaign.id}`}
                                        class="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                    >
                                        View Details →
                                    </a>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="bg-gray-50 px-6 py-4">
                
                <a    href="/dashboard/investor/campaigns"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                    Explore All Opportunities
                </a>
            </div>
        </div>
    </div>
</div>