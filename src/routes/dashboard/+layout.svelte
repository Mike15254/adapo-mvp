<script lang="ts">
    import { page } from '$app/stores';
    import { authStore } from '$lib/stores/authStore';
    import DashboardNav from '$lib/components/DashboardNav.svelte';
    import { loadingStore } from '$lib/stores/loadingStore';
    import Loading from '$lib/components/LoadingScreen.svelte';
    import { fade } from 'svelte/transition';
</script>

<div class="min-h-screen bg-gray-50">
    
    <main class="mx-auto">
        {#if $loadingStore.isLoading}
            <div class="fixed inset-0 z-50 bg-white" transition:fade={{ duration: 200 }}>
                <Loading message={$loadingStore.message} />
            </div>
        {/if}
        <slot />
    </main>
</div>