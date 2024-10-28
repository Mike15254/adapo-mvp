<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import logo from '$lib/assets/adapo-logo.png';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const excludedRoutes = ['/dashboard/startup', '/auth/login', '/onboarding'];
	const showHeaderFooter = derived(page, ($page) => !excludedRoutes.includes($page.url.pathname));
</script>


<div class="flex flex-col min-h-screen">

	<main>
		<slot />
	</main>
</div>

