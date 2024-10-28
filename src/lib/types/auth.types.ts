// src/lib/types/auth.types.ts
import type { Record } from 'pocketbase';

export interface AuthUser extends Record {
    email: string;
    name: string;
    role: 'investor' | 'startup';
    username: string;
    profile_picture?: string;
    verification_status: 'unverified' | 'pending' | 'verified';
    account_status: 'pending' | 'active' | 'suspended';
}

export interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    role: 'investor' | 'startup';
    username: string;
}

export interface ApiError {
    status?: number;
    response?: {
        message?: string;
        data?: any;
    };
    message?: string;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}