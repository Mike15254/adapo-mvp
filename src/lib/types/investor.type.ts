// src/lib/types/investment.types.ts
import type { Record } from 'pocketbase';

export interface Investment extends Record {
    campaign: string;
    investor: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_date: string;
}

export interface CreateInvestmentData {
    campaignId: string;
    amount: number;
}

export interface InvestmentWithDetails extends Investment {
    expand?: {
        campaign?: {
            company_name: string;
            title: string;
        };
        investor?: {
            name: string;
            email: string;
        };
    };
}