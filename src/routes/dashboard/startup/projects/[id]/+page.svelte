<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';
    import { 
        ArrowLeft,
        BadgeDollarSign,
        Users,
        Calendar,
        Edit,
        Share2,
        BarChart,
        FileText,
        AlertCircle,
        CheckCircle,
        Rocket,
        XCircle,
        Clock
    } from 'lucide-svelte';
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';

    export let data: PageData;
    
    $: ({ project, updates } = data);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get status configuration
    const getStatusConfig = (status: string) => {
        const configs = {
            draft: { color: 'gray', icon: Clock, text: 'Draft' },
            active: { color: 'green', icon: Rocket, text: 'Active' },
            funded: { color: 'blue', icon: CheckCircle, text: 'Funded' },
            closed: { color: 'red', icon: XCircle, text: 'Closed' }
        };
        return configs[status] || configs.draft;
    };

    $: statusConfig = getStatusConfig(project.status);
    $: fundingProgress = (project.current_funding / project.funding_goal) * 100;
    $: daysLeft = Math.max(0, Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
</script>

<div class="min-h-full">
    <!-- Back button and breadcrumb -->
    <div class="border-b border-gray-200 bg-white">
        <div class="px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center space-x-2 text-sm">
                <button 
                    class="text-gray-500 hover:text-gray-700 flex items-center"
                    on:click={() => goto('/dashboard/startup/projects')}
                >
                    <ArrowLeft class="h-4 w-4 mr-1" />
                    Back to Projects
                </button>
                <span class="text-gray-400">/</span>
                <span class="text-gray-900 font-medium">{project.title}</span>
            </div>
        </div>
    </div>

    <main class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Project Header -->
            <div class="md:flex md:items-center md:justify-between">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl">
                            {project.title}
                        </h1>
                        <span 
                            class={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                        >
                            <svelte:component this={statusConfig.icon} class="w-4 h-4 mr-1" />
                            {statusConfig.text}
                        </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">
                        Created on {formatDate(project.created)}
                    </p>
                </div>
                <div class="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0 space-x-3">
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Share2 class="h-4 w-4 mr-2" />
                        Share
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Edit class="h-4 w-4 mr-2" />
                        Edit Project
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <!-- Funding Progress -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <BadgeDollarSign class="h-6 w-6 text-gray-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Funding Progress
                                    </dt>
                                    <dd class="flex items-baseline">
                                        <div class="text-2xl font-semibold text-gray-900">
                                            {formatCurrency(project.current_funding)}
                                        </div>
                                        <div class="ml-2">
                                            <span class="text-sm text-gray-500">
                                                of {formatCurrency(project.funding_goal)}
                                            </span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3">
                        <div class="text-sm">
                            <div class="relative pt-1">
                                <div class="flex mb-2 items-center justify-between">
                                    <div>
                                        <span class="text-xs font-semibold inline-block text-indigo-600">
                                            {Math.round(fundingProgress)}% Funded
                                        </span>
                                    </div>
                                </div>
                                <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                                    <div
                                        style="width: {fundingProgress}%"
                                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Investors Count -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <Users class="h-6 w-6 text-gray-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Total Investors
                                    </dt>
                                    <dd class="text-2xl font-semibold text-gray-900">
                                        {project.expand?.investments?.length || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3">
                        <div class="text-sm">
                            <a href="#investors" class="font-medium text-indigo-700 hover:text-indigo-900">
                                View all investors
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Time Remaining -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <Calendar class="h-6 w-6 text-gray-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Time Remaining
                                    </dt>
                                    <dd class="text-2xl font-semibold text-gray-900">
                                        {daysLeft} days
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3">
                        <div class="text-sm text-gray-500">
                            Ends on {formatDate(project.end_date)}
                        </div>
                    </div>
                </div>

                <!-- Minimum Investment -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <BadgeDollarSign class="h-6 w-6 text-gray-400" />
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">
                                        Minimum Investment
                                    </dt>
                                    <dd class="text-2xl font-semibold text-gray-900">
                                        {formatCurrency(project.minInvestment)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3">
                        <div class="text-sm text-gray-500">
                            Per investor
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Project Description -->
                    <section aria-labelledby="project-description" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="project-description" class="text-lg font-medium text-gray-900">
                                Project Description
                            </h2>
                            <div class="mt-4 text-sm text-gray-500">
                                {project.description}
                            </div>
                        </div>
                    </section>

                    <!-- Project Timeline -->
                    <section aria-labelledby="project-timeline" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="project-timeline" class="text-lg font-medium text-gray-900">
                                Project Timeline
                            </h2>
                            {#if project.project_timeline?.length}
                                <div class="mt-4 flow-root">
                                    <ul role="list" class="-mb-8">
                                        {#each project.project_timeline as event, index}
                                            <li>
                                                <div class="relative pb-8">
                                                    {#if index !== project.project_timeline.length - 1}
                                                        <span
                                                            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                            aria-hidden="true"
                                                        ></span>
                                                    {/if}
                                                    <div class="relative flex space-x-3">
                                                        <div>
                                                            <span class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                                                                <Calendar class="h-5 w-5 text-indigo-600" />
                                                            </span>
                                                        </div>
                                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                            <div>
                                                                <p class="text-sm font-medium text-gray-900">
                                                                    {event.title}
                                                                </p>
                                                                {#if event.description}
                                                                    <p class="mt-1 text-sm text-gray-500">
                                                                        {event.description}
                                                                    </p>
                                                                {/if}
                                                            </div>
                                                            <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                                                <time datetime={event.date}>
                                                                    {formatDate(event.date)}
                                                                </time>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {:else}
                                <p class="mt-4 text-sm text-gray-500">
                                    No timeline events added yet.
                                </p>
                            {/if}
                        </div>
                    </section>
                    <!-- Project Updates -->
                    <section aria-labelledby="project-updates" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h2 id="project-updates" class="text-lg font-medium text-gray-900">
                                    Project Updates
                                </h2>
                                <button
                                    type="button"
                                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                    <FileText class="h-4 w-4 mr-2" />
                                    Post Update
                                </button>
                            </div>

                            {#if updates.length}
                                <div class="flow-root">
                                    <ul role="list" class="-mb-8">
                                        {#each updates as update}
                                            <li class="py-4">
                                                <div class="flex space-x-3">
                                                    <div class="flex-1 space-y-1">
                                                        <div class="flex items-center justify-between">
                                                            <h3 class="text-sm font-medium">{update.title}</h3>
                                                            <p class="text-sm text-gray-500">{formatDate(update.created)}</p>
                                                        </div>
                                                        <p class="text-sm text-gray-500">{update.content}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {:else}
                                <p class="text-sm text-gray-500">
                                    No updates posted yet.
                                </p>
                            {/if}
                        </div>
                    </section>

                    <!-- Team Members -->
                    <section aria-labelledby="team-members" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="team-members" class="text-lg font-medium text-gray-900">
                                Team Members
                            </h2>
                            {#if project.team_members?.length}
                                <ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {#each project.team_members as member}
                                        <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                                            <div class="w-full flex items-center justify-between p-6 space-x-6">
                                                <div class="flex-1 truncate">
                                                    <div class="flex items-center space-x-3">
                                                        <h3 class="text-sm font-medium text-gray-900 truncate">
                                                            {member.name}
                                                        </h3>
                                                    </div>
                                                    <p class="mt-1 text-sm text-gray-500 truncate">
                                                        {member.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    {/each}
                                </ul>
                            {:else}
                                <p class="mt-4 text-sm text-gray-500">
                                    No team members added yet.
                                </p>
                            {/if}
                        </div>
                    </section>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6 lg:col-span-1">
                    <!-- Quick Actions -->
                    <section aria-labelledby="quick-actions" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="quick-actions" class="text-lg font-medium text-gray-900">
                                Quick Actions
                            </h2>
                            <div class="mt-4 space-y-3">
                                <button
                                    type="button"
                                    class="w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <FileText class="h-4 w-4 mr-2" />
                                    Post Update
                                </button>
                                <button
                                    type="button"
                                    class="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Edit class="h-4 w-4 mr-2" />
                                    Edit Project
                                </button>
                                <button
                                    type="button"
                                    class="w-full inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <BarChart class="h-4 w-4 mr-2" />
                                    View Analytics
                                </button>
                            </div>
                        </div>
                    </section>

                    <!-- Project Status -->
                    <section aria-labelledby="project-status" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="project-status" class="text-lg font-medium text-gray-900">
                                Project Status
                            </h2>
                            <div class="mt-4">
                                <div class="flex items-center justify-between">
                                    <div class="text-sm text-gray-500">Status</div>
                                    <span 
                                        class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                                    >
                                        <svelte:component this={statusConfig.icon} class="w-4 h-4 mr-1" />
                                        {project.status}
                                    </span>
                                </div>
                                <div class="mt-4 flex items-center justify-between">
                                    <div class="text-sm text-gray-500">Approval Status</div>
                                    <span 
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        class:bg-yellow-100={project.approval_status === 'pending'}
                                        class:text-yellow-800={project.approval_status === 'pending'}
                                        class:bg-green-100={project.approval_status === 'approved'}
                                        class:text-green-800={project.approval_status === 'approved'}
                                        class:bg-red-100={project.approval_status === 'rejected'}
                                        class:text-red-800={project.approval_status === 'rejected'}
                                    >
                                        {project.approval_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Recent Investors -->
                    <section aria-labelledby="recent-investors" class="bg-white shadow rounded-lg">
                        <div class="p-6">
                            <h2 id="recent-investors" class="text-lg font-medium text-gray-900">
                                Recent Investors
                            </h2>
                            {#if project.expand?.investments?.length}
                                <ul role="list" class="mt-4 divide-y divide-gray-200">
                                    {#each project.expand.investments.slice(0, 5) as investment}
                                        <li class="py-4">
                                            <div class="flex items-center space-x-4">
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate">
                                                        {investment.expand?.investor?.name || 'Anonymous'}
                                                    </p>
                                                    <p class="text-sm text-gray-500">
                                                        {formatCurrency(investment.amount)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p class="text-sm text-gray-500">
                                                        {formatDate(investment.created)}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    {/each}
                                </ul>
                                {#if project.expand.investments.length > 5}
                                    <div class="mt-4">
                                        <a href="#investors" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                            View all investors
                                        </a>
                                    </div>
                                {/if}
                            {:else}
                                <p class="mt-4 text-sm text-gray-500">
                                    No investors yet.
                                </p>
                            {/if}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </main>
</div>