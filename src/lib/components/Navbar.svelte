<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { page } from '$app/stores';
    import logo from "../assets/adapo-logo.png";
    import { getCurrentUser, logoutUser } from '$lib/userService';
    import { goto } from '$app/navigation';
    
    interface NavItem {
        label: string;
        href: string;
    }
  
    const navItems: NavItem[] = [
        { label: 'Invest', href: '/invest'},
        { label: 'Raise', href: '/raise', }
    ];
  
    let isMobileMenuOpen: boolean = false;
    let isLoggedIn: boolean = false;
    let isProfileMenuOpen: boolean = false;
    
    function toggleMobileMenu(): void {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
  
    function closeMobileMenu(): void {
        isMobileMenuOpen = false;
    }
  
    function toggleProfileMenu(): void {
        isProfileMenuOpen = !isProfileMenuOpen;
    }
  
    async function handleLogout(): Promise<void> {
        logoutUser();
        isLoggedIn = false;
        await goto('/');
    }
  
    onMount(() => {
        const user = getCurrentUser();
        isLoggedIn = !!user;
  
        const handleResize = (): void => {
            if (window.innerWidth >= 768) {
                isMobileMenuOpen = false;
            }
        };
  
        window.addEventListener('resize', handleResize);
  
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
  </script>
  
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-2 py-4">
        <div class="flex items-center">
            <a href="/" class="mr-4">
                <img src={logo} loading="lazy" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
            </a>
            <ul class="hidden md:flex items-center space-x-6">
                {#each navItems as item}
                    <li class="font-dm text-base font-medium text-slate-700">
                        <a href={item.href} class="flex items-center hover:text-primary transition-colors duration-200" class:text-primary={$page.url.pathname === item.href}>
                            {item.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="flex items-center space-x-4">
            {#if isLoggedIn}
                <div class="relative">
                    <button on:click={toggleProfileMenu} class="flex items-center space-x-2 text-slate-700 hover:text-primary transition-colors duration-200">
                        <span class="font-dm text-base font-medium">Account</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                    {#if isProfileMenuOpen}
                        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                            <a href="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                            <button on:click={handleLogout} class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                    {/if}
                </div>
            {:else}
                <a href="/auth/login" class="font-dm text-base font-medium text-slate-700 hover:text-primary transition-colors duration-200">Login</a>
                <a href="/auth/signup" class="hidden md:inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200">
                    Sign up
                </a>
            {/if}
            <button type="button" class="md:hidden" on:click={toggleMobileMenu} aria-label="Toggle mobile menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 text-slate-900">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                </svg>
            </button>
        </div>
    </nav>
  </header>
  
  {#if isMobileMenuOpen}
    <button class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" on:click={closeMobileMenu}></button>
    <div
        transition:fly={{ x: 300, duration: 300 }}
        class="fixed right-0 top-0 w-64 h-full bg-white z-50 shadow-lg flex flex-col"
    >
        <div class="p-4 flex-grow">
            <button on:click={closeMobileMenu} class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200" aria-label="Close mobile menu">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="mt-16">
                {#each navItems as item}
                    <a href={item.href} on:click={closeMobileMenu} class="flex items-center text-gray-600 hover:text-primary my-4 transition-colors duration-200" class:text-primary={$page.url.pathname === item.href}>
                        {item.label}
                    </a>
                {/each}
                {#if isLoggedIn}
                    <a href="/dashboard" on:click={closeMobileMenu} class="flex items-center text-gray-600 hover:text-primary my-4 transition-colors duration-200">
                        Dashboard
                    </a>
                    <a href="/dashboard" on:click={closeMobileMenu} class="flex items-center text-gray-600 hover:text-primary my-4 transition-colors duration-200">
                        Profile
                    </a>
                    <button on:click={() => { handleLogout(); closeMobileMenu(); }} class="flex items-center text-gray-600 hover:text-primary my-4 transition-colors duration-200">
                        Logout
                    </button>
                {:else}
                    <a href="/auth/signup" on:click={closeMobileMenu} class="flex items-center text-gray-600 hover:text-primary my-4 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Sign Up
                    </a>
                {/if}
            </div>
        </div>
    </div>
  {/if}
  
  <style>
    /* Add any custom styles here */
    :global(body) {
        overflow-x: hidden;
    }
  </style>