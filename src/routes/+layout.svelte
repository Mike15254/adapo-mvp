<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import logo from '$lib/assets/adapo-logo.png';
	import { derived } from 'svelte/store';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	const excludedRoutes = ['/dashboard/startup', '/auth/login'];
	const showHeaderFooter = derived(page, ($page) => !excludedRoutes.includes($page.url.pathname));
</script>


<div class="flex flex-col min-h-screen">

	<main>
		<slot />
	</main>
</div>

<!-- Footer -->
{#if $showHeaderFooter}
<footer class="bg-gray-800 text-white py-8">
	<div class="container mx-auto px-4 max-w-7xl">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div>
				<img src={logo} loading="lazy" width="32" height="32" alt="Adapo Logo" class="h-8 w-auto" />
				<p class="pt-4">
					Empowering Kenyan SMEs and Investors through innovative funding solutions.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-semibold mb-4">Quick Links</h3>
				<ul>
					<li><a href="/" class="hover:text-gray-300">Home</a></li>
					<li><a href="/" class="hover:text-gray-300">Invest</a></li>
					<li><a href="/" class="hover:text-gray-300">Raise Funds</a></li>
					<li><a href="/" class="hover:text-gray-300">About Us</a></li>
				</ul>
			</div>

			<div>
				<h3 class="text-lg font-semibold mb-4">Contact Us</h3>
				<p>Email: info@adapo.com</p>
				<p>Phone: +254 123 456 789</p>
			</div>
		</div>
		<div class="mt-8 text-center">
			<p>&copy; 2024 Adapo. All rights reserved.</p>
		</div>
	</div>
</footer>
{/if}