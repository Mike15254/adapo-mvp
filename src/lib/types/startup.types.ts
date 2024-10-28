export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type UpdateType = 'milestone' | 'financial' | 'team' | 'general';

export interface StartupUpdate {
    id: string;
    startup: string;
    title: string;
    content: string;
    update_type: UpdateType;
    attachments?: string[];
    created: string;
    updated?: string;
}

export interface UpdatesPageData {
    startup: StartupProfile | null;
    updates: StartupUpdate[];
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
export interface Project {
    id: string;
    title: string;
    description: string;
    funding_goal: number;
    current_funding: number;
    status: 'active' | 'pending' | 'draft' | 'completed' | 'funded' | 'closed';
    end_date: string;
    start_date: string;
    startup: string;
    investor_count: number;
}

export interface RecentActivity {
    type: 'investment' | 'update';
    description: string;
    date: string;
    relatedId?: string;
}

export interface DashboardStats {
    totalFunding: number;
    activeProjects: number;
    totalInvestors: number;
    recentActivity: RecentActivity[];
    monthlyGrowth: number;
    investorGrowth: number;
    verificationStatus: string;
}

export interface LayoutData {
    user: any;
    stats: DashboardStats;
    startup: StartupProfile | null;
}