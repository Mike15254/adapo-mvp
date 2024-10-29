import { pb } from '../pocketbase';
import type { RegisterData, ApiError, AuthState } from '../types/auth.types';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { onboardingStore } from '../stores/onboardingStore';
import { userType } from '../stores/userStore';
import { writable } from 'svelte/store';

// Update AuthState interface to include verification status
export const authStore = writable<AuthState>({
    user: null,
    token: null,
    isLoading: true,
   isAuthenticated: false,
    verification_status: 'unverified'
});

export class AuthService {
    static async register(data: RegisterData) {
        try {
            // Create user with verification pending status
            const user = await pb.collection('users').create({
                ...data,
                account_status: 'pending',
                verification_status: 'unverified',
                emailVisibility: true
            });

            // Request email verification instead of auto-login
            await pb.collection('users').requestVerification(data.email);

            // Update auth store with pending verification status
            authStore.set({
                user,
                token: null,
                isLoading: false,
                isAuthenticated: false,
                verification_status: 'pending'
            });

            return user;
        } catch (error) {
            throw error;
        }
    }
    static async requestVerificationEmail(email: string) {
        return this.resendVerification(email);
    }

    static async login(email: string, password: string) {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            // Debug log
            console.log('Login successful:', authData);

            if (!authData.record.verified) {
                throw new Error('UNVERIFIED_EMAIL');
            }

            if (browser) {
                // Set cookie
                document.cookie = `pb_auth=${JSON.stringify({
                    token: authData.token,
                    model: authData.record
                })}; path=/; max-age=2592000; SameSite=Strict${
                    window.location.protocol === 'https:' ? '; Secure' : ''
                }`;

                // Update auth store
                pb.authStore.save(authData.token, authData.record);

                // Get user role and redirect
                const role = authData.record.role;
                if (!role) {
                    await goto('/onboarding');
                    return authData;
                }

                // Forced page reload to ensure proper state
                window.location.href = `/dashboard/${role}`;
                return authData;
            }

            return authData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }


    static async verifyEmail(token: string) {
        try {
            await pb.collection('users').confirmVerification(token);
            
            // Update user's verification status
            if (pb.authStore.model) {
                await pb.collection('users').update(pb.authStore.model.id, {
                    verification_status: 'verified'
                });
            }

            // Clear any existing onboarding state
        onboardingStore.reset();
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async resendVerification(email: string) {
        try {
            await pb.collection('users').requestVerification(email);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async logout() {
        try {
            pb.authStore.clear();

            authStore.set({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
                verification_status: 'unverified'
            });

            onboardingStore.reset();
            userType.set('investor');

            if (browser) {
                localStorage.removeItem('pb_auth');
                document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }

            await goto('/');
        } catch (error) {
            console.error('Logout error:', error);
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