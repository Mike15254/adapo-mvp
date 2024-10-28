<script lang="ts">
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    import { authStore } from '$lib/stores/authStore';
  
    export let role: 'investor' | 'startup';
  
    const investorNavItems = [
      { href: '/dashboard/investor', label: 'Overview' },
      { href: '/dashboard/investor/investments', label: 'My Investments' },
      { href: '/dashboard/investor/opportunities', label: 'Opportunities' },
      { href: '/dashboard/investor/profile', label: 'Profile' }
    ];
  
    const startupNavItems = [
      { href: '/dashboard/startup', label: 'Overview' },
      { href: '/dashboard/startup/projects', label: 'Projects' },
      { href: '/dashboard/startup/funding', label: 'Funding' },
      { href: '/dashboard/startup/profile', label: 'Profile' }
    ];
  
    const navItems = role === 'investor' ? investorNavItems : startupNavItems;
    let isMobileMenuOpen = false;
  
    // Get avatar URL using DiceBear
    $: avatarUrl = $authStore.user ? 
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent($authStore.user.email)}&backgroundColor=4F46E5&textColor=ffffff` : '';
  </script>
  
  <!-- Desktop Sidebar -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
    <div class="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
      <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div class="flex-shrink-0 px-4 flex items-center">
          <span class="text-xl font-bold text-gray-900">ADAPO {role}</span>
        </div>
        <nav class="mt-5 flex-1 px-4 space-y-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              class:bg-indigo-50={$page.url.pathname === item.href}
              class:text-indigo-600={$page.url.pathname === item.href}
              class:text-gray-700={$page.url.pathname !== item.href}
              class:hover:bg-gray-50={$page.url.pathname !== item.href}
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>
      <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div class="flex-shrink-0 w-full group block">
          <div class="flex items-center">
            <div class="h-8 w-8 rounded-full overflow-hidden">
              <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-700">{$authStore.user?.name}</p>
              <p class="text-xs font-medium text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu button -->
  <div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-2">
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="inline-flex items-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
        on:click={() => isMobileMenuOpen = !isMobileMenuOpen}
      >
        <span class="sr-only">Open menu</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div class="flex items-center">
        <div class="h-8 w-8 rounded-full overflow-hidden">
          <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu -->
  {#if isMobileMenuOpen}
    <div 
      class="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
      on:click={() => isMobileMenuOpen = false}
      transition:fade={{ duration: 200 }}
    ></div>
  
    <div
      class="lg:hidden fixed inset-y-0 left-0 flex flex-col w-64 bg-white z-40"
      transition:fly={{ x: -300, duration: 300 }}
    >
      <div class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center justify-between flex-shrink-0 px-4">
            <span class="text-xl font-bold text-gray-900">ADAPO {role}</span>
            <button
              class="rounded-md text-gray-500 hover:text-gray-600 focus:outline-none"
              on:click={() => isMobileMenuOpen = false}
            >
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="mt-5 flex-1 px-4 space-y-1">
            {#each navItems as item}
              <a
                href={item.href}
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                class:bg-indigo-50={$page.url.pathname === item.href}
                class:text-indigo-600={$page.url.pathname === item.href}
                class:text-gray-700={$page.url.pathname !== item.href}
                class:hover:bg-gray-50={$page.url.pathname !== item.href}
                on:click={() => isMobileMenuOpen = false}
              >
                {item.label}
              </a>
            {/each}
          </nav>
        </div>
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div class="h-8 w-8 rounded-full overflow-hidden">
                <img src={avatarUrl} alt="" class="h-full w-full object-cover" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700">{$authStore.user?.name}</p>
                <p class="text-xs font-medium text-gray-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}