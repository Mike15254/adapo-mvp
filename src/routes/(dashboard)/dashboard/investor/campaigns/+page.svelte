<!-- src/routes/(dashboard)/investor/campaigns/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { Campaign, SortBy } from '$lib/types/campaign.types';
	import { campaignService } from '$lib/services/campaign.service';

	let campaigns: Campaign[] = [];
	let filteredCampaigns: Campaign[] = [];
	let loading = true;
	let filters = {
		industry: '',
		minInvestment: '',
		status: '',
		sortBy: 'newest' as SortBy
	};

	onMount(async () => {
		try {
			campaigns = await campaignService.getVerifiedCampaigns();
			applyFilters();
		} catch (error) {
			console.error('Error loading campaigns:', error);
		} finally {
			loading = false;
		}
	});

	function applyFilters() {
		filteredCampaigns = campaigns.filter((campaign) => {
			if (filters.industry && campaign.industry !== filters.industry) return false;
			if (filters.minInvestment && campaign.min_investment > parseInt(filters.minInvestment))
				return false;
			if (filters.status && campaign.status !== filters.status) return false;
			return true;
		});

		// Apply sorting
		switch (filters.sortBy) {
			case 'funding':
				filteredCampaigns.sort(
					(a, b) => b.current_funding / b.funding_goal - a.current_funding / a.funding_goal
				);
				break;
			case 'goal':
				filteredCampaigns.sort((a, b) => b.funding_goal - a.funding_goal);
				break;
			case 'newest':
				filteredCampaigns.sort(
					(a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
				);
				break;
		}
	}

	$: {
		if (campaigns.length) {
			applyFilters();
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
</script>

<!-- Filter Section -->
<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
	<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<!-- Industry Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Industry</label>
				<select
					bind:value={filters.industry}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="">All Industries</option>
					<option value="technology">Technology</option>
					<option value="healthcare">Healthcare</option>
					<option value="finance">Finance</option>
					<option value="education">Education</option>
					<option value="agriculture">Agriculture</option>
				</select>
			</div>

			<!-- Min Investment Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Min Investment</label>
				<select
					bind:value={filters.minInvestment}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="">Any Amount</option>
					<option value="1000">$1,000+</option>
					<option value="5000">$5,000+</option>
					<option value="10000">$10,000+</option>
					<option value="50000">$50,000+</option>
				</select>
			</div>

			<!-- Status Filter -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Status</label>
				<select
					bind:value={filters.status}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="funded">Funded</option>
					<option value="closed">Closed</option>
				</select>
			</div>

			<!-- Sort By -->
			<div>
				<label class="block text-sm font-medium text-gray-700">Sort By</label>
				<select
					bind:value={filters.sortBy}
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="newest">Newest First</option>
					<option value="funding">Funding Progress</option>
					<option value="goal">Funding Goal</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Campaigns Grid -->
	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Array(6) as _}
				<div class="animate-pulse bg-white rounded-lg shadow-sm p-6">
					<div class="h-4 bg-gray-200 rounded w-3/4 mb-4" />
					<div class="h-4 bg-gray-200 rounded w-1/2 mb-2" />
					<div class="h-4 bg-gray-200 rounded w-full mb-4" />
					<div class="h-2 bg-gray-200 rounded w-full mb-6" />
					<div class="h-8 bg-gray-200 rounded" />
				</div>
			{/each}
		</div>
	{:else if filteredCampaigns.length === 0}
		<div class="text-center py-12">
			<h3 class="text-lg font-medium text-gray-900">No campaigns found</h3>
			<p class="mt-2 text-sm text-gray-500">Try adjusting your filters to see more results</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredCampaigns as campaign (campaign.id)}
				<div class="bg-white rounded-lg shadow-sm overflow-hidden" transition:fade>
					<div class="p-6">
						<h4 class="text-lg font-medium text-gray-900 mb-2">
							{campaign.title || campaign.company_name}
						</h4>
						<p class="text-sm text-gray-500 mb-4">
							{campaign.description.substring(0, 100)}...
						</p>

						<div class="mb-4">
							<div class="flex justify-between text-sm text-gray-600">
								<span>{formatCurrency(campaign.current_funding)} raised</span>
								<span>{Math.round((campaign.current_funding / campaign.funding_goal) * 100)}%</span>
							</div>
							<div class="mt-1 relative pt-1">
								<div class="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
									<div
										style="width: {(campaign.current_funding / campaign.funding_goal) * 100}%"
										class="shadow-none flex flex-col text-center whitespace-nowrap text-white
                                               justify-center bg-indigo-600 transition-all duration-300"
									/>
								</div>
							</div>
						</div>

						<div class="flex justify-between items-center">
							<div class="text-sm text-gray-500">
								Min. Investment: {formatCurrency(campaign.min_investment)}
							</div>
							<a
								href={`/dashboard/investor/campaigns/${campaign.id}`}
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm
                                       font-medium rounded-md shadow-sm text-white bg-indigo-600
                                       hover:bg-indigo-700 focus:outline-none focus:ring-2
                                       focus:ring-offset-2 focus:ring-indigo-500"
							>
								View Campaign
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
