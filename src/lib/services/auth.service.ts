import { pb, clearAuth } from '../pocketbase';
import type { AuthUser } from '../types/auth.types';
import { browser } from '$app/environment';

export class AuthService {
    static async login(email: string, password: string) {
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);

            if (browser) {
                // Set cookie for server-side auth
                document.cookie = `pb_auth=${JSON.stringify({
                    token: authData.token,
                    model: authData.record
                })}; path=/; max-age=2592000; SameSite=Strict${
                    window.location.protocol === 'https:' ? '; Secure' : ''
                }`;
            }

            return authData;
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Handle specific error cases
            if (error.status === 400) {
                throw new Error('Invalid email or password');
            } else if (error.status === 0) {
                throw new Error('Network error. Please check your connection.');
            }
            
            throw error;
        }
    }

    static async register(userData: {
        email: string;
        password: string;
        passwordConfirm: string;
        name: string;
        role: 'investor' | 'startup';
    }) {
        try {
            const user = await pb.collection('users').create({
                ...userData,
                account_status: 'pending',
                verification_status: 'unverified',
                registration_date: new Date().toISOString(),
            });

            if (user) {
                await this.login(userData.email, userData.password);
            }

            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            if (browser) {
                document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
            clearAuth();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    static async updateProfile(userId: string, data: Partial<AuthUser>) {
        try {
            return await pb.collection('users').update(userId, data);
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }

    static isAuthenticated(): boolean {
        return pb.authStore.isValid;
    }
}