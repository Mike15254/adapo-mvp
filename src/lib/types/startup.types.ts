export interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: string;
    verification_status: 'unverified' | 'pending' | 'verified';
    funding_raised_total: number;
    investor_count: number;
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