// src/lib/services/auth.service.ts
import { pb } from '../pocketbase';
import type { RegisterData, ApiError, AuthState } from '../types/auth.types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { onboardingStore } from '../stores/onboardingStore';
import { userType } from '../stores/userStore';
import { writable } from 'svelte/store';

// Create auth store
export const authStore = writable<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false
});

export class AuthService {
    static async register(data: RegisterData) {
        try {
            const user = await pb.collection('users').create({
                ...data,
                account_status: 'pending',
                verification_status: 'unverified'
            });

            // Login after registration
            await this.login(data.email, data.password);
            return user;
        } catch (error) {
            throw error;
        }
    }


    static async login(email: string, password: string) {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            if (browser) {
                document.cookie = `pb_auth=${JSON.stringify({
                    token: authData.token,
                    model: authData.record
                })}; path=/; max-age=2592000; SameSite=Strict${
                    window.location.protocol === 'https:' ? '; Secure' : ''
                }`;

                // Update auth store
                authStore.set({
                    user: authData.record,
                    token: authData.token,
                    isLoading: false,
                    isAuthenticated: true
                });
            }

            return authData;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.response?.message || 'Login failed');
        }
    }

    static async logout() {
        try {
            // Clear PocketBase auth
            pb.authStore.clear();

            // Clear auth store
            authStore.set({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false
            });

            // Clear stores
            onboardingStore.reset();
            userType.set('investor');

            // Clear localStorage and cookies
            if (browser) {
                // Clear localStorage
                localStorage.removeItem('onboarding_progress');

                // Clear cookies
                document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }

            // Redirect to home
            await goto('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still try to redirect even if there's an error
            await goto('/');
        }
    }

    static isAuthenticated(): boolean {
        return pb.authStore.isValid;
    }

    static getCurrentUser() {
        return pb.authStore.model;
    }
}