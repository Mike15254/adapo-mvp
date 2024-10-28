import type { Load } from '@sveltejs/kit';
import { get} from 'svelte/store';
import { authStore } from '$lib/stores/authStore';

export const protectedRoute: Load = async ({ url }) => {
    const auth = get(authStore);
    
    if (!auth.isAuthenticated) {
        return {
            status: 302,
            redirect: `/login?redirect=${url.pathname}`
        };
    }
    
    return {};
};


export const publicOnlyRoute: Load = async ({ url }) => {
    const auth = get(authStore);
    
    if (auth.isAuthenticated) {
        return {
            status: 302,
            redirect: '/'
        };
    }
    
    return {};
};