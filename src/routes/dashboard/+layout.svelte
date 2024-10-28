<script lang="ts">
    import { page } from '$app/stores';
    import { authStore } from '$lib/stores/authStore';
    import DashboardNav from '$lib/components/DashboardNav.svelte';

  </script>
  
  <div class="min-h-screen bg-gray-50">
      <main class="mx-auto">
       
          <slot />
    
      </main>
  </div>
  
  <style>
 
  </style>