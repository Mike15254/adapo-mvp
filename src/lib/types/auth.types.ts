import type { Record } from 'pocketbase'

export interface AuthUser extends Record {
    email: string;
    name: string;
    profile_picture?: string;
    role: 'investor' | 'startup';
    account_status: 'pending' | 'active' | 'suspended';
    verification_status: 'unverified' | 'pending' | 'verified';
    registration_date: string;
}

export type AuthState = {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}