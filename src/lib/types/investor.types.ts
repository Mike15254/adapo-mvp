export type UserRole = 'investor' | 'startup';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type AccountStatus = 'pending' | 'active' | 'suspended';
export type Industry = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';

export interface InvestorProfile {
    id: string;
    user: string;
    type: 'individual' | 'institution';
    investment_focus: Industry;
    verification_status: VerificationStatus;
    id_number: string;
    kra_pin: string;
    total_investments: number;
    active_investments: number;
}

export interface Investment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'refunded';
    transaction_date: string;
    startup: string;
    expand?: {
        startup?: {
            company_name: string;
            industry: Industry;
        };
    };
}

export interface InvestorStats {
    totalInvested: number;
    activeInvestments: number;
    portfolioCompanies: number;
    performanceByIndustry: Record<Industry, {
        count: number;
        totalInvested: number;
    }>;
    recentInvestments: Investment[];
}

export interface InvestorDashboardState {
    profile: InvestorProfile | null;
    stats: InvestorStats | null;
    investments: Investment[];
    opportunities: any[];
    isLoading: boolean;
    error: string | null;
}