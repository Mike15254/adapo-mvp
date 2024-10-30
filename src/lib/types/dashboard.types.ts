// src/lib/types/dashboard.types.ts
import type { AuthUser } from './auth.types';

export type UpdateType = 'milestone' | 'financial' | 'team' | 'general';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type IndustryType = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';

export interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: IndustryType;
    verification_documents?: string;
    verification_status: VerificationStatus;
    team_members: TeamMember[];
    logo?: string;
    social_links: SocialLinks;
    funding_raised_total: number;
    investor_count: number;
    founded_Date: string;
    pitch_deck?: string;
    funding_goal: number;
    funds_raised: number;
}

export interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image?: string;
}

export interface SocialLinks {
    website?: string;
    linkedin?: string;
    twitter?: string;
}

export interface StartupUpdate {
    id: string;
    startup: string;
    title: string;
    content: string;
    update_type: UpdateType;
    attachments?: string[];
    created: string;
}

export interface Investment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'refunded';
    project: string;
    investor: string;
    transaction_date: string;
    startup: string;
}

export interface DashboardStats {
    totalFundsRaised: number;
    fundingGoal: number;
    progressPercentage: number;
    totalInvestors: number;
    recentInvestments: Investment[];
    verificationStatus: VerificationStatus;
}

export interface DashboardState {
    startup: StartupProfile | null;
    stats: DashboardStats | null;
    updates: StartupUpdate[];
    isLoading: boolean;
    error: string | null;
}