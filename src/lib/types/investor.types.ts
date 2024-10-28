export type InvestorType = 'individual' | 'institution';
export type InvestmentFocus = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
export type InvestmentRange = '0-100k' | '100k-500k' | '500k-1M' | '1M-5M';
export type InvestmentStatus = 'pending' | 'completed' | 'refunded';
export type VerificationStatus = 'pending' | 'verified' | 'unverified';
export type InvestmentType = 'seed' | 'series_a' | 'series_b' | 'growth';

export interface InvestorProfile {
    id: string;
    user: string;
    profession?: string;
    type: InvestorType;
    verificationStatus: VerificationStatus;
    investment_history?: any;
    id_number?: string;
    kra_pin?: string;
    verification_documents?: string;
    verification_notes?: string;
    investment_focus: InvestmentFocus;
    investment_range: InvestmentRange;
    total_investments: number;
    active_investments: number;
    investment_preferences?: {
        min_amount?: number;
        max_amount?: number;
        preferred_sectors?: string[];
        investment_stage?: string[];
    };
    created?: string;
    updated?: string;
}

export interface Investment {
    id: string;
    amount: number;
    status: InvestmentStatus;
    project: string;
    investor: string;
    startup: string;
    transaction_date: string;
    investment_type: InvestmentType;
    expand?: {
        startup?: {
            company_name: string;
            industry: string;
            funding_goal: number;
            funds_raised: number;
        };
        project?: {
            title: string;
            status: string;
        };
    };
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