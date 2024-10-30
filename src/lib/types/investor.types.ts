// src/lib/types/investor.types.ts
import type { Record } from 'pocketbase';

export type InvestorType = 'individual' | 'institutional';
export type InvestmentFocus = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
export type InvestmentRange = '0-100k' | '100k-500k' | '500k-1m' | '1m+';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface InvestorProfile {
    id: string;
    user: string;
    profession: string;
    type: InvestorType;
    verificationStatus: VerificationStatus;
    investment_history: any[];
    id_number: string;
    kra_pin: string;
    verification_documents?: string[];
    verification_notes?: string;
    investment_focus: InvestmentFocus;
    investment_range: InvestmentRange;
    total_investments: number;
    active_investments: number;
    investment_preferences: Record<string, any>;
    created: string;
    updated: string;
}

export interface Investment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'rejected';
    project: string;
    investor: string;
    startup: string;
    transaction_date: string;
    investment_type: 'seed' | 'series_a' | 'series_b' | 'other';
    expand?: Record<string, any>;
}

export interface InvestorDashboardStats {
    totalInvested: number;
    activeInvestments: number;
    portfolioCompanies: number;
    performanceByIndustry: Record<InvestmentFocus, {
        count: number;
        totalInvested: number;
    }>;
    recentInvestments: Investment[];
}

export interface InvestorDashboardState {
    profile: InvestorProfile | null;
    stats: InvestorDashboardStats | null;
    investments: Investment[];
    opportunities: any[];
    isLoading: boolean;
    error: string | null;
}