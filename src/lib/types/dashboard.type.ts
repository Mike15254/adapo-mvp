// src/lib/types/dashboard.types.ts
import type { Record } from 'pocketbase';

export type IndustryType = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type StartupVerificationStatus = 'unverified' | 'documents_pending' | 'under_review' | 'change_requested' | 'verified' | 'rejected';
export type InvestorType = 'individual' | 'institution';
export type InvestmentRange = '0-100k' | '100k-500k' | '500k-1M' | '1M-5M';
export type WalletStatus = 'active' | 'frozen' | 'suspended';
export type TransactionType = 'deposit' | 'withdrawal' | 'investment';
export type TransactionStatus = 'pending' | 'complete' | 'failed';


export interface TeamMember {
    name: string;
    role: string;
    bio: string;
    linkedin?: string;
}

export interface SocialLinks {
    website?: string;
    linkedin?: string;
    twitter?: string;
}

export interface CampaignDocuments {
    pitch_deck?: File;
    business_plan?: File;
    financials?: File;
    verification_documents: File[];
}


export interface StartupCampaign extends Record {
    user: string;
    company_name: string;
    description: string;
    industry: string;
    funding_goal: number;
    funds_raised: number;
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    team_members: Array<{
        name: string;
        role: string;
        bio: string;
        linkedin?: string;
    }>;
    social_links: {
        website?: string;
        linkedin?: string;
        twitter?: string;
    };
}

export interface DashboardData {
    user: {
        id: string;
        email: string;
        name: string;
        role: 'startup' | 'investor';
        profile_picture?: string;
        verification_status: string;
    };
    campaign: StartupCampaign | null;
}

export interface CampaignFormData {
    company_name: string;
    description: string;
    industry: IndustryType;
    funding_goal: number;
    team_members: TeamMember[];
    social_links: SocialLinks;
    documents: CampaignDocuments;
}

export interface Investment {
    id: string;
    investor: string;
    campaign: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_date: string;
    transaction_id?: string;
}

export interface InvestorProfile extends Record {
    user: string;
    profession?: string;
    verificationStatus: VerificationStatus;
    type: InvestorType;
    investment_history: Investment[];
    id_number?: string;
    kra_pin?: string;
    verification_documents?: string[];
    verification_notes?: string;
    investment_focus: IndustryType;
    investment_range: InvestmentRange;
    total_investments: number;
    active_investments: number;
    investment_preferences: {
        preferred_industries?: IndustryType[];
        min_investment?: number;
        max_investment?: number;
        risk_tolerance?: 'low' | 'medium' | 'high';
    };
}

export interface StartupProfile extends Record {
    user: string;
    company_name: string;
    business_registration_number?: string;
    description: string;
    industry: IndustryType;
    verification_documents?: string[];
    verification_status: StartupVerificationStatus;
    team_members: TeamMember[];
    logo?: string;
    social_links?: SocialLinks;
    funding_raised_total: number;
    investor_count: number;
    founded_Date?: string;
    pitch_deck?: string;
    funding_goal: number;
    funds_raised: number;
}

export interface WalletTransaction extends Record {
    user: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    reference: string;
    description?: string;
    payment_method?: string;
    metadata?: Record<string, any>;
}

export interface Wallet extends Record {
    user: string;
    balance: number;
    currency: string;
    status: WalletStatus;
    transactions?: WalletTransaction[];
}



export interface CampaignFormData {
    company_name: string;
    description: string;
    industry: IndustryType;
    funding_goal: number;
    team_members: Array<{
        name: string;
        role: string;
        bio: string;
        linkedin?: string;
    }>;
    social_links: {
        website?: string;
        linkedin?: string;
        twitter?: string;
    };
    verification_documents?: File[];
    pitch_deck?: File;
    business_registration_number?: string;
}

export interface InvestorDashboardData extends DashboardData {
    profile: InvestorProfile;
    wallet: Wallet;
    investments: Investment[];
    available_campaigns: StartupProfile[];
}

export interface StartupProfile extends Record {
    user: string;
    company_name: string;
    business_registration_number?: string;
    description: string;
    industry: IndustryType;
    verification_documents?: string[];
    verification_status: 'unverified' | 'documents_pending' | 'under_review' | 'change_requested' | 'verified' | 'rejected';
    team_members: Array<{
        name: string;
        role: string;
        bio: string;
        linkedin?: string;
    }>;
    logo?: string;
    social_links?: {
        website?: string;
        linkedin?: string;
        twitter?: string;
    };
    funding_raised_total: number;
    investor_count: number;
    founded_Date?: string;
    pitch_deck?: string;
    funding_goal: number;
    funds_raised: number;
}