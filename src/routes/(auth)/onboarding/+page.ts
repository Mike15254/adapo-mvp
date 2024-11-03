import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { authStore } from '$lib/stores/auth.store';
import { get } from 'svelte/store';

export const load: PageLoad = async () => {
    if (browser) {
        const auth = get(authStore);
        
        // If user is already authenticated and verified, redirect to dashboard
        if (auth.isAuthenticated && auth.user?.verified) {
            throw redirect(302, `/dashboard/${auth.user.role}`);
        }
    }

    return {};
};