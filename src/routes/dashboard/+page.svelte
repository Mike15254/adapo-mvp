<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  export let data;

  onMount(() => {
    // Redirect to role-specific dashboard
    goto(`/dashboard/${data.role}`);
  });
</script>
<div>Redirecting...</div>