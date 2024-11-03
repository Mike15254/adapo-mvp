<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Campaign } from '$lib/types/campaign.types';
	import { campaignService } from '$lib/services/campaign.service';
	import { investmentService } from '$lib/services/investment.service';
	import { page } from '$app/stores';
	import { BookText, XIcon } from 'lucide-svelte';

	export let data: { campaign: Campaign };

	let campaign = data.campaign;
	let loading = false;
	let showInvestModal = false;
	let investmentAmount = campaign.min_investment;
	let investmentError: string | null = null;
	let agreeToTerms = false;
	let confirmUnderstanding = false;

	function validateInvestment(amount: number): string | null {
		if (!amount || amount <= 0) {
			return 'Please enter a valid amount';
		}
		if (amount < campaign.min_investment) {
			return `Minimum investment is ${formatCurrency(campaign.min_investment)}`;
		}
		const remainingFunding = campaign.funding_goal - campaign.current_funding;
		if (amount > remainingFunding) {
			return `Amount exceeds remaining funding goal of ${formatCurrency(remainingFunding)}`;
		}
		return null;
	}

	async function handleInvestment() {
		const error = validateInvestment(investmentAmount);
		if (error) {
			investmentError = error;
			return;
		}

		try {
			loading = true;
			investmentError = null;
			await investmentService.createInvestment({
				campaignId: campaign.id,
				amount: investmentAmount
			});
			// Refresh campaign data
			campaign = await campaignService.getCampaignDetails(campaign.id);
			showInvestModal = false;
		} catch (error: any) {
			investmentError = error.message;
		} finally {
			loading = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'KES',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: fundingPercentage = Math.round((campaign.current_funding / campaign.funding_goal) * 100);
	$: remainingFunding = campaign.funding_goal - campaign.current_funding;
</script>

<!-- Rest of your template -->
<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
	<!-- Loading State -->
	{#if loading && !campaign}
		<!-- Your loading skeleton -->
	{:else if campaign}
		<!-- Campaign Header -->
		<div class="bg-white rounded-lg shadow-sm p-6 mb-6" transition:fade>
			<!-- ... rest of your header code ... -->
		</div>

		<!-- Main Content Grid -->
		<div class="grid grid-cols-3 gap-6">
			<!-- Left Column -->
			<div class="col-span-2 space-y-6">
				<!-- About -->
				<div class="bg-white rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-bold text-gray-900 mb-4">About</h2>
					<div class="prose max-w-none">
						{campaign.description}
					</div>
				</div>

				<!-- Team -->
				{#if campaign.startup.team_members?.length > 0}
					<div class="bg-white rounded-lg shadow-sm p-6">
						<h2 class="text-xl font-bold text-gray-900 mb-4">Team</h2>
						<div class="grid grid-cols-2 gap-4">
							{#each campaign.startup.team_members as member}
								<div class="border rounded-lg p-4">
									<h3 class="font-medium text-gray-900">{member.name}</h3>
									<p class="text-sm text-gray-500">{member.role}</p>
									<p class="mt-2 text-sm text-gray-600">{member.bio}</p>
									{#if member.linkedin}
										<a
											href={member.linkedin}
											target="_blank"
											rel="noopener noreferrer"
											class="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
										>
											LinkedIn Profile
											<svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
												/>
												<path
													d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
												/>
											</svg>
										</a>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Documents -->
				<div class="bg-white rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-bold text-gray-900 mb-4">Documents</h2>
					<div class="space-y-4">
						{#if campaign.pitch_deck}
							<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div class="flex items-center">
									<BookText class="h-5 w-5 text-indigo-500" />
									<span class="ml-2 text-sm font-medium text-gray-900">Pitch Deck</span>
								</div>
								<a
									href={campaign.pitch_deck}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-indigo-600 hover:text-indigo-800"
								>
									View
								</a>
							</div>
						{/if}
						{#each campaign.documents as doc}
							<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div class="flex items-center">
									<BookText class="h-5 w-5 text-indigo-500" />
									<span class="ml-2 text-sm font-medium text-gray-900">{doc.name}</span>
								</div>
								<a
									href={doc.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-sm text-indigo-600 hover:text-indigo-800"
								>
									View
								</a>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Column -->
			<div class="space-y-6">
				<!-- Investment Details -->
				<div class="bg-white rounded-lg shadow-sm p-6">
					<h2 class="text-lg font-bold text-gray-900 mb-4">Investment Details</h2>
					<dl class="space-y-4">
						<div>
							<dt class="text-sm text-gray-500">Minimum Investment</dt>
							<dd class="mt-1 text-lg font-medium text-gray-900">
								{formatCurrency(campaign.min_investment)}
							</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Investment Type</dt>
							<dd class="mt-1 text-lg font-medium text-gray-900">
								{campaign.investment_type}
							</dd>
						</div>
						<div>
							<dt class="text-sm text-gray-500">Security Type</dt>
							<dd class="mt-1 text-lg font-medium text-gray-900">
								{campaign.security_type}
							</dd>
						</div>
					</dl>
					<div class="mt-6">
						<button
							class="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
                                   font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                                   focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							on:click={() => (showInvestModal = true)}
						>
							Invest Now
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Investment Modal -->
		{#if showInvestModal}
			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
				<div class="bg-white rounded-lg max-w-md w-full p-6" transition:fade>
					<div class="flex justify-between items-start mb-4">
						<h2 class="text-xl font-bold text-gray-900">
							Invest in {campaign.title || campaign.company_name}
						</h2>
						<button
							class="text-gray-400 hover:text-gray-500"
							on:click={() => (showInvestModal = false)}
						>
							<span class="sr-only">Close</span>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div class="space-y-4">
						<!-- Investment Amount Input -->
						<div>
							<label class="block text-sm font-medium text-gray-700"> Investment Amount </label>
							<div class="mt-1 relative rounded-md shadow-sm">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<span class="text-gray-500 sm:text-sm">KES</span>
								</div>
								<input
									type="number"
									bind:value={investmentAmount}
									min={campaign.min_investment}
									step="100"
									class="pl-12 mt-1 block w-full rounded-md border-gray-300 shadow-sm
                                           focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
								/>
							</div>
							{#if investmentError}
								<p class="mt-2 text-sm text-red-600">
									{investmentError}
								</p>
							{/if}
						</div>

						<!-- Terms and Conditions -->
						<div class="space-y-2">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={agreeToTerms}
									class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<span class="ml-2 text-sm text-gray-600">
									I agree to the investment terms and conditions
								</span>
							</label>

							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={confirmUnderstanding}
									class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
								/>
								<span class="ml-2 text-sm text-gray-600">
									I understand the risks associated with this investment
								</span>
							</label>
						</div>

						<div class="flex justify-end space-x-3 mt-6">
							<button
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium
                                       text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2
                                       focus:ring-offset-2 focus:ring-indigo-500"
								on:click={() => (showInvestModal = false)}
							>
								Cancel
							</button>
							<button
								class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm
                                       font-medium text-white bg-indigo-600 hover:bg-indigo-700
                                       focus:outline-none focus:ring-2 focus:ring-offset-2
                                       focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={!agreeToTerms || !confirmUnderstanding || !investmentAmount || loading}
								on:click={handleInvestment}
							>
								{loading ? 'Processing...' : 'Confirm Investment'}
							</button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="text-center py-12" transition:fade>
			<h2 class="text-xl font-medium text-gray-900">Campaign not found</h2>
			<p class="mt-2 text-sm text-gray-500">
				The campaign you're looking for doesn't exist or has been removed.
			</p>
		</div>
	{/if}
</div>
