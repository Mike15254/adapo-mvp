// src/lib/services/dashboard.service.ts
import { pb } from '$lib/pocketbase';
import type { Record } from 'pocketbase';
import type { 
    StartupProfile, 
    DashboardStats, 
    StartupUpdate,
    UpdateType,
    DashboardState
} from '$lib/types/dashboard.types';
import { writable } from 'svelte/store';

// Create dashboard store
function createDashboardStore() {
    const { subscribe, set, update } = writable<DashboardState>({
        startup: null,
        stats: null,
        updates: [],
        isLoading: true,
        error: null
    });

    return {
        subscribe,
        setStartup: (startup: StartupProfile | null) => update(state => ({ ...state, startup })),
        setStats: (stats: DashboardStats | null) => update(state => ({ ...state, stats })),
        setUpdates: (updates: StartupUpdate[]) => update(state => ({ ...state, updates })),
        setError: (error: string | null) => update(state => ({ ...state, error })),
        setLoading: (isLoading: boolean) => update(state => ({ ...state, isLoading })),
        reset: () => set({
            startup: null,
            stats: null,
            updates: [],
            isLoading: false,
            error: null
        })
    };
}

export const dashboardStore = createDashboardStore();

// Helper functions
function transformStartupProfile(record: Record): StartupProfile {
    return {
        id: record.id,
        user: record.user,
        company_name: record.company_name || '',
        business_registration_number: record.business_registration_number || '',
        description: record.description || '',
        industry: record.industry || 'other',
        verification_documents: record.verification_documents,
        verification_status: record.verification_status || 'unverified',
        team_members: record.team_members || [],
        logo: record.logo,
        social_links: record.social_links || {},
        funding_raised_total: record.funding_raised_total || 0,
        investor_count: record.investor_count || 0,
        founded_Date: record.founded_Date,
        pitch_deck: record.pitch_deck,
        funding_goal: record.funding_goal || 0,
        funds_raised: record.funds_raised || 0
    };
}

function validateUpdateType(type: unknown): UpdateType {
    const validTypes = ['milestone', 'financial', 'general', 'team'];
    return validTypes.includes(type as string) ? 
        (type as UpdateType) : 
        'general';
}

// Dashboard service class
export class DashboardService {
    static async loadStartupProfile(userId: string): Promise<StartupProfile> {
        try {
            const record = await pb.collection('startup_profiles')
                .getFirstListItem(`user="${userId}"`)
                .catch(() => null);
            
            return record ? 
                transformStartupProfile(record) : 
                await this.createStartupProfile(userId);
        } catch (err) {
            console.error('Error loading startup profile:', err);
            throw err;
        }
    }

    static async createStartupProfile(userId: string): Promise<StartupProfile> {
        const record = await pb.collection('startup_profiles').create({
            user: userId,
            company_name: '',
            verification_status: 'unverified',
            industry: 'other',
            team_members: [],
            social_links: {},
            funding_raised_total: 0,
            investor_count: 0,
            funding_goal: 0,
            funds_raised: 0
        });
        
        return transformStartupProfile(record);
    }

    static async loadDashboardStats(startup: StartupProfile): Promise<DashboardStats> {
        if (!startup?.id) return this.getDefaultStats();

        const investmentsResponse = await pb.collection('investments').getList(1, 5, {
            filter: `startup="${startup.id}" && status="completed"`,
            sort: '-transaction_date',
            expand: 'investor'
        });

        return {
            totalFundsRaised: startup.funds_raised || 0,
            fundingGoal: startup.funding_goal || 0,
            progressPercentage: startup.funding_goal 
                ? Math.min((startup.funds_raised / startup.funding_goal) * 100, 100)
                : 0,
            totalInvestors: startup.investor_count || 0,
            recentInvestments: investmentsResponse.items,
            verificationStatus: startup.verification_status
        };
    }

    static async loadStartupUpdates(startupId: string): Promise<StartupUpdate[]> {
        const response = await pb.collection('startup_updates').getList(1, 5, {
            filter: `startup="${startupId}"`,
            sort: '-created',
        });

        return response.items
            .map(record => ({
                id: record.id,
                startup: record.startup,
                title: record.title?.trim() || 'Untitled Update',
                content: record.content?.trim() || 'No content provided',
                update_type: validateUpdateType(record.update_type),
                attachments: Array.isArray(record.attachments) ? record.attachments : [],
                created: record.created || new Date().toISOString()
            }))
            .filter(update => update.id && update.startup);
    }

    static getDefaultStats(): DashboardStats {
        return {
            totalFundsRaised: 0,
            fundingGoal: 0,
            progressPercentage: 0,
            totalInvestors: 0,
            recentInvestments: [],
            verificationStatus: 'unverified'
        };
    }
}