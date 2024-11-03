<script lang="ts">
    import '../app.css';
    import { fade } from 'svelte/transition';
    import { navigating } from '$app/stores';
    import { loadingStore, isLoading } from '$lib/stores/loading.store';
    import LoadingScreen from '$lib/components/LoadingScreen.svelte';

    // Handle route navigation loading
    $: if ($navigating) {
        loadingStore.startLoading('route');
    } else {
        loadingStore.stopLoading('route');
    }

</script>

<div class="flex flex-col min-h-screen">
    <main class="flex-grow relative">
        {#if $isLoading}
            <LoadingScreen 
                message=''
            />
        {/if}
        <slot />
    </main>
</div>