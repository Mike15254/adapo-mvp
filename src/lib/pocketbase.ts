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

// Helper to get the current user
export function getCurrentUser() {
    return pb.authStore.model;
}

// Helper to check if user is authenticated
export function isAuthenticated() {
    return pb.authStore.isValid;
}

// Export types for better TypeScript support
export type { Record, Admin } from 'pocketbase';

// Export the auth store for direct access if needed
export const pocketbaseAuthStore = pb.authStore;