<script lang="ts">
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth.store';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import LoadingScreen from './LoadingScreen.svelte';

  // State
  let isProfileMenuOpen = false;
  let isMobileMenuOpen = false;
  let isSubmitting = false;
  let userInitials = '';
  let avatarUrl = '/default-avatar.svg';

  // Navigation items
  const navItems = [
      { href: '/', label: 'Home', requiresAuth: false },
      { href: '/discover', label: 'Discover', requiresAuth: true },
      { href: '/about', label: 'About', requiresAuth: false },
  ];

  $: if ($authStore.user) {
      userInitials = $authStore.user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
      avatarUrl = $authStore.user.profile_picture || '/default-avatar.svg';
  }

  // Functions
  const toggleProfileMenu = () => {
      isProfileMenuOpen = !isProfileMenuOpen;
  };

  const toggleMobileMenu = () => {
      isMobileMenuOpen = !isMobileMenuOpen;
  };

  const handleNavigation = async (href: string, item: { requiresAuth?: boolean }) => {
      if (item.requiresAuth && !$authStore.isAuthenticated) {
          goto(`/login?redirect=${href}`);
          return;
      }
      
      isMobileMenuOpen = false;
      isProfileMenuOpen = false;
      await goto(href);
  };

  const handleLogout = async () => {
      try {
          isSubmitting = true;
          await authStore.logout();
          await goto('/');
      } catch (error) {
          console.error('Logout error:', error);
      } finally {
          isSubmitting = false;
      }
  };

  // Click outside handling
  let profileMenuRef: HTMLDivElement;

  const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef && !profileMenuRef.contains(event.target as Node)) {
          isProfileMenuOpen = false;
      }
  };

  onMount(() => {
      document.addEventListener('click', handleClickOutside);
      return () => {
          document.removeEventListener('click', handleClickOutside);
      };
  });
</script>


<svelte:window on:click={handleClickOutside} />

{#if isSubmitting}
    <LoadingScreen />
{:else}
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 justify-between items-center">
                <!-- Logo -->
                <div class="flex items-center">
                    <a href="/" class="flex-shrink-0">
                        <img 
                            class="h-8 w-auto" 
                            src="/adapo.png" 
                            alt="Adapo" 
                        />
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex md:items-center md:space-x-6">
                    {#each navItems as item}
                        <a
                            href={item.href}
                            class="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors
                                   {$page.url.pathname === item.href ? 'text-indigo-600' : ''}"
                            on:click|preventDefault={() => handleNavigation(item.href, item)}
                        >
                            {item.label}
                        </a>
                    {/each}
                </div>

                <!-- Auth/Profile Section -->
                <div class="flex items-center space-x-4">
                    {#if $authStore.isAuthenticated && $authStore.user}
                        <div class="relative profile-menu">
                            <button
                                class="flex items-center space-x-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                on:click={toggleProfileMenu}
                            >
                                <img
                                    class="h-8 w-8 rounded-full"
                                    src={avatarUrl}
                                    alt={userInitials}
                                />
                                <span class="hidden md:block text-sm font-medium text-gray-700">
                                    {$authStore.user.name}
                                </span>
                            </button>

                            {#if isProfileMenuOpen}
                                <div
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                                    transition:fly={{ y: -10, duration: 200 }}
                                >
                                    <a
                                        href={`/dashboard/${$authStore.user.role}`}
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        on:click|preventDefault={() => handleNavigation(`/dashboard/${$authStore.user.role}`, { requiresAuth: true })}
                                    >
                                        Dashboard
                                    </a>
                                    
                                    <button
                                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        on:click={handleLogout}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            {/if}
                        </div>
                    {:else}
                        <a
                            href="/login"
                            class="text-sm font-medium text-gray-700 hover:text-indigo-600"
                        >
                            Sign in
                        </a>
                        <a
                            href="/onboarding"
                            class="inline-flex items-center justify-center px-4 py-2 border border-transparent
                                   text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Get Started
                        </a>
                    {/if}

                    <!-- Mobile menu button -->
                    <button
                        type="button"
                        class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400
                               hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2
                               focus:ring-inset focus:ring-indigo-500"
                        on:click={toggleMobileMenu}
                    >
                        <span class="sr-only">Open main menu</span>
                        <svg
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>

        <!-- Mobile menu -->
        {#if isMobileMenuOpen}
            <div
                class="md:hidden mobile-menu"
                transition:fly={{ x: 300, duration: 200 }}
            >
                <div class="pt-2 pb-3 space-y-1">
                    {#each navItems as item}
                        <a
                            href={item.href}
                            class="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600
                                   hover:bg-gray-50 {$page.url.pathname === item.href ? 'text-indigo-600 bg-indigo-50' : ''}"
                            on:click|preventDefault={() => handleNavigation(item.href, item)}
                        >
                            {item.label}
                        </a>
                    {/each}
                </div>

                {#if $authStore.isAuthenticated && $authStore.user}
                    <div class="pt-4 pb-3 border-t border-gray-200">
                        <div class="flex items-center px-4">
                            <div class="flex-shrink-0">
                                <img
                                    class="h-10 w-10 rounded-full"
                                    src={avatarUrl}
                                    alt={userInitials}
                                />
                            </div>
                            <div class="ml-3">
                                <div class="text-base font-medium text-gray-800">
                                    {$authStore.user.name}
                                </div>
                                <div class="text-sm font-medium text-gray-500">
                                    {$authStore.user.email}
                                </div>
                            </div>
                        </div>
                        <div class="mt-3 space-y-1">
                            <a
                                href={`/dashboard/${$authStore.user.role}`}
                                class="block px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600
                                       hover:bg-gray-50"
                                on:click|preventDefault={() => handleNavigation(`/dashboard/${$authStore.user.role}`, { requiresAuth: true })}
                            >
                                Dashboard
                            </a>
                           
                            <button
                                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-700
                                       hover:text-indigo-600 hover:bg-gray-50"
                                on:click={handleLogout}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </header>
{/if}

<style lang="postcss">
    /* Add any custom styles here */
    :global(body) {
        @apply overflow-x-hidden;
    }

    .mobile-menu {
        @apply fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out;
    }
</style>