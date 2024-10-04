<script lang="ts">
  import "../app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import logo from "$lib/assets/adapo-logo.png";
  import { derived } from "svelte/store";
  import { page } from '$app/stores';
import { fade } from "svelte/transition";

  const excludedRoutes = [ '/dashboard', '/auth/login', ];
  const showHeaderFooter = derived(page, $page => !excludedRoutes.includes($page.url.pathname));




</script>
<div class="bg-gray-300 text-center top-0 mt-0">
  <p class="p-2 text-sm">
    Update: We are now in Beta. Please contact us at <a href="mailto:hello@adapo.io" class="underline underline-offset-2">hello@adapo.io</a> for more information.
  </p>
</div>
<div class="flex flex-col min-h-screen">
  {#if $showHeaderFooter}
  <div transition:fade="{{ duration: 300 }}" class="sticky top-0 z-50">
    <Navbar />
  </div>

  {/if}
      <main>

          <slot />

      </main>
</div>

<!-- Footer -->
<footer class="bg-gray-800 text-white py-8">
  <div class="container mx-auto px-4 max-w-7xl">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <img src={logo} loading="lazy" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
        <p class="pt-4">Empowering Kenyan SMEs and Investors through innovative funding solutions.</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
        <ul>
          <li><a href="/" class="hover:text-gray-300">Home</a></li>
          <li><a href="/" class="hover:text-gray-300">Invest</a></li>
          <li><a href="/" class="hover:text-gray-300">Raise Funds</a></li>
          <li><a href="/" class="hover:text-gray-300">About Us</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
        <p>Email: info@adapo.com</p>
        <p>Phone: +254 123 456 789</p>
      </div>
    </div>
    <div class="mt-8 text-center">
      <p>&copy; 2024 Adapo. All rights reserved.</p>
    </div>
  </div>
</footer>