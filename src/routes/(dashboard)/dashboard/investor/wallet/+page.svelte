<!-- src/routes/(dashboard)/investor/wallet/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { PlusCircle, MinusCircle, ArrowUpRight, ArrowDownRight, DollarSign, X } from 'lucide-svelte';
	import type { WalletTransaction } from '$lib/types/dashboard.type';
	import { wallet } from '$lib/stores/investor.store';
	import type { PageData } from './$types';
	import { pb } from '$lib/pocketbase';

	export let data: PageData;

	let showDepositModal = false;
	let showWithdrawModal = false;
	const PAYMENT_METHODS = [
        { id: 'mpesa', name: 'M-Pesa', icon: '📱' },
        { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
        { id: 'card', name: 'Credit/Debit Card', icon: '💳' }
    ];

	let amount = '';
    let selectedMethod = PAYMENT_METHODS[0];
    let loading = false;
    let error: string | null = null;
    let success: string | null = null;


	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function handleDeposit() {
        if (!amount || parseFloat(amount) <= 0) {
            error = 'Please enter a valid amount';
            return;
        }

        loading = true;
        error = null;
        success = null;

        try {
            console.log('Starting deposit process...', { amount, method: selectedMethod.id });

            // 1. Create transaction record
            const transaction = await pb.collection('wallet_transactions').create({
                user: pb.authStore.model?.id,
                type: 'deposit',
                amount: parseFloat(amount),
                status: 'pending',
                reference: `DEP${Date.now()}`,
                description: `Deposit via ${selectedMethod.name}`,
                payment_method: selectedMethod.id,
                metadata: {
                    initiated_at: new Date().toISOString(),
                    payment_method: selectedMethod.id
                }
            });

            console.log('Transaction created:', transaction);

            // 2. Update wallet balance
            const updatedWallet = await pb.collection('wallets').update($wallet?.id, {
                balance: ($wallet?.balance || 0) + parseFloat(amount)
            });

            console.log('Wallet updated:', updatedWallet);

            // 3. Update transaction status to complete
            await pb.collection('wallet_transactions').update(transaction.id, {
                status: 'complete'
            });

            // 4. Show success message
            success = 'Deposit successful! Your wallet has been updated.';
            setTimeout(() => {
                showDepositModal = false;
            }, 2000);

            // // Refresh wallet data
            // await wallet.refreshWallet(pb.authStore.model?.id);

        } catch (e) {
            console.error('Deposit error:', e);
            error = 'Failed to process deposit. Please try again.';
        } finally {
            loading = false;
        }
    }

	async function handleWithdraw() {
		
	}
</script>

<div class="py-6" transition:fade>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Wallet Balance Card -->
		<div class="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
			<div class="px-4 py-5 sm:p-6">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-medium text-gray-900">Wallet Balance</h3>
						<p class="mt-1 text-3xl font-semibold text-gray-900">
							{formatCurrency($wallet?.balance || 0)}
						</p>
					</div>
					<div class="space-x-3">
						<button
							on:click={() => (showDepositModal = true)}
							class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
						>
							<PlusCircle class="h-5 w-5 mr-2" />
							Deposit
						</button>
						<button
							on:click={() => (showWithdrawModal = true)}
							class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							<MinusCircle class="h-5 w-5 mr-2" />
							Withdraw
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Transaction History -->
		<div class="bg-white shadow-sm rounded-lg">
			<div class="px-4 py-5 sm:px-6 border-b border-gray-200">
				<h3 class="text-lg font-medium text-gray-900">Transaction History</h3>
			</div>
			<div class="flow-root">
				<ul role="list" class="divide-y divide-gray-200">
					{#each $wallet?.transactions || [] as transaction}
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
									<p class="text-sm font-medium text-gray-900">
										{transaction.description}
									</p>
									<p class="text-sm text-gray-500">
										{formatDate(transaction.created)}
									</p>
								</div>
								<div>
									<span
										class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${
																					transaction.type === 'deposit'
																						? 'bg-green-100 text-green-800'
																						: transaction.type === 'withdrawal'
																							? 'bg-red-100 text-red-800'
																							: 'bg-blue-100 text-blue-800'
																				}`}
									>
										{formatCurrency(transaction.amount)}
									</span>
								</div>
								<div>
									<span
										class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${
																					transaction.status === 'completed'
																						? 'bg-green-100 text-green-800'
																						: transaction.status === 'pending'
																							? 'bg-yellow-100 text-yellow-800'
																							: 'bg-red-100 text-red-800'
																				}`}
									>
										{transaction.status}
									</span>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<!-- Deposit Modal -->
	{#if showDepositModal}
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40" />
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
			<div
				class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
			>
				<!-- Close Button -->
				<button
					class="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
					on:click={() => (showDepositModal = false)}
				>
					<X class="h-6 w-6" />
				</button>
	
				<!-- Modal Content -->
				<div class="sm:flex sm:items-start">
					<div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
						<h3 class="text-lg font-semibold leading-6 text-gray-900 mb-4">
							Deposit Funds
						</h3>
	
						<!-- Error Message -->
						{#if error}
							<div class="mb-4 bg-red-50 p-4 rounded-md">
								<p class="text-sm text-red-700">{error}</p>
							</div>
						{/if}
	
						<!-- Success Message -->
						{#if success}
							<div class="mb-4 bg-green-50 p-4 rounded-md">
								<p class="text-sm text-green-700">{success}</p>
							</div>
						{/if}
	
						<form class="space-y-4" on:submit|preventDefault={handleDeposit}>
							<!-- Amount Input -->
							<div>
								<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
									Amount (KES)
								</label>
								<div class="relative mt-1 rounded-md shadow-sm">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<span class="text-gray-500 sm:text-sm">KES</span>
									</div>
									<input
										type="number"
										name="amount"
										id="amount"
										bind:value={amount}
										class="block w-full rounded-md border-gray-300 pl-12 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="0.00"
										min="0"
										step="0.01"
										required
									/>
								</div>
							</div>
	
							<!-- Payment Method Selection -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Payment Method
								</label>
								<div class="grid grid-cols-3 gap-3">
									{#each PAYMENT_METHODS as method}
										<button
											type="button"
											class="relative flex items-center justify-center p-3 rounded-lg border {selectedMethod.id === method.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white'} hover:bg-gray-50"
											on:click={() => (selectedMethod = method)}
										>
											<span class="mr-2">{method.icon}</span>
											<span class="text-sm font-medium">{method.name}</span>
										</button>
									{/each}
								</div>
							</div>
	
							<!-- Submit Button -->
							<button
								type="submit"
								class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
								disabled={loading}
							>
								{#if loading}
									<svg
										class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										/>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Processing...
								{:else}
									Deposit {amount ? `KES ${amount}` : ''}
								{/if}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	{/if}

	<!-- Withdraw Modal -->
	{#if showWithdrawModal}
		<!-- Implement withdraw modal -->
	{/if}
</div>
