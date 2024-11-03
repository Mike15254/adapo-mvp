import type { RecordModel } from 'pocketbase';

export type UserRole = 'investor' | 'startup';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type AccountStatus = 'pending' | 'active' | 'suspended';

export interface BaseAuthUser extends RecordModel {
    email: string;
    username: string;
    emailVisibility: boolean;
    verified: boolean;
}

export interface AuthUser extends BaseAuthUser {
    name: string;
    profile_picture?: string;
    role: UserRole;
    account_status: AccountStatus;
    verification_status: VerificationStatus;
    registration_date?: string;
    verification_code?: string;
    verification_code_expires?: string;
}

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string; // Keep firstName
    lastName: string;  // Keep lastName
    role: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}

// Type guard for AuthUser
export function isAuthUser(user: any): user is AuthUser {
    return (
        user &&
        typeof user.email === 'string' &&
        typeof user.username === 'string' &&
        typeof user.name === 'string' &&
        typeof user.role === 'string' &&
        typeof user.verification_status === 'string' &&
        typeof user.account_status === 'string'
    );
}

export interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
    verification_documents?: string;
    verification_status: VerificationStatus;
    team_members: any[];
    logo?: string;
    social_links?: Record<string, string>;
    funding_raised_total: number;
    investor_count: number;
    founded_Date: string;
    pitch_deck?: string;
    funding_goal: number;
    funds_raised: number;
}