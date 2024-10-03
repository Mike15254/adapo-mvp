<script lang="ts">
    import { onMount } from 'svelte';
    
    let totalInvested = 0;
    let projectsInvested = 0;
    let currentBalance = 0;
    let notifications = 5;
    let isMobileMenuOpen = false;
    let isProfileMenuOpen = false;
  
    onMount(() => {
      // Simulate data fetching
      totalInvested = 500000;
      projectsInvested = 7;
      currentBalance = 750000;
    });

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
            <a href="/" class="mr-4">
                <div class="font-bold text-primary text-xl">Adapo<span class="text-secondary">Investor</span></div>
            </a>
        </div>
        <div class="flex items-center space-x-4">
            <div class="relative">
                <button on:click={toggleProfileMenu} class="bg-center bg-cover bg-no-repeat rounded-full inline-block h-10 w-10 cursor-pointer" style="background-image: url(https://i.pravatar.cc/300)"></button>
                {#if isProfileMenuOpen}
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <a href="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                        <a href="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                        <a href="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Log out</a>
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
            <a href="/" class="inline-block text-gray-600 hover:text-primary my-4 w-full">
                <span class="material-icons-outlined float-left pr-2">dashboard</span>
                Dashboard
            </a>
            <a href="/" class="inline-block text-gray-600 hover:text-primary my-4 w-full">
                <span class="material-icons-outlined float-left pr-2">account_balance_wallet</span>
                My Investments
            </a>
            <a href="/" class="inline-block text-gray-600 hover:text-primary my-4 w-full">
                <span class="material-icons-outlined float-left pr-2">trending_up</span>
                Opportunities
            </a>
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
                    <a href="/" class="block text-gray-600 hover:text-primary my-4">
                        <span class="material-icons-outlined align-middle mr-2">dashboard</span>
                        Dashboard
                    </a>
                    <a href="/" class="block text-gray-600 hover:text-primary my-4">
                        <span class="material-icons-outlined align-middle mr-2">account_balance_wallet</span>
                        My Investments
                    </a>
                    <a href="/" class="block text-gray-600 hover:text-primary my-4">
                        <span class="material-icons-outlined align-middle mr-2">trending_up</span>
                        Opportunities
                    </a>
                </div>
            </div>
        </div>
    {/if}

    <!-- Main content -->
    <div class="flex-1 p-4 max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="bg-primary bg-opacity-10 border border-primary rounded-xl p-6">
                <p class="text-2xl md:text-4xl text-primary">Welcome back,<br><strong>Investor</strong></p>
                <p class="text-xl md:text-2xl text-secondary mt-4">Your portfolio is growing!</p>
            </div>
            <div class="bg-secondary bg-opacity-10 border border-secondary rounded-xl p-6">
                <p class="text-xl md:text-3xl text-primary">New Opportunities<br><strong>12</strong></p>
                <a href="/" class="bg-secondary text-white underline hover:no-underline inline-block rounded-full mt-4 px-6 py-2"><strong>Explore Now</strong></a>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
</div>