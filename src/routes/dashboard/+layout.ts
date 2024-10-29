// src/routes/dashboard/+layout.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import { browser } from '$app/environment';

export const load: LayoutLoad = async ({ parent }) => {
    const { user, isAuthenticated } = await parent();

    console.log('Dashboard layout check:', { user, isAuthenticated });

    if (!isAuthenticated || !user) {
        throw redirect(302, '/login');
    }

    if (!user.role) {
        throw redirect(302, '/onboarding');
    }

    // Ensure user is in correct dashboard
    const currentPath = browser ? window.location.pathname : '';
    const expectedPath = `/dashboard/${user.role}`;
    
    if (!currentPath.startsWith(expectedPath)) {
        throw redirect(302, expectedPath);
    }

    return {
        user
    };
};