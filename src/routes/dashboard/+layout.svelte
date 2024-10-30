<script lang="ts">
    import { page } from '$app/stores';
    import { authStore } from '$lib/stores/authStore';
    import { loadingStore } from '$lib/stores/loadingStore';
    import Loading from '$lib/components/LoadingScreen.svelte';
    import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-gray-50">
    
    <main class="mx-auto">
    
        <slot />
    </main>
</div>