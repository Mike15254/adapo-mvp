import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import { investorStore } from '$lib/stores/investor.store';

export const load: LayoutLoad = async ({ parent }) => {
	const { user } = await parent();

	if (!user) {
		throw redirect(302, '/login');
	}

	if (user.role !== 'investor') {
		throw redirect(302, `/dashboard/${user.role}`);
	}

	try {
		// Initialize investor data
		await investorStore.initialize(user.id);

		const profile = await pb
			.collection('investors_profiles')
			.getFirstListItem(`user = "${user.id}"`, { expand: 'user' });

		return {
			user,
			profile
		};
	} catch (error) {
		throw error;
	}
};
