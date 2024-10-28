export type UpdateType = 'milestone' | 'financial' | 'team' | 'general';

export interface StartupUpdate {
    id: string;
    startup: string;
    title: string;
    content: string;
    update_type: UpdateType;
    attachments?: string[];
    created: string;
}

export interface UpdatesPageData {
    startup: StartupProfile | null;
    updates: StartupUpdate[];
    error?: string;
}
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'investor' | 'startup';
    profile_picture?: string;
    account_status: 'pending' | 'active' | 'suspended';
    verification_status: 'unverified' | 'pending' | 'verified';
    registration_date: string;
}

export interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
    verification_documents?: string;
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    team_members: TeamMember[];
    logo?: string;
    social_links?: SocialLinks;
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
    update_type: 'milestone' | 'financial' | 'general' | 'team';
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
    verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
}

export interface LayoutData {
    user: User;
    startup: StartupProfile | null;
    stats: DashboardStats;
}