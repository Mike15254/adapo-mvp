// src/lib/types/campaign.types.ts
import type { Record } from 'pocketbase';

export interface CampaignUpdate {
    id: string;
    title: string;
    content: string;
    date: string;
    campaign: string;
}

export interface CampaignDocument {
    name: string;
    url: string;
    type: string;
}

export type CampaignStatus = 'active' | 'funded' | 'closed';



export type SortBy = 'newest' | 'funding' | 'goal';

export interface Campaign extends Record {
    id: string;
    created: string;
    updated: string;
    title: string;
    company_name: string;
    description: string;
    industry: string;
    funding_goal: number;
    current_funding: number;
    min_investment: number;
    investor_count: number;
    days_remaining: number;
    status: 'active' | 'funded' | 'closed';
    investment_type: string;
    security_type: string;
    pitch_deck?: string;
    verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
    team_members: Array<{
        name: string;
        role: string;
        bio: string;
        linkedin?: string;
    }>;
    startup: {
        company_name: string;
        logo?: string;
        team_members: Array<{
            name: string;
            role: string;
            bio: string;
            linkedin?: string;
        }>;
    };
}

export interface CampaignFilters {
    industry: string;
    minInvestment: string;
    status: string;
    sortBy: SortBy;
}