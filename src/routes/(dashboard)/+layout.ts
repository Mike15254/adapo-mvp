// src/routes/(dashboard)/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { authStore } from '$lib/stores/auth.store';
import { pb } from '$lib/pocketbase';

export const load: LayoutLoad = async ({ url, parent }) => {
	if (!browser) {
		return {};
	}

	// Get parent data which includes auth state
	const parentData = await parent();

	if (!pb.authStore.isValid) {
		throw redirect(302, '/login');
	}

	const user = pb.authStore.model as any;
	// console.log('👤 [Dashboard Layout] Current user:', {
	//     id: user.id,
	//     role: user.role,
	//     verified: user.verified
	// });

	if (!user || !user.role) {
		// console.log('❌ [Dashboard Layout] Invalid user data, redirecting to login');
		throw redirect(302, '/login');
	}

    // console.log(user.id)
	// Extract the role from URL
	const urlRole = url.pathname.split('/')[2];
	// Verify role matches
	if (urlRole && urlRole !== user.role) {
		throw redirect(302, `/dashboard/${user.role}`);
	}

	// For startup role, fetch additional profile data
	let profile = null;
	if (user.role === 'startup') {
		try {
			profile = await pb.collection('startup_profiles').getFirstListItem(`user="${user.id}"`);
		} catch (error) {}
	}

	return {
		user,
		profile
	};
};
