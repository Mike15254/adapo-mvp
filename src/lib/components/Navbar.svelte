<script lang="ts">
    import { page } from '$app/stores';
    import { fly } from 'svelte/transition';
    import { authStore } from '$lib/stores/authStore';
    import logo from "../assets/adapo-logo.png";
    import { goto } from '$app/navigation';
    
    interface NavItem {
      label: string;
      href: string;
    }
  
    const navItems: NavItem[] = [
      { label: 'Invest', href: '/invest'},
      { label: 'Raise', href: '/raise' }
    ];
  
    let isMobileMenuOpen = false;
    let isProfileMenuOpen = false;
    
    function toggleMobileMenu(): void {
      isMobileMenuOpen = !isMobileMenuOpen;
      if (isMobileMenuOpen) isProfileMenuOpen = false;
    }
  
    function closeMobileMenu(): void {
      isMobileMenuOpen = false;
    }
  
    function toggleProfileMenu(): void {
      isProfileMenuOpen = !isProfileMenuOpen;
      if (isProfileMenuOpen) isMobileMenuOpen = false;
    }
  
    async function handleLogout(): Promise<void> {
      authStore.logout();
      isProfileMenuOpen = false;
      isMobileMenuOpen = false;
      await goto('/');
    }
  
    // Generate initials avatar URL using DiceBear
    function getAvatarUrl(name: string, email: string): string {
      return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name || email)}&radius=10&backgroundColor=4F46E5&textColor=ffffff`;
    }
  
    $: userInitials = $authStore.user?.name ? 
      $authStore.user.name.split(' ').map((n: any[]) => n[0]).join('').toUpperCase() : '';
    
    $: avatarUrl = $authStore.user ? 
      getAvatarUrl($authStore.user.name, $authStore.user.email) : '';
  </script>
  
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8 py-4">
      <!-- Logo and Navigation -->
      <div class="flex items-center">
        <a href="/" class="mr-4">
          <img src={logo} loading="lazy" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
        </a>
        <ul class="hidden md:flex items-center space-x-6">
          {#each navItems as item}
            <li class="font-dm text-base font-medium text-slate-700">
              <a 
                href={item.href} 
                class="flex items-center hover:text-indigo-600 transition-colors duration-200" 
                class:text-indigo-600={$page.url.pathname === item.href}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
  
      <!-- Auth and Profile Section -->
      <div class="flex items-center space-x-4">
        {#if $authStore.isAuthenticated && $authStore.user}
          <div class="relative">
            <!-- Desktop Profile Button -->
            <button 
              on:click={toggleProfileMenu} 
              class="flex items-center space-x-3 text-slate-700 hover:text-indigo-600 transition-colors duration-200"
            >
              <div class="h-8 w-8 rounded-full overflow-hidden shrink-0">
                <img 
                  src={avatarUrl} 
                  alt={userInitials}
                  class="h-full w-full object-cover"
                />
              </div>
              <span class="hidden md:block font-medium text-sm">
                {$authStore.user.name}
              </span>
            </button>
            
            <!-- Profile Dropdown -->
            {#if isProfileMenuOpen}
              <div 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100"
                transition:fly={{ y: -10, duration: 200 }}
              >
                <a 
                  href={`/dashboard/${$authStore.user.role}`} 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </a>
                <a 
                  href={`/dashboard/${$authStore.user.role}/profile`} 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </a>
                <button 
                  on:click={handleLogout} 
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <a 
            href="/login" 
            class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors duration-200"
          >
            Login
          </a>
          <a 
            href="/onboarding" 
            class="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors duration-200"
          >
            Sign up
          </a>
        {/if}
  
        <!-- Mobile Menu Button -->
        <button 
          type="button" 
          class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          on:click={toggleMobileMenu} 
          aria-label="Toggle mobile menu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-16 6h16" />
          </svg>
        </button>
      </div>
    </nav>
  </header>
  
  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <button 
      class="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 transition-opacity"
      on:click={closeMobileMenu}
      transition:fly={{ duration: 200 }}
    ></button>
    
    <div
      class="fixed right-0 top-0 w-64 h-full bg-white z-50 shadow-lg flex flex-col"
      transition:fly={{ x: 300, duration: 300 }}
    >
      <div class="p-4 flex-grow">
        <!-- Mobile Menu Header -->
        <div class="flex justify-between items-center mb-6">
          {#if $authStore.isAuthenticated && $authStore.user}
            <div class="flex items-center space-x-3">
              <div class="h-8 w-8 rounded-full overflow-hidden">
                <img 
                  src={avatarUrl} 
                  alt={userInitials}
                  class="h-full w-full object-cover"
                />
              </div>
              <span class="font-medium text-sm text-gray-900">
                {$authStore.user.name}
              </span>
            </div>
          {/if}
          <button 
            on:click={closeMobileMenu} 
            class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Close mobile menu"
          >
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
  
        <!-- Mobile Menu Items -->
        <div class="space-y-4">
          {#each navItems as item}
            <a 
              href={item.href} 
              on:click={closeMobileMenu} 
              class="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              class:text-indigo-600={$page.url.pathname === item.href}
            >
              {item.label}
            </a>
          {/each}
  
          {#if $authStore.isAuthenticated && $authStore.user}
            <a 
              href={`/dashboard/${$authStore.user.role}`}
              on:click={closeMobileMenu} 
              class="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
            >
              Dashboard
            </a>
            <a 
              href={`/dashboard/${$authStore.user.role}/profile`}
              on:click={closeMobileMenu} 
              class="block py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
            >
              Profile
            </a>
            <button 
              on:click={handleLogout}
              class="block w-full text-left py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
            >
              Logout
            </button>
          {:else}
            <a 
              href="/onboarding"
              on:click={closeMobileMenu}
              class="block py-2 text-base font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign Up
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    :global(body) {
      overflow-x: hidden;
    }
  
   
  </style>