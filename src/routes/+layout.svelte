<script lang="ts">
    import '../app.css';
    import { fade } from 'svelte/transition';
    import { navigating } from '$app/stores';
    import { loadingStore } from '$lib/stores/loadingStore';
    import LoadingScreen from '$lib/components/LoadingScreen.svelte';

    // Use reactive statement to update store
    $: if ($navigating) {
        loadingStore.setRouteLoading(true);
    } else {
        loadingStore.setRouteLoading(false);
    }
</script>

<div class="flex flex-col min-h-screen">
    <main class="flex-grow relative">
        {#if $loadingStore.isRouteLoading}
            <div class="fixed inset-0 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <LoadingScreen message="" />
            </div>
        {:else if $loadingStore.isPageLoading}
            <div class="fixed inset-0 z-50" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <LoadingScreen message={$loadingStore.loadingMessage} />
            </div>
        {/if}
        <slot />
    </main>
</div>