// src/lib/types/investment.types.ts
import type { Record } from 'pocketbase';

// Updated investment.types.ts
export interface Investment extends Record {
    campaign: string;
    investor: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_date: string;
    terms_accepted: boolean;
    risks_acknowledged: boolean;
    payment_reference?: string;
}

export interface CreateInvestmentData {
    campaignId: string;
    amount: number;
    termsAccepted: boolean;
    risksAcknowledged: boolean;
}

export interface InvestmentWithDetails extends Investment {
    expand?: {
        campaign?: {
            company_name: string;
            title: string;
            funding_goal: number;
            current_funding: number;
        };
        investor?: {
            name: string;
            email: string;
        };
    };
}