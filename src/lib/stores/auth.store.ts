import { writable, derived, get } from 'svelte/store';
import type { AuthState, AuthUser, RegisterData } from '../types/auth.types';
import { pb } from '../pocketbase';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

const createAuthStore = () => {
    const { subscribe, set, update } = writable<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    let initPromise: Promise<AuthUser | null> | null = null;

    async function createInitialProfile(userId: string, role: string) {
        try {
            if (role === 'startup') {
                // Create initial startup profile
                await pb.collection('startup_profiles').create({
                    user: userId,
                    company_name: '',
                    description: '',
                    verification_status: 'unverified',
                    funds_raised: 0,
                    investor_count: 0,
                    team_members: [],
                    social_links: {}
                });
                console.log('✅ [Auth Store] Created initial startup profile');
            } else if (role === 'investor') {
                // Create initial investor profile
                await pb.collection('investors_profiles').create({
                    user: userId,
                    verification_status: 'unverified',
                    type: 'individual',
                    investment_history: [],
                    total_investments: 0,
                    active_investments: 0
                });
                console.log('✅ [Auth Store] Created initial investor profile');
            }

            // Create wallet for all users
            await pb.collection('wallets').create({
                user: userId,
                balance: 0,
                currency: 'KES',
                status: 'active'
            });
            console.log('✅ [Auth Store] Created initial wallet');

        } catch (error) {
            console.error('❌ [Auth Store] Error creating initial profile:', error);
            throw error;
        }
    }


    const initialize = async () => {
        if (!browser) {
            console.log('⚠️ [Auth Store] Server-side initialization, skipping');
            return null;
        }

        console.log('🔄 [Auth Store] Starting initialization...');
        update(state => ({ ...state, isLoading: true }));

        try {
            // Check PocketBase auth state
            if (pb.authStore.isValid) {
                const user = pb.authStore.model as unknown as AuthUser;
                console.log('✅ [Auth Store] Valid session found:', {
                    id: user.id,
                    role: user.role
                });

                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return user;
            } else {
                console.log('ℹ️ [Auth Store] No valid session found');
                pb.authStore.clear();
            }
        } catch (error) {
            console.error('❌ [Auth Store] Initialization error:', error);
            pb.authStore.clear();
        }

        set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
        return null;
    };

    return {
        subscribe,
        initialize: async () => {
            if (!initPromise) {
                console.log('🔄 [Auth Store] Creating new initialization promise');
                initPromise = initialize();
            } else {
                console.log('ℹ️ [Auth Store] Using existing initialization promise');
            }
            return initPromise;
        },
        register: async (userData: RegisterData) => {
            try {
                update(state => ({ ...state, isLoading: true, error: null }));
        
                // Create user through API
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...userData,
                        name: [userData.firstName, userData.lastName]
                    })
                });
        
                const data = await response.json();
        
                if (!response.ok) {
                    throw new Error(data.error || 'Registration failed');
                }
        
                // Auto-login after registration
                await pb.collection('users').authWithPassword(
                    userData.email,
                    userData.password
                );
        
                update(state => ({
                    ...state,
                    user: data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                }));
        
                return data.user;
            } catch (error: any) {
                console.error('Auth store registration error:', error);
                update(state => ({
                    ...state,
                    error: error.message || 'Registration failed',
                    isLoading: false
                }));
                throw error;
            }
        },
       

        login: async (email: string, password: string) => {
            console.log('🔄 [Auth Store] Login attempt:', { email });
            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                const authData = await pb.collection('users').authWithPassword(email, password);
                const user = authData.record as unknown as AuthUser;
                
                console.log('✅ [Auth Store] Login successful:', {
                    id: user.id,
                    role: user.role
                });

                set({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });

                // Reset init promise to force reinitialization on next check
                initPromise = null;

                // Handle redirect
                const redirectTo = new URLSearchParams(window.location.search).get('redirect');
                const targetPath = redirectTo ? decodeURIComponent(redirectTo) : `/dashboard/${user.role}`;
                console.log('🔄 [Auth Store] Redirecting to:', targetPath);
                
                await goto(targetPath);
                return user;
            } catch (error: any) {
                console.error('❌ [Auth Store] Login error:', error);
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: error.message
                });
                throw error;
            }
        },
        logout: async () => {
            console.log('🔄 [Auth Store] Logout initiated');
            try {
                pb.authStore.clear();
                initPromise = null;
                
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null
                });
                
                console.log('✅ [Auth Store] Logout successful');
                await goto('/login');
            } catch (error) {
                console.error('❌ [Auth Store] Logout error:', error);
                throw error;
            }
        },
        resendVerification: async (email: string) => {
            try {
                const response = await fetch('/api/auth/verify', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }

                return response.json();
            } catch (error: any) {
                throw error;
            }
        },

        reset: () => {
            pb.authStore.clear();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        },

        getCurrentUser: () => {
            const currentUser = pb.authStore.isValid ? pb.authStore.model as unknown as AuthUser : null;
            return currentUser;
        }
    };
};

export const authStore = createAuthStore();
export const user = derived(authStore, $auth => $auth.user);
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const isLoading = derived(authStore, $auth => $auth.isLoading);