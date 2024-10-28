// src/lib/stores/userStore.ts needs to be updated to export currentUser
import { writable } from 'svelte/store';
import type { AuthUser } from '../types/auth.types';

function createUserStore() {
    const { subscribe, set } = writable<AuthUser | null>(null);

    return {
        subscribe,
        set,
        reset: () => set(null)
    };
}

export const userType = writable<'investor' | 'startup'>('investor');
export const currentUser = createUserStore();