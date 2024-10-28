<script lang="ts">
    import { page } from '$app/stores';
    import {
        CreditCard,
        Wallet,
        ArrowUpRight,
        ArrowDownRight,
        Shield,
        History,
        Settings
    } from 'lucide-svelte';
    import type { PageData } from './$types';
	import { pb } from '$lib/pocketbase';
    
    export let data: PageData;
    
    let showDepositModal = false;
    let showWithdrawModal = false;
    let amount = '';
    let loading = false;
    let error = '';
    let success = '';

    async function handleDeposit() {
        if (!amount || isNaN(Number(amount))) {
            error = 'Please enter a valid amount';
            return;
        }

        loading = true;
        error = '';

        try {
            // Implement your deposit logic here
            // This could integrate with your payment gateway
            const depositData = {
                user: data.profile.user,
                type: 'deposit',
                amount: Number(amount),
                status: 'pending'
            };

            await pb.collection('transactions').create(depositData);
            success = 'Deposit initiated successfully';
            showDepositModal = false;
        } catch (err) {
            error = 'Failed to process deposit';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function handleWithdraw() {
        if (!amount || isNaN(Number(amount))) {
            error = 'Please enter a valid amount';
            return;
        }

        loading = true;
        error = '';

        try {
            // Implement your withdrawal logic here
            const withdrawData = {
                user: data.profile.user,
                type: 'withdrawal',
                amount: Number(amount),
                status: 'pending'
            };

            await pb.collection('transactions').create(withdrawData);
            success = 'Withdrawal request submitted';
            showWithdrawModal = false;
        } catch (err) {
            error = 'Failed to process withdrawal';
            console.error(err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="py-6">
        <!-- Header -->
        <div class="md:flex md:items-center md:justify-between">
            <div class="min-w-0 flex-1">
                <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                    Account & Wallet
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                    Manage your funds and account settings
                </p>
            </div>
        </div>

        <!-- Account Balance & Actions -->
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Balance Card -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900">Available Balance</h3>
                    <Shield class="h-5 w-5 text-green-500" />
                </div>
                <p class="mt-2 text-3xl font-bold text-gray-900">
                    KES {data.profile.wallet_balance || 0}
                </p>
                <div class="mt-4 flex space-x-3">
                    <button
                        on:click={() => showDepositModal = true}
                        class="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                    >
                        Deposit
                    </button>
                    <button
                        on:click={() => showWithdrawModal = true}
                        class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-medium text-gray-900">Quick Stats</h3>
                <dl class="mt-4 grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <dt class="text-sm font-medium text-gray-500">Total Deposited</dt>
                        <dd class="mt-1 text-2xl font-semibold text-gray-900">
                            KES {data.profile.total_deposits || 0}
                        </dd>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <dt class="text-sm font-medium text-gray-500">Total Withdrawn</dt>
                        <dd class="mt-1 text-2xl font-semibold text-gray-900">
                            KES {data.profile.total_withdrawals || 0}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="mt-8">
            <div class="bg-white rounded-lg shadow-sm">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg font-medium text-gray-900">Recent Transactions</h3>
                    <div class="mt-6 flow-root">
                        {#if data.transactions?.length}
                            <ul role="list" class="-my-5 divide-y divide-gray-200">
                                {#each data.transactions as transaction}
                                    <li class="py-4">
                                        <div class="flex items-center space-x-4">
                                            <div class="flex-shrink-0">
                                                {#if transaction.type === 'deposit'}
                                                    <ArrowUpRight class="h-6 w-6 text-green-500" />
                                                {:else}
                                                    <ArrowDownRight class="h-6 w-6 text-red-500" />
                                                {/if}
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <p class="text-sm font-medium text-gray-900">
                                                    {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                                </p>
                                                <p class="text-sm text-gray-500">
                                                    {new Date(transaction.created).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <span class={`text-sm font-medium ${
                                                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.type === 'deposit' ? '+' : '-'}
                                                    KES {transaction.amount}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <div class="text-center py-6">
                                <History class="mx-auto h-12 w-12 text-gray-400" />
                                <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    Start by making a deposit to your account.
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Deposit Modal -->
{#if showDepositModal}
    <!-- Add your deposit modal implementation -->
{/if}

<!-- Withdraw Modal -->
{#if showWithdrawModal}
    <!-- Add your withdraw modal implementation -->
{/if}