<!-- src/routes/(dashboard)/startup/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import type { StartupCampaign } from '$lib/types/dashboard.type';
	import {
		BarChart,
		Users,
		DollarSign,
		Clock,
		AlertCircle,
		CheckCircle,
		XCircle,
		Loader2
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	$: campaign = data.campaign as StartupCampaign | null;
	$: verificationStatus = campaign?.verification_status || 'unverified';

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	type Status = 'unverified' | 'pending' | 'verified' | 'rejected';

	const getStatusColor = (status: Status) => {
		const colors: Record<Status, string> = {
			unverified: 'bg-gray-100 text-gray-800',
			pending: 'bg-yellow-100 text-yellow-800',
			verified: 'bg-green-100 text-green-800',
			rejected: 'bg-red-100 text-red-800'
		};
		return colors[status] || colors.unverified;
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'verified':
				return CheckCircle;
			case 'rejected':
				return XCircle;
			case 'pending':
				return Loader2;
			default:
				return AlertCircle;
		}
	};

	function getStatusMessage(status: string): { title: string; message: string } {
		switch (status) {
			case 'verified':
				return {
					title: 'Campaign Verified',
					message: 'Your campaign is now live and visible to investors.'
				};
			case 'pending':
				return {
					title: 'Verification Pending',
					message: 'Your campaign is under review. This usually takes 1-2 business days.'
				};
			case 'rejected':
				return {
					title: 'Verification Rejected',
					message: 'Your campaign needs some changes. Please check your email for details.'
				};
			default:
				return {
					title: 'Unverified Campaign',
					message: 'Your campaign needs to be verified before it becomes visible to investors.'
				};
		}
	}

  
	$: statusInfo = getStatusMessage(verificationStatus);
	$: StatusIcon = getStatusIcon(verificationStatus);
	$: fundingProgress = campaign
		? ((campaign.funds_raised / campaign.funding_goal) * 100).toFixed(1)
		: '0';
</script>

<div class="py-6" transition:fade>
	{#if !campaign}
		<!-- No Campaign State -->
		<div class="text-center py-12">
			<div class="max-w-2xl mx-auto">
				<h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Startup Dashboard</h1>
				<p class="text-gray-600 mb-8">
					Get started by creating your startup campaign to connect with potential investors.
				</p>
				<a
					href="/dashboard/startup/campaign/new"
					class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium
                           rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
				>
					Create Your Campaign
				</a>
			</div>
		</div>
	{:else}
		<!-- Campaign Dashboard -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Verification Status Banner -->
			<div class="mb-8">
				<div
					class={`rounded-md p-4 ${
						verificationStatus === 'verified'
							? 'bg-green-50'
							: verificationStatus === 'pending'
								? 'bg-yellow-50'
								: verificationStatus === 'rejected'
									? 'bg-red-50'
									: 'bg-gray-50'
					}`}
				>
					<div class="flex">
						<div class="flex-shrink-0">
							<svelte:component
								this={StatusIcon}
								class={`h-5 w-5 ${
									verificationStatus === 'verified'
										? 'text-green-400'
										: verificationStatus === 'pending'
											? 'text-yellow-400 animate-spin'
											: verificationStatus === 'rejected'
												? 'text-red-400'
												: 'text-gray-400'
								}`}
							/>
						</div>
						<div class="ml-3">
							<h3
								class={`text-sm font-medium ${
									verificationStatus === 'verified'
										? 'text-green-800'
										: verificationStatus === 'pending'
											? 'text-yellow-800'
											: verificationStatus === 'rejected'
												? 'text-red-800'
												: 'text-gray-800'
								}`}
							>
								{statusInfo.title}
							</h3>
							<div class="mt-2 text-sm">
								<p
									class={verificationStatus === 'verified'
										? 'text-green-700'
										: verificationStatus === 'pending'
											? 'text-yellow-700'
											: verificationStatus === 'rejected'
												? 'text-red-700'
												: 'text-gray-700'}
								>
									{statusInfo.message}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Campaign Header -->
			<div class="md:flex md:items-center md:justify-between mb-8">
				<div class="flex-1 min-w-0">
					<h1 class="text-2xl font-bold text-gray-900 truncate">
						{campaign.company_name}
					</h1>
					<div class="mt-1 flex items-center">
						<span
							class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                            ${getStatusColor(verificationStatus)}`}
						>
							{verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
						</span>
					</div>
				</div>
			</div>

			{#if verificationStatus === 'verified'}
				<!-- Stats Grid - Only shown for verified campaigns -->
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
					<!-- Funding Progress -->
					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<DollarSign class="h-6 w-6 text-gray-400" />
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt class="text-sm font-medium text-gray-500 truncate">Funding Progress</dt>
										<dd class="flex items-baseline">
											<div class="text-2xl font-semibold text-gray-900">
												{formatCurrency(campaign.funds_raised)}
											</div>
											<div class="ml-2 text-sm text-gray-600">
												/{formatCurrency(campaign.funding_goal)}
											</div>
										</dd>
									</dl>
								</div>
							</div>
						</div>
						<div class="bg-gray-50 px-5 py-3">
							<div class="w-full bg-gray-200 rounded-full h-2.5">
								<div
									class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
									style="width: {fundingProgress}%"
								></div>
							</div>
							<div class="mt-2 text-sm text-gray-600 text-right">
								{fundingProgress}%
							</div>
						</div>
					</div>

					<!-- Team Size -->
					<div class="bg-white overflow-hidden shadow rounded-lg">
						<div class="p-5">
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<Users class="h-6 w-6 text-gray-400" />
								</div>
								<div class="ml-5 w-0 flex-1">
									<dl>
										<dt class="text-sm font-medium text-gray-500 truncate">Team Members</dt>
										<dd class="text-2xl font-semibold text-gray-900">
											{campaign.team_members.length}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Campaign Details - Shown for all states -->
			<div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
				<div class="px-4 py-5 sm:px-6">
					<h2 class="text-lg leading-6 font-medium text-gray-900">Campaign Details</h2>
				</div>
				<div class="border-t border-gray-200">
					<dl>
						<div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
							<dt class="text-sm font-medium text-gray-500">Industry</dt>
							<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{campaign.industry.charAt(0).toUpperCase() + campaign.industry.slice(1)}
							</dd>
						</div>
						<div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
							<dt class="text-sm font-medium text-gray-500">Description</dt>
							<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
								{campaign.description}
							</dd>
						</div>
						{#if campaign.social_links}
							<div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt class="text-sm font-medium text-gray-500">Social Links</dt>
								<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									<div class="space-y-2">
										{#if campaign.social_links.website}
											<a
												href={campaign.social_links.website}
												target="_blank"
												rel="noopener noreferrer"
												class="text-indigo-600 hover:text-indigo-900 block"
											>
												Website
											</a>
										{/if}
										{#if campaign.social_links.linkedin}
											<a
												href={campaign.social_links.linkedin}
												target="_blank"
												rel="noopener noreferrer"
												class="text-indigo-600 hover:text-indigo-900 block"
											>
												LinkedIn
											</a>
										{/if}
									</div>
								</dd>
							</div>
						{/if}
					</dl>
				</div>
			</div>
		</div>
	{/if}
</div>
