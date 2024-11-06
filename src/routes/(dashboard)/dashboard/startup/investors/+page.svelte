<!-- src/routes/(dashboard)/startup/investors/+page.svelte -->
<script lang="ts">
    import { fade } from 'svelte/transition';
    import { 
        Users, DollarSign, TrendingUp, 
        Calendar, Search, Filter 
    } from 'lucide-svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    // Search and filter
    let searchQuery = '';
    let selectedFilter = 'all';
    let sortBy = 'amount';


    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    $: investors = data.investors || [];
    $: stats = data.stats || { totalAmount: 0, totalInvestors: 0 };

    // Filter and sort investors
    $: filteredInvestors = investors
        .filter(investor => {
            if (!searchQuery) return true;
            
            const searchLower = searchQuery.toLowerCase();
            return (
                investor.user.name?.toLowerCase().includes(searchLower) ||
                investor.user.email?.toLowerCase().includes(searchLower) ||
                investor.profile?.profession?.toLowerCase().includes(searchLower)
            );
        })
        .sort((a, b) => {
            if (sortBy === 'amount') {
                return b.totalInvested - a.totalInvested;
            }
            // Add more sorting options as needed
            return 0;
        });

        function formatCurrency(amount: number) {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    }
</script>

<div class="py-6" in:fade={{ duration: 300 }}>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Investors Overview</h1>
            <p class="mt-2 text-sm text-gray-600">
                Track and manage your campaign investors
            </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            

            <!-- Total Investment -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <!-- <DollarSign class="h-6 w-6 text-gray-400" /> -->
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">
                                    Total Investment
                                </dt>
                                <dd class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(stats.totalAmount)}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Average Investment -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <TrendingUp class="h-6 w-6 text-gray-400" />
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">
                                    Average Investment
                                </dt>
                                <dd class="text-2xl font-semibold text-gray-900">
                                    {formatCurrency(stats.totalInvestors ? stats.totalAmount / stats.totalInvestors : 0)}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white shadow rounded-lg mb-8">
            <div class="p-6">
                <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div class="flex-1">
                        <div class="relative rounded-md shadow-sm">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Search class="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                bind:value={searchQuery}
                                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search investors..."
                            />
                        </div>
                    </div>
                    <select
                        bind:value={sortBy}
                        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="amount">Sort by Amount</option>
                        <option value="date">Sort by Date</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Investors List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Investor
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Invested
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Investment
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each filteredInvestors as { user, profile, totalInvested, transactions }}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        {#if user.profile_picture}
                                            <img class="h-10 w-10 rounded-full" src={user.profile_picture} alt="" />
                                        {:else}
                                            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span class="text-indigo-600 font-medium">
                                                    {user.name?.[0] || user.email[0]}
                                                </span>
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">
                                            {user.name || 'Anonymous'}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{profile?.type || 'N/A'}</div>
                                <div class="text-sm text-gray-500">{profile?.profession || ''}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {formatCurrency(totalInvested)}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(transactions[0]?.created)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${profile?.verificationStatus === 'verified' 
                                        ? 'bg-green-100 text-green-800'
                                        : profile?.verificationStatus === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'}`}>
                                    {profile?.verificationStatus || 'unverified'}
                                </span>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>