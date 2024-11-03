<!-- src/routes/(dashboard)/investor/wallet/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { PlusCircle, MinusCircle, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-svelte';
	import { wallet } from '$lib/stores/investor.store';
	import type { PageData } from './$types';

	export let data: PageData;

	let showDepositModal = false;
	let showWithdrawModal = false;
	let amount = 0;
	let loading = false;
	let error: string | null = null;

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
		if (amount <= 0) {
			error = 'Please enter a valid amount';
			return;
		}

		try {
			loading = true;
			error = null;
			// Implement deposit logic
			showDepositModal = false;
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	async function handleWithdraw() {
		if (amount <= 0) {
			error = 'Please enter a valid amount';
			return;
		}

		if (amount > ($wallet?.balance || 0)) {
			error = 'Insufficient funds';
			return;
		}

		try {
			loading = true;
			error = null;
			// Implement withdrawal logic
			showWithdrawModal = false;
		} catch (e: any) {
			error = error;
		} finally {
			loading = false;
		}
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
		<!-- Implement deposit modal -->
	{/if}

	<!-- Withdraw Modal -->
	{#if showWithdrawModal}
		<!-- Implement withdraw modal -->
	{/if}
</div>
