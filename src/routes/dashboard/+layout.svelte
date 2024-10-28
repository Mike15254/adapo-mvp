<script lang="ts">
    import { page } from '$app/stores';
    import { authStore } from '$lib/stores/authStore';
    import DashboardNav from '$lib/components/DashboardNav.svelte';
  
    export let data;
  </script>
  
  <div class="min-h-screen bg-gray-50">
      <main class="mx-auto">
       
          <slot />
    
      </main>
  </div>
  
  <style>
    /* :global(body) {
      @apply bg-gray-50;
    } */
  </style>