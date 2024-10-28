<script lang="ts">
	import type { PageData } from './$types';
	import type { Project, ProjectStatus } from '$lib/types/project';
	import {
		Plus,
		Search,
		Filter,
		ArrowUpRight,
		ArrowDownRight,
		Rocket,
		Clock,
		CheckCircle,
		XCircle,
		TrendingUp,
		Users,
		BadgeDollarSign,
		Circle
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ErrorAlert from '$lib/components/ErrorAlert.svelte';

	export let data: PageData;
	let isLoading = true;
	let searchTerm = '';
	let selectedStatus: ProjectStatus | 'all' = 'all';
	let sortBy = 'newest';
	let selectedView: 'grid' | 'list' = 'grid';

	// Status badges config with proper typing
	const statusConfig: Record<ProjectStatus, { color: string; icon: any; description: string }> = {
		draft: {
			color: 'bg-gray-100 text-gray-800',
			icon: Clock,
			description: 'Not yet published'
		},
		active: {
			color: 'bg-green-100 text-green-800',
			icon: Rocket,
			description: 'Currently fundraising'
		},
		funded: {
			color: 'bg-blue-100 text-blue-800',
			icon: CheckCircle,
			description: 'Successfully funded'
		},
		closed: {
			color: 'bg-red-100 text-red-800',
			icon: XCircle,
			description: 'No longer accepting investments'
		}
	};

    

	// Format currency
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-KE', {
			style: 'currency',
			currency: 'KES',
			maximumFractionDigits: 0
		}).format(amount);
	};

	// Calculate funding progress
	const calculateProgress = (current: number, goal: number) => {
		return Math.round((current / goal) * 100);
	};

	// Calculate statistics
	$: statistics = {
		totalFunding: ((data.projects || []) as Project[]).reduce(
			(acc, project) => acc + (project.current_funding || 0),
			0
		),
		activeProjects: ((data.projects || []) as Project[]).filter(
			(project) => project.status === 'active'
		).length,
		totalProjects: ((data.projects || []) as Project[]).length,
		totalInvestors: new Set(
			((data.projects || []) as Project[])
				.flatMap((project) => project.expand?.investments || [])
				.map((inv) => inv.investor)
		).size
	};

	// Filter projects with proper typing
	$: filteredProjects = ((data.projects || []) as Project[])
		.filter(
			(project) =>
				project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				project?.description?.toLowerCase().includes(searchTerm.toLowerCase())
		)
		.filter((project) => selectedStatus === 'all' || project?.status === selectedStatus)
		.sort((a, b) => {
			if (!a || !b) return 0;
			if (sortBy === 'newest') return new Date(b.created).getTime() - new Date(a.created).getTime();
			if (sortBy === 'oldest') return new Date(a.created).getTime() - new Date(b.created).getTime();
			if (sortBy === 'funding-high') return (b.current_funding || 0) - (a.current_funding || 0);
			if (sortBy === 'funding-low') return (a.current_funding || 0) - (b.current_funding || 0);
			return 0;
		});

	onMount(() => {
		isLoading = false;
	});
</script>


{#if isLoading}
	<div class="flex justify-center items-center py-12">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
	</div>
{:else if data.error}
	<div class="py-4">
		<ErrorAlert message={data.error} />
	</div>
{:else}
	<!-- Statistics Overview -->
	<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<BadgeDollarSign class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Total Funding</dt>
							<dd class="flex items-baseline">
								<div class="text-2xl font-semibold text-gray-900">
									{formatCurrency(statistics.totalFunding)}
								</div>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Rocket class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
							<dd class="flex items-baseline">
								<div class="text-2xl font-semibold text-gray-900">
									{statistics.activeProjects}
								</div>
								<p class="ml-2 flex items-baseline text-sm text-gray-500">
									of {statistics.totalProjects}
								</p>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<Users class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Total Investors</dt>
							<dd class="text-2xl font-semibold text-gray-900">
								{statistics.totalInvestors}
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white overflow-hidden shadow rounded-lg">
			<div class="p-5">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<TrendingUp class="h-6 w-6 text-gray-400" />
					</div>
					<div class="ml-5 w-0 flex-1">
						<dl>
							<dt class="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
							<dd class="text-2xl font-semibold text-gray-900">
								{Math.round(
									(filteredProjects.filter((p) => p.status === 'funded').length /
										(filteredProjects.length || 1)) *
										100
								)}%
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Controls -->
	<div class="mb-6 sm:flex sm:items-center sm:justify-between">
		<div class="flex flex-wrap items-center gap-4">
			<!-- Search -->
			<div class="relative w-64">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search class="h-5 w-5 text-gray-400" />
				</div>
				<input
					type="text"
					bind:value={searchTerm}
					class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
					placeholder="Search projects..."
				/>
			</div>

			<!-- Status filter -->
			<select
				bind:value={selectedStatus}
				class="block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
			>
				<option value="all">All Status</option>
				{#each Object.entries(statusConfig) as [status, config]}
					<option value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
				{/each}
			</select>

			<!-- Sort options -->
			<select
				bind:value={sortBy}
				class="block w-40 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
			>
				<option value="newest">Newest First</option>
				<option value="oldest">Oldest First</option>
				<option value="funding-high">Highest Funding</option>
				<option value="funding-low">Lowest Funding</option>
			</select>
		</div>

		<!-- View toggle and Create button -->
		<div class="flex items-center gap-4 mt-4 sm:mt-0">
			<div class="flex items-center space-x-2 border rounded-lg p-1">
				<button
					class={`p-2 rounded ${selectedView === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
					on:click={() => (selectedView = 'grid')}
				>
					<div class="grid grid-cols-2 gap-1">
						<Circle class="h-3 w-3" />
						<Circle class="h-3 w-3" />
						<Circle class="h-3 w-3" />
						<Circle class="h-3 w-3" />
					</div>
				</button>
				<button
					class={`p-2 rounded ${selectedView === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
					on:click={() => (selectedView = 'list')}
				>
					<div class="space-y-1">
						<div class="w-6 h-1 bg-current rounded" />
						<div class="w-6 h-1 bg-current rounded" />
						<div class="w-6 h-1 bg-current rounded" />
					</div>
				</button>
			</div>

			<a
				href="/dashboard/startup/projects/new"
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<Plus class="h-5 w-5 mr-2" />
				New Project
			</a>
		</div>
	</div>

	<!-- Projects List/Grid -->
	{#if selectedView === 'grid'}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" in:fade>
			<!-- Your existing grid view code -->
			{#each filteredProjects as project (project.id)}
				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
					in:fade={{ duration: 200 }}
				>
					<div class="p-6">
						<!-- Header -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center space-x-2">
								{#if project.status && statusConfig[project.status]}
									<span
										class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}
									>
										<svelte:component
											this={statusConfig[project.status].icon}
											class="w-4 h-4 mr-1"
										/>
										{project.status}
									</span>
									<span class="text-xs text-gray-500"
										>{statusConfig[project.status].description}</span
									>
								{/if}
							</div>
							<div class="flex items-center space-x-2">
								<span class="text-sm text-gray-500">
									Created {new Date(project.created).toLocaleDateString()}
								</span>
							</div>
						</div>

						<!-- Title and Description -->
						<div class="mb-4">
							<h3 class="text-lg font-medium text-gray-900">
								<a
									href="/dashboard/startup/projects/{project.id}"
									class="hover:text-indigo-600 transition-colors duration-150"
								>
									{project.title}
								</a>
							</h3>
							<p class="mt-1 text-sm text-gray-500 line-clamp-2">
								{project.description}
							</p>
						</div>

						<!-- Funding Progress -->
						<div class="mb-4">
							<div class="flex items-center justify-between text-sm mb-1">
								<span class="text-gray-600">Funding Progress</span>
								<div class="flex items-center space-x-1">
									<span class="font-medium text-indigo-600">
										{calculateProgress(project.current_funding, project.funding_goal)}%
									</span>
									{#if project.status === 'active'}
										<TrendingUp class="h-4 w-4 text-green-500" />
									{/if}
								</div>
							</div>
							<div class="relative">
								<div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
									<div
										style="width: {calculateProgress(
											project.current_funding,
											project.funding_goal
										)}%"
										class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
									/>
								</div>
							</div>
							<div class="mt-2 grid grid-cols-2 gap-4 text-sm">
								<div>
									<span class="text-gray-500">Raised</span>
									<p class="font-medium text-gray-900">{formatCurrency(project.current_funding)}</p>
								</div>
								<div class="text-right">
									<span class="text-gray-500">Goal</span>
									<p class="font-medium text-gray-900">{formatCurrency(project.funding_goal)}</p>
								</div>
							</div>
						</div>

						<!-- Statistics -->
						<div class="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-b border-gray-100">
							<div>
								<span class="text-xs text-gray-500 block">Min. Investment</span>
								<span class="text-sm font-medium text-gray-900">
									{formatCurrency(project.minInvestment)}
								</span>
							</div>
							<div>
								<span class="text-xs text-gray-500 block">Investors</span>
								<span class="text-sm font-medium text-gray-900">
									{project.expand?.investments?.length || 0}
								</span>
							</div>
							<div>
								<span class="text-xs text-gray-500 block">Avg. Investment</span>
								<span class="text-sm font-medium text-gray-900">
									{formatCurrency(
										project.expand?.investments?.length
											? project.current_funding / project.expand.investments.length
											: 0
									)}
								</span>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-4 text-sm text-gray-500">
								<span class="flex items-center">
									<Users class="h-4 w-4 mr-1" />
									{project.expand?.investments?.length || 0} investors
								</span>
								{#if project.status === 'active'}
									<span class="flex items-center text-green-600">
										<Circle class="h-2 w-2 mr-1 fill-current" />
										Active
									</span>
								{/if}
							</div>
							<div class="flex items-center space-x-2">
								<a
									href="/dashboard/startup/projects/{project.id}/edit"
									class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Edit
								</a>

								<a
									href="/dashboard/startup/projects/{project.id}"
									class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									View Details
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="bg-white shadow overflow-hidden sm:rounded-md" in:fade>
			<ul role="list" class="divide-y divide-gray-200">
				{#each filteredProjects as project (project.id)}
					<li>
						<a href="/dashboard/startup/projects/{project.id}" class="block hover:bg-gray-50">
							<div class="px-4 py-4 sm:px-6">
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<p class="text-sm font-medium text-indigo-600 truncate">
											{project.title}
										</p>
										{#if project.status && statusConfig[project.status]}
											<span
												class={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}
											>
												<svelte:component
													this={statusConfig[project.status].icon}
													class="w-4 h-4 mr-1"
												/>
												{project.status}
											</span>
										{/if}
									</div>
									<div class="ml-2 flex-shrink-0 flex">
										<p class="text-sm text-gray-500">
											{formatCurrency(project.current_funding)} of {formatCurrency(
												project.funding_goal
											)}
										</p>
									</div>
								</div>
								<div class="mt-2 sm:flex sm:justify-between">
									<div class="sm:flex">
										<p class="flex items-center text-sm text-gray-500">
											<Users class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
											{project.expand?.investments?.length || 0} investors
										</p>
									</div>
									<div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
										<Clock class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
										<p>
											Created on {new Date(project.created).toLocaleDateString()}
										</p>
									</div>
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Empty State -->
	{#if filteredProjects.length === 0}
		<div class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
			<Rocket class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
			<p class="mt-1 text-sm text-gray-500">
				{searchTerm || selectedStatus !== 'all'
					? 'Try adjusting your filters or search terms'
					: 'Get started by creating your first project'}
			</p>
			{#if !searchTerm && selectedStatus === 'all'}
				<div class="mt-6">
					<a
						href="/dashboard/startup/projects/new"
						class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<Plus class="h-5 w-5 mr-2" />
						Create New Project
					</a>
				</div>
			{/if}
		</div>
	{/if}
{/if}
