import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { AuthUser } from '$lib/types/auth.types';

export const load: LayoutLoad = async ({ parent }) => {
    const { user, isAuthenticated } = await parent();

    if (!isAuthenticated || !user) {
        throw redirect(302, '/login');
    }

    const authUser = user as AuthUser;

    // Validate role
    if (!authUser.role) {
        throw redirect(302, '/onboarding');
    }

    return {
        user: authUser
    };
};