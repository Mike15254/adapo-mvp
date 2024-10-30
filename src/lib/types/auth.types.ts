// src/lib/types/auth.types.ts
import type { Record, Admin } from 'pocketbase';

export type UserRole = 'investor' | 'startup';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type AccountStatus = 'pending' | 'active' | 'suspended';

// Base user fields that must be present
export interface AuthUser extends Record {
    id: string;
    email: string;
    verified: boolean;
    name: string;
    username: string;
    role: UserRole;
    verification_status: VerificationStatus;
    account_status: AccountStatus;
    onboarding_completed?: boolean;
    emailVisibility: boolean;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
    expand: string;
    profile_picture?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    role: UserRole;
    username: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Type guard to check if a record is an AuthUser
export function isAuthUser(record: Record | Admin | null): record is AuthUser {
    if (!record) return false;
    
    return (
        'email' in record &&
        'name' in record &&
        'username' in record &&
        'role' in record &&
        'verification_status' in record &&
        'account_status' in record
    );
}

// Transform PocketBase record to AuthUser
export function transformToAuthUser(record: Record | null): AuthUser | null {
    if (!record || !isAuthUser(record)) {
        console.error('Invalid user record:', record);
        return null;
    }

    return {
        id: record.id,
        email: record.email,
        verified: record.verified,
        name: record.name,
        username: record.username,
        role: record.role as UserRole,
        verification_status: record.verification_status as VerificationStatus,
        account_status: record.account_status as AccountStatus,
        onboarding_completed: record.onboarding_completed,
        emailVisibility: record.emailVisibility,
        created: record.created,
        updated: record.updated,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        expand: record.expand,
        profile_picture: record.profile_picture
    };
}