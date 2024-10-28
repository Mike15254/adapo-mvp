<script lang="ts">
    import type { PageData } from './$types';
    import { 
        Rocket, Users, BadgeDollarSign,
        ArrowUpRight, Plus, Calendar,
        CheckCircle, Clock
    } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    
    export let data: PageData;
    
    $: ({ stats, startup, projects } = data);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Calculate progress
    const calculateProgress = (current: number, goal: number): number => {
        if (!current || !goal) return 0;
        return Math.min(Math.round((current / goal) * 100), 100);
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            active: 'text-green-600 bg-green-50',
            pending: 'text-yellow-600 bg-yellow-50',
            draft: 'text-gray-600 bg-gray-50',
            funded: 'text-purple-600 bg-purple-50',
            closed: 'text-red-600 bg-red-50'
        };
        
        return colors[status] || colors.draft;
    };

    // Get greeting
    $: greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    })();
</script>

<div class="space-y-6">
    <!-- Page header -->
    <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                {greeting}, {startup?.company_name || 'Welcome Back'}
            </h2>
            <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div class="mt-2 flex items-center text-sm text-gray-500">
                    <Clock class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    Last updated {formatDate(new Date().toISOString())}
                </div>
            </div>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
                type="button"
                class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                <Plus class="-ml-0.5 mr-1.5 h-5 w-5" />
                New Project
            </button>
        </div>
    </div>

    <!-- Stats Overview -->
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" in:fade>
    <!-- Funding Card -->
    <div class="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow">
        <dt>
            <div class="absolute rounded-md bg-indigo-500 p-3">
                <BadgeDollarSign class="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p class="ml-16 truncate text-sm font-medium text-gray-500">Total Funding Raised</p>
        </dt>
        <dd class="ml-16 flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">{formatCurrency(stats?.totalFunding || 0)}</p>
            {#if stats?.monthlyGrowth > 0}
                <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpRight class="h-4 w-4 flex-shrink-0 self-center" />
                    <span class="sr-only">Increased by</span>
                    {stats.monthlyGrowth}%
                </p>
            {/if}
        </dd>
    </div>

    <!-- Active Projects Card -->
    <div class="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow">
        <dt>
            <div class="absolute rounded-md bg-indigo-500 p-3">
                <Rocket class="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p class="ml-16 truncate text-sm font-medium text-gray-500">Active Projects</p>
        </dt>
        <dd class="ml-16 flex items-baseline justify-between">
            <p class="text-2xl font-semibold text-gray-900">{stats?.activeProjects || 0}</p>
            <a href="/dashboard/startup/projects" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all
            </a>
        </dd>
    </div>

    <!-- Investors Card -->
    <div class="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow">
        <dt>
            <div class="absolute rounded-md bg-indigo-500 p-3">
                <Users class="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p class="ml-16 truncate text-sm font-medium text-gray-500">Total Investors</p>
        </dt>
        <dd class="ml-16 flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">{stats?.totalInvestors || 0}</p>
            {#if stats?.investorGrowth > 0}
                <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <ArrowUpRight class="h-4 w-4 flex-shrink-0 self-center" />
                    <span class="sr-only">Increased by</span>
                    {stats.investorGrowth}%
                </p>
            {/if}
        </dd>
    </div>
</div>

<!-- Main Content Grid -->
<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Active Projects Section -->
    <section aria-labelledby="projects-heading" class="mt-8">
        <div class="flex items-center justify-between">
            <h2 id="projects-heading" class="text-lg font-medium text-gray-900">Active Projects</h2>
            {#if projects?.length > 0}
                <a href="/dashboard/startup/projects" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all projects <span aria-hidden="true">&rarr;</span>
                </a>
            {/if}
        </div>
    
        <div class="mt-4">
            {#if projects?.length > 0}
                <div class="space-y-6">
                    {#each projects as project}
                        <div 
                            class="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                            transition:fade
                        >
                            <div class="p-6">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-lg font-medium text-gray-900">
                                        <a href="/dashboard/startup/projects/{project.id}" class="hover:text-indigo-600">
                                            {project.title}
                                        </a>
                                    </h3>
                                    <span class={"inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium " + getStatusColor(project.status)}>
                                        {project.status}
                                    </span>
                                </div>
                                
                                <p class="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>
    
                                <div class="mt-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-sm font-medium text-gray-700">
                                            {formatCurrency(project.current_funding)} raised of {formatCurrency(project.funding_goal)}
                                        </span>
                                        <span class="text-sm font-medium text-indigo-600">
                                            {calculateProgress(project.current_funding, project.funding_goal)}%
                                        </span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            class="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                                            style="width: {calculateProgress(project.current_funding, project.funding_goal)}%"
                                        />
                                    </div>
                                </div>
    
                                <div class="mt-4 flex items-center justify-between text-sm">
                                    <div class="flex space-x-4 text-gray-500">
                                        <span class="inline-flex items-center">
                                            <Clock class="h-4 w-4 mr-1" />
                                            {getDaysRemaining(project.end_date)}
                                        </span>
                                        <span class="inline-flex items-center">
                                            <Users class="h-4 w-4 mr-1" />
                                            {formatNumber(project.investor_count || 0)} investors
                                        </span>
                                    </div>
                                    <a 
                                        href="/dashboard/startup/projects/{project.id}"
                                        class="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        View details
                                    </a>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-12 text-center sm:px-6">
                        <Rocket class="mx-auto h-12 w-12 text-gray-400" />
                        <h3 class="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
                        <p class="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
                        <div class="mt-6">
                            <a
                                href="/dashboard/startup/projects/new"
                                class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <Plus class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                New Project
                            </a>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </section>

    <!-- Recent Activity Section -->
    <section aria-labelledby="activity-heading" class="rounded-lg bg-white shadow">
        <div class="p-6">
            <h2 id="activity-heading" class="text-base font-semibold leading-6 text-gray-900">
                Recent Activity
            </h2>
            
            {#if stats?.recentActivity?.length}
                <div class="mt-6 flow-root">
                    <ul role="list" class="-mb-8">
                        {#each stats.recentActivity as activity, i}
                            <li>
                                <div class="relative pb-8">
                                    {#if i !== stats.recentActivity.length - 1}
                                        <span class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    {/if}
                                    <div class="relative flex space-x-3">
                                        <!-- Activity Icon -->
                                        <div>
                                            <span class="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                                                {#if activity.type === 'investment'}
                                                    <BadgeDollarSign class="h-5 w-5 text-indigo-600" />
                                                {:else if activity.type === 'milestone'}
                                                    <CheckCircle class="h-5 w-5 text-green-600" />
                                                {:else}
                                                    <Calendar class="h-5 w-5 text-indigo-600" />
                                                {/if}
                                            </span>
                                        </div>
                                        
                                        <!-- Activity Content -->
                                        <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p class="text-sm text-gray-500">{activity.description}</p>
                                            </div>
                                            <div class="whitespace-nowrap text-right text-sm text-gray-500">
                                                <time datetime={activity.date}>{formatDate(activity.date)}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            {:else}
                <div class="mt-6 text-center py-12">
                    <Calendar class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-semibold text-gray-900">No recent activity</h3>
                    <p class="mt-1 text-sm text-gray-500">
                        New activities will appear here as you use the platform
                    </p>
                </div>
            {/if}
        </div>
    </section>
</div>
</div>