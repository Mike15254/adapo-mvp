// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

// Initialize PocketBase with your API URL
export const pb = new PocketBase('https://adapo.pockethost.io/');

// Helper function to clear PocketBase auth data
export function clearPocketBaseAuth() {
    if (browser) {
        pb.authStore.clear();
        localStorage.removeItem('pb_auth');
    }
}

// Export the auth store for direct access if needed
export const pocketbaseAuthStore = pb.authStore;