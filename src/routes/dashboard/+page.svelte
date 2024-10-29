<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import LoadingScreen from '$lib/components/LoadingScreen.svelte';
  
  interface UserData {
    isAuthenticated: boolean;
    user: {
      role: 'startup' | 'investor';
      [key: string]: any;
    };
  }

  export let data: UserData;
  let error: string | null = null;

  onMount(async () => {
    try {
      if (!data.isAuthenticated) {
        await goto('/login');
        return;
      }

      const userRole = data.user?.role;
      if (!userRole) {
        throw new Error('User role not found');
      }

      // Redirect to role-specific dashboard
      await goto(`/dashboard/${userRole}`);
    } catch (err) {
      error = 'Unable to load dashboard. Please try again.';
      console.error('Dashboard redirect error:', err);
    }
  });
</script>

{#if error}
  <div class="p-4 bg-red-100 text-red-700 rounded-md">
    {error}
  </div>
{:else}
  <LoadingScreen message="Setting up your dashboard..." />
{/if}