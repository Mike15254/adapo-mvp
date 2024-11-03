import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { authStore } from '$lib/stores/auth.store';

export const load: PageLoad = async ({ url }) => {
	const user = await authStore.getCurrentUser();

	// If no user is logged in, redirect to login
	if (!user) {
		throw redirect(302, '/login');
	}

	// If user is already verified, redirect to their dashboard
	if (user.verified) {
		throw redirect(302, `/dashboard/${user.role}`);
	}

	return {
		user,
		token: url.searchParams.get('token')
	};
};
