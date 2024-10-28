import { browser } from '$app/environment';
import { pb, authStore } from '$lib/pocketbase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
    // Returns the current auth state
    return {
        user: pb.authStore.model,
        isAuthenticated: pb.authStore.isValid
    };
};