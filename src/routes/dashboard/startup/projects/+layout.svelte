<script lang="ts">
    import { 
        ChevronRight, 
        Home, 
        Folder,
        Plus,
        LayoutDashboard
    } from "lucide-svelte";
    import { page } from '$app/stores';

    // Navigation items for projects section
    const projectNavItems = [
        { 
            href: '/dashboard/startup/projects', 
            label: 'All Projects',
            icon: Folder
        },
        { 
            href: '/dashboard/startup/projects/active', 
            label: 'Active Projects',
            icon: LayoutDashboard
        }
    ];

    // Get current page path for active state
    $: currentPath = $page.url.pathname;

    // Generate breadcrumb based on current path
    $: breadcrumbs = currentPath.split('/').filter(Boolean);
</script>

<div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="py-4">
                <!-- Breadcrumb -->
                <nav class="flex" aria-label="Breadcrumb">
                    <ol role="list" class="flex items-center space-x-4">
                        <li>
                            <div>
                                <a href="/dashboard/startup" class="text-gray-400 hover:text-gray-500">
                                    <Home class="h-5 w-5 flex-shrink-0" />
                                    <span class="sr-only">Home</span>
                                </a>
                            </div>
                        </li>
                        {#each breadcrumbs as crumb, i}
                            <li>
                                <div class="flex items-center">
                                    <ChevronRight class="h-5 w-5 flex-shrink-0 text-gray-400" />
                                    
                                     <a   href={`/${breadcrumbs.slice(0, i + 1).join('/')}`}
                                        class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 capitalize"
                                    >
                                        {crumb}
                                    </a>
                                </div>
                            </li>
                        {/each}
                    </ol>
                </nav>

                <!-- Header content -->
                <div class="mt-2 md:flex md:items-center md:justify-between">
                    <div class="min-w-0 flex-1">
                        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Projects Overview
                        </h2>
                    </div>
                    <div class="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
                        
                         <a   href="/dashboard/startup/projects/new"
                            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <Plus class="h-5 w-5 mr-2" />
                            New Project
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Project Navigation -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mt-4 flex space-x-4 border-b border-gray-200">
            {#each projectNavItems as item}
                
                 <a   href={item.href}
                    class={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 
                        ${currentPath === item.href 
                            ? 'border-indigo-500 text-indigo-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                    <svelte:component this={item.icon} class="h-5 w-5 mr-2" />
                    {item.label}
                </a>
            {/each}
        </div>
    </div>

    <!-- Main Content -->
    <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <slot />
        </div>
    </main>
</div>