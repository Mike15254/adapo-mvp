import { pb } from '$lib/pocketbase';
import type { Record } from 'pocketbase';
import type { 
    StartupProfile, 
    DashboardStats, 
    StartupUpdate,
    UpdateType,
    Investment,
    DashboardState
} from '../types/dashboard.types';
import { writable } from 'svelte/store';

// Helper functions
function transformInvestment(record: Record): Investment {
    return {
        id: record.id,
        amount: record.amount || 0,
        status: record.status || 'pending',
        investor: record.investor,
        startup: record.startup,
        recentInvestments: record.recent_investments || [],
        transaction_date: record.transaction_date || record.created
    };
}

function transformStartupProfile(record: Record): StartupProfile {
    return {
        id: record.id,
        user: record.user,
        company_name: record.company_name || '',
        business_registration_number: record.business_registration_number || '',
        description: record.description || '',
        industry: record.industry || 'other',
        verification_status: record.verification_status || 'unverified',
        funding_goal: record.funding_goal || 0,
        funds_raised: record.funds_raised || 0,
        investor_count: record.investor_count || 0,
        pitch_deck: record.pitch_deck,
        logo: record.logo,
        team_members: record.team_members || [],
        social_links: record.social_links || {}
    };
}

// Create dashboard store
function createDashboardStore() {
    const { subscribe, set, update } = writable<DashboardState>({
        startup: null,
        stats: null,
        updates: [],
        isLoading: false,
        error: null
    });

    return {
        subscribe,
        setStartup: (startup: StartupProfile | null) => 
            update(state => ({ ...state, startup })),
        setStats: (stats: DashboardStats | null) => 
            update(state => ({ ...state, stats })),
        setUpdates: (updates: StartupUpdate[]) =>
            update(state => ({ ...state, updates })),
        setLoading: (isLoading: boolean) => 
            update(state => ({ ...state, isLoading })),
        setError: (error: string | null) => 
            update(state => ({ ...state, error })),
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

export class DashboardService {
    static async loadStartupProfile(userId: string): Promise<StartupProfile | null> {
        try {
            const record = await pb.collection('startup_profiles')
                .getFirstListItem(`user="${userId}"`);
            return transformStartupProfile(record);
        } catch (error) {
            console.error('Failed to load startup profile:', error);
            return null;
        }
    }

    static async loadDashboardStats(startup: StartupProfile): Promise<DashboardStats> {
        try {
            const investments = await pb.collection('investments').getList(1, 5, {
                filter: `startup="${startup.id}" && status="completed"`,
                sort: '-transaction_date'
            });

            const recentInvestments = investments.items.map(transformInvestment);

            return {
                totalFundsRaised: startup.funds_raised,
                fundingGoal: startup.funding_goal,
                progressPercentage: startup.funding_goal ? 
                    Math.min((startup.funds_raised / startup.funding_goal) * 100, 100) : 0,
                totalInvestors: startup.investor_count,
                recentInvestments,
                verificationStatus: startup.verification_status
            };
        } catch (error) {
            return this.getDefaultStats();
        }
    }

    static async loadStartupUpdates(startupId: string): Promise<StartupUpdate[]> {
        try {
            const records = await pb.collection('startup_updates').getList(1, 5, {
                filter: `startup="${startupId}"`,
                sort: '-created'
            });

            return records.items.map(record => ({
                id: record.id,
                startup: record.startup,
                title: record.title || '',
                content: record.content || '',
                update_type: (record.update_type as UpdateType) || 'general',
                created: record.created
            }));
        } catch (error) {
            console.error('Failed to load updates:', error);
            return [];
        }
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

    static async createUpdate(data: Omit<StartupUpdate, 'id' | 'created'>) {
        return await pb.collection('startup_updates').create(data);
    }

    static async updateProfile(id: string, data: Partial<StartupProfile>) {
        const record = await pb.collection('startup_profiles').update(id, data);
        const updated = transformStartupProfile(record);
        dashboardStore.setStartup(updated);
        return updated;
    }
}