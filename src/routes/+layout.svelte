<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import logo from '$lib/assets/adapo-logo.png';
    import { derived } from 'svelte/store';
    import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
    import { loadingStore } from '$lib/stores/loadingStore';
    import Loading from '$lib/components/LoadingScreen.svelte';

    const excludedRoutes = ['/dashboard/startup', '/auth/login', '/onboarding'];
    const showHeaderFooter = derived(page, ($page) => 
        !excludedRoutes.includes($page.url.pathname)
    );
</script>

<div class="flex flex-col min-h-screen">
    

    <main class="flex-grow">
        {#if $loadingStore.isLoading}
            <div class="fixed inset-0 z-50 bg-white" transition:fade={{ duration: 200 }}>
                <Loading message={$loadingStore.message} />
            </div>
        {/if}
        <slot />
    </main>
</div>