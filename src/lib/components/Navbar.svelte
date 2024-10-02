<!--
@component
This is the main navigation component for the ADAPO website.
It includes a logo, navigation links, and authentication buttons.
The component is responsive, with a dropdown menu for mobile views and the Login link always visible.

Usage:
```svelte
<script>
import Navbar from './Navbar.svelte';
</script>

<Navbar />
```

@example

<Navbar />

-->
<script lang="ts">
    import { onMount } from 'svelte';
    import logo from "../assets/adapo-logo.png";
    
    /**
     * @typedef {Object} NavItem
     * @property {string} label - The text to display for the nav item
     * @property {string} href - The URL the nav item should link to
     */
  
    /** @type {NavItem[]} */
    const navItems = [
      { label: 'Invest', href: '/invest' },
      { label: 'Raise', href: '/raise' },
    ];
  
    /** @type {boolean} */
    let isMobileMenuOpen = false;
    
    /**
     * Toggles the mobile menu open/closed state
     * @returns {void}
     */
    function toggleMobileMenu(): void {
      isMobileMenuOpen = !isMobileMenuOpen;
    }
  
    onMount(() => {
      /**
       * Handles window resize events
       * @returns {void}
       */
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
  <div class="bg-gray-300 text-center">
    <p class="p-2 text-sm">
      Update: We are now in Beta. Please contact us at <a href="mailto:hello@adapo.io" class="underline underline-offset-2">hello@adapo.io</a> for more information.
    </p>
  </div>
  <header class="sticky inset-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
    
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-2 py-4">
      <div class="flex items-center">
        <a href="/" class="mr-4">
          <img src={logo} loading="lazy" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
        </a>
        <ul class="hidden md:flex items-center space-x-6">
          {#each navItems as item}
            <li class="font-dm text-base font-medium text-slate-700">
              <a href={item.href}>{item.label}</a>
            </li>
          {/each}
        </ul>
      </div>
      <div class="flex items-center space-x-4">
        <a href="/account/login" class="font-dm text-base font-medium text-slate-700">Login</a>
        <a href="./account/signup" class="hidden md:inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
          Sign up
        </a>
        <button type="button" class="md:hidden" on:click={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6 text-slate-900">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
          </svg>
        </button>
      </div>
    </nav>
  </header>
  
  {#if isMobileMenuOpen}
    <div class="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg z-40">
      <ul class="py-2 px-6">
        {#each navItems as item}
          <li class="py-2">
            <a href={item.href} class="font-dm text-base font-medium text-slate-700" on:click={toggleMobileMenu}>
              {item.label}
            </a>
          </li>
        {/each}
        <li class="py-2">
          <a href="/account/signup" class="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-primary border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600" on:click={toggleMobileMenu}>
            Sign up
          </a>
        </li>
      </ul>
    </div>
  {/if}