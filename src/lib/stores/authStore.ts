// src/lib/stores/authStore.ts
import { writable, derived } from 'svelte/store';
import type { AuthState, AuthUser } from '../types/auth.types';
import { browser } from '$app/environment';

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    return {
        subscribe,
        set,
        update,
        setUser: (user: AuthUser | null) => update(state => ({ 
            ...state, 
            user,
            isAuthenticated: !!user,
            isLoading: false
        })),
        setError: (error: string) => update(state => ({ 
            ...state, 
            error,
            isLoading: false 
        })),
        reset: () => set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        }),
        setLoading: (isLoading: boolean) => update(state => ({ 
            ...state, 
            isLoading,
            error: null 
        }))
    };
}

export const authStore = createAuthStore();

// Derived stores for common auth states
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const currentUser = derived(authStore, $auth => $auth.user);
export const isLoading = derived(authStore, $auth => $auth.isLoading);