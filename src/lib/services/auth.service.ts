import { pb, clearPocketBaseAuth } from '../pocketbase';
import { authStore } from '../stores/authStore';
import type { RegisterData, LoginData, AuthUser } from '../types/auth.types';
import { transformToAuthUser, isAuthUser } from '../types/auth.types';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';


export class AuthError extends Error {
    constructor(
        message: string,
        public code: 'UNVERIFIED_EMAIL' | 'INVALID_CREDENTIALS' | 'ACCOUNT_DISABLED' | 'SERVER_ERROR'
    ) {
        super(message);
        this.name = 'AuthError';
    }
}
export class AuthService {
    static async initialize() {
        try {
            authStore.setLoading(true);
            
            if (pb.authStore.isValid) {
                const user = transformToAuthUser(pb.authStore.model);
                authStore.setUser(user);
            } else {
                authStore.reset();
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            authStore.reset();
        } finally {
            authStore.setLoading(false);
        }
    }

    static async register(data: RegisterData) {
        authStore.setLoading(true);
        
        try {
            const record = await pb.collection('users').create({
                ...data,
                account_status: 'pending',
                emailVisibility: true
            });

            // Use PocketBase's built-in verification
            await pb.collection('users').requestVerification(data.email);
            
            const user = transformToAuthUser(record);
            if (!user) throw new Error('Invalid user data after registration');
            
            return user;
        } catch (error: any) {
            const errorMessage = error.response?.message || error.message || 'Registration failed';
            authStore.setError(errorMessage);
            throw error;
        } finally {
            authStore.setLoading(false);
        }
    }

    static async login({ email, password }: LoginData) {
        authStore.setLoading(true);
        
        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            const user = transformToAuthUser(authData.record);
            
            if (!user) {
                throw new AuthError('Invalid user data', 'SERVER_ERROR');
            }
    
            if (!user.verified) {
                clearPocketBaseAuth();
                throw new AuthError(
                    'Please verify your email before logging in',
                    'UNVERIFIED_EMAIL'
                );
            }
    
            if (user.account_status === 'suspended') {
                clearPocketBaseAuth();
                throw new AuthError(
                    'Your account has been suspended',
                    'ACCOUNT_DISABLED'
                );
            }
    
            authStore.setUser(user);
            await goto(`/dashboard/${user.role}`);
            
            return { user, token: authData.token };
        } catch (error: any) {
            // Handle PocketBase errors
            if (error?.response?.message) {
                if (error.response.message.includes('password') || 
                    error.response.message.includes('email')) {
                    throw new AuthError(
                        'Invalid email or password',
                        'INVALID_CREDENTIALS'
                    );
                }
                throw new AuthError(error.response.message, 'SERVER_ERROR');
            }
            
            // If it's already an AuthError, rethrow it
            if (error instanceof AuthError) {
                throw error;
            }
            
            // For any other errors
            throw new AuthError(
                error?.message || 'Authentication failed',
                'SERVER_ERROR'
            );
        } finally {
            authStore.setLoading(false);
        }
    }


    static async logout() {
        try {
            clearPocketBaseAuth();
            authStore.reset();
            await goto('/');
        } catch (error) {
            console.error('Logout error:', error);
            await goto('/');
        }
    }

    static async verifyEmail(token: string) {
        try {
            // Use PocketBase's built-in verification confirmation
            await pb.collection('users').confirmVerification(token);
            
            // If user is logged in, update their state
            if (pb.authStore.model) {
                const user = transformToAuthUser(pb.authStore.model);
                if (user) {
                    authStore.setUser(user);
                }
            }
            
            return true;
        } catch (error: any) {
            const errorMessage = error.response?.message || error.message || 'Email verification failed';
            authStore.setError(errorMessage);
            throw error;
        }
    }

    static async resendVerification(email: string) {
        try {
            // Use PocketBase's built-in verification request
            await pb.collection('users').requestVerification(email);
            return { success: true };
        } catch (error) {
            throw new AuthError(
                'Failed to send verification email',
                'SERVER_ERROR'
            );
        }
    }

    static getCurrentUser(): AuthUser | null {
        return get(authStore).user;
    }

    static isAuthenticated(): boolean {
        return get(authStore).isAuthenticated;
    }
}