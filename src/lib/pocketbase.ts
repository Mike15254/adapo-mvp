import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { AuthUser, AuthState } from './types/auth.types';
import { browser } from '$app/environment';

// Initialize PocketBase
export const pb = new PocketBase('https://adapo.pockethost.io/');

// Create auth store
export const authStore = writable<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
});

// Initialize auth state
export async function initializeAuth() {
    if (!browser) return;

    try {
        // Check if we have a valid session
        if (pb.authStore.isValid) {
            authStore.set({
                user: pb.authStore.model,
                token: pb.authStore.token,
                isLoading: false,
                isAuthenticated: true,
            });
        } else {
            authStore.set({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
    }
}

// Clear auth state
export function clearAuth() {
    if (browser) {
        pb.authStore.clear();
    }
    
    authStore.set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
    });
}

// Handle auth state changes
pb.authStore.onChange((token, model) => {
    if (browser) {
        authStore.set({
            user: model,
            token: token,
            isLoading: false,
            isAuthenticated: !!token && !!model,
        });
    }
});

// Initialize on import if in browser
if (browser) {
    initializeAuth();

}