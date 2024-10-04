<script lang="ts">
    import { onMount } from 'svelte';
    import { getCurrentUser, logoutUser } from '$lib/userService';
    import { goto } from '$app/navigation';

    let user: any = null;
    let totalInvested = 0;
    let projectsInvested = 0;
    let currentBalance = 0;
    let notifications = 5;
    let isMobileMenuOpen = false;
    let isProfileMenuOpen = false;

    let projects = [
        { id: 1, name: 'Eco-Friendly Water Bottle', fundingGoal: 50000, currentFunding: 30000, description: 'Innovative water bottle made from biodegradable materials.' },
        { id: 2, name: 'Smart Home Energy Saver', fundingGoal: 100000, currentFunding: 75000, description: 'AI-powered device to optimize home energy consumption.' },
        { id: 3, name: 'Online Learning Platform', fundingGoal: 200000, currentFunding: 120000, description: 'Revolutionary e-learning platform with personalized curricula.' },
    ];

    onMount(() => {
        user = getCurrentUser();
        if (!user) {
            goto('/auth/login');
        }
        // Simulate data fetching
        totalInvested = 500000;
        projectsInvested = 7;
        currentBalance = 750000;
    });

    function handleLogout() {
        logoutUser();
        goto('/auth/login');
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    function toggleProfileMenu() {
        isProfileMenuOpen = !isProfileMenuOpen;
    }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet" />
</svelte:head>

<header class="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div class="flex items-center">
            <div  class="mr-4">
                <div class="font-bold text-primary text-xl">Adapo<span class="text-secondary">{user?.userType === 'investor' ? 'Investor' : 'Entrepreneur'}</span></div>
            </div>
        </div>
        <div class="flex items-center space-x-4">
            <div class="relative">
                <button on:click={toggleProfileMenu} class="bg-center bg-cover bg-no-repeat rounded-full inline-block h-10 w-10 cursor-pointer" style="background-image: url(https://i.pravatar.cc/300)"></button>
                {#if isProfileMenuOpen}
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</button>
                        <a href="/" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Home</a>

                    </div>
                {/if}
            </div>
            <button on:click={toggleMobileMenu} class="md:hidden">
                <span class="material-icons-outlined">menu</span>
            </button>
        </div>
    </nav>
</header>

<div class="mx-auto flex max-w-7xl flex-col md:flex-row">
    <!-- Sidebar for desktop -->
    <div class="hidden md:block w-64 p-4">
        <div class="bg-white rounded-xl shadow-lg mb-6 px-6 py-4">
            <div  class="inline-block text-gray-600 hover:text-primary my-4 w-full">
                <span class="material-icons-outlined float-left pr-2">dashboard</span>
                Dashboard
            </div>
            
        </div>
    </div>

    <!-- Mobile menu -->
    {#if isMobileMenuOpen}
        <button class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" on:click={toggleMobileMenu}></button>
        <div class="fixed right-0 top-0 w-64 h-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out">
            <div class="p-4">
                <button on:click={toggleMobileMenu} class="absolute top-4 right-4">
                    <span class="material-icons-outlined">close</span>
                </button>
                <div class="mt-8">
                    <div class="block text-gray-600 hover:text-primary my-4">
                        <span class="material-icons-outlined align-middle mr-2">dashboard</span>
                        Dashboard
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <div class="flex-1 p-4 max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-primary bg-opacity-10 border border-primary rounded-xl p-6">
                <p class="text-2xl md:text-4xl text-primary">Welcome back,<br><strong>{user?.name}</strong></p>
                <p class="text-xl md:text-2xl text-secondary mt-4">
                    {user?.userType === 'investor' ? 'Your portfolio is growing!' : 'Your projects are progressing!'}
                </p>
            </div>
            <div class="bg-secondary bg-opacity-10 border border-secondary rounded-xl p-6">
                <p class="text-xl md:text-3xl text-primary">
                    {user?.userType === 'investor' ? 'New Opportunities' : 'Funding Opportunities'}
                    <br><strong>12</strong>
                </p>
                <a href="/invest" class="bg-secondary text-white underline hover:no-underline inline-block rounded-full mt-4 px-6 py-2">
                    <strong>{user?.userType === 'investor' ? 'Explore Now' : 'Apply Now'}</strong>
                </a>
            </div>
        </div>
        
        {#if user?.userType === 'investor'}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Total Invested</h3>
                    <p class="text-2xl text-secondary">KSh {totalInvested.toLocaleString()}</p>
                    <p class="text-gray-600 mt-2">Across {projectsInvested} projects</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Current Balance</h3>
                    <p class="text-2xl text-secondary">KSh {currentBalance.toLocaleString()}</p>
                    <p class="text-gray-600 mt-2">+{((currentBalance - totalInvested) / totalInvested * 100).toFixed(2)}% growth</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Next Payout</h3>
                    <p class="text-2xl text-secondary">In 7 days</p>
                    <p class="text-gray-600 mt-2">Estimated: KSh 25,000</p>
                </div>
            </div>

            <h2 class="text-2xl font-semibold mb-4">Available Projects for Investment</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each projects as project}
                    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">{project.name}</h3>
                            <p class="mt-1 max-w-2xl text-sm text-gray-500">{project.description}</p>
                            <div class="mt-4">
                                <p class="text-sm text-gray-500">Funding Goal: KSh {project.fundingGoal.toLocaleString()}</p>
                                <p class="text-sm text-gray-500">Current Funding: KSh {project.currentFunding.toLocaleString()}</p>
                                <div class="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-blue-600 h-2.5 rounded-full" style="width: {(project.currentFunding / project.fundingGoal) * 100}%"></div>
                                </div>
                            </div>
                            <button class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Invest
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {:else if user?.userType === 'entrepreneur'}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Total Funding Raised</h3>
                    <p class="text-2xl text-secondary">KSh {totalInvested.toLocaleString()}</p>
                    <p class="text-gray-600 mt-2">For your project</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Funding Goal</h3>
                    <p class="text-2xl text-secondary">KSh 1,000,000</p>
                    <p class="text-gray-600 mt-2">{(totalInvested / 1000000 * 100).toFixed(2)}% achieved</p>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-primary mb-4">Investors</h3>
                    <p class="text-2xl text-secondary">{projectsInvested}</p>
                    <p class="text-gray-600 mt-2">Supporting your project</p>
                </div>
            </div>

            <h2 class="text-2xl font-semibold mb-4">Your Project</h2>
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Innovative Startup Idea</h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">Your groundbreaking startup that's going to change the world!</p>
                    <div class="mt-4">
                        <p class="text-sm text-gray-500">Funding Goal: KSh 1,000,000</p>
                        <p class="text-sm text-gray-500">Current Funding: KSh {totalInvested.toLocaleString()}</p>
                        <div class="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-green-600 h-2.5 rounded-full" style="width: {(totalInvested / 1000000) * 100}%"></div>
                        </div>
                    </div>
                    <button class="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Update Project
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>