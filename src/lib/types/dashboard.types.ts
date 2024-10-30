export type UserRole = 'investor' | 'startup';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'pending' | 'active' | 'suspended';
export type Industry = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';

// Core startup profile (extends from onboarding)
export interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: Industry;
    verification_status: VerificationStatus;
    
    // Additional dashboard-specific fields
    funding_goal: number;
    funds_raised: number;
    investor_count: number;
    pitch_deck?: string;
    logo?: string;
    team_members: {
        name: string;
        role: string;
    }[];
    social_links: {
        website?: string;
        linkedin?: string;
        twitter?: string;
    };
}

export type UpdateType = 'milestone' | 'financial' | 'team' | 'general';

export interface StartupUpdate {
    id: string;
    startup: string;
    title: string;
    content: string;
    update_type: UpdateType;
    created: string;
}

export interface Investment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'refunded';
    investor: string;
    startup: string;
    transaction_date: string;
    recentInvestments: Investment[];

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