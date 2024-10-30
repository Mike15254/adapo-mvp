// src/lib/services/investor.service.ts
import { pb } from '$lib/pocketbase';
import type { Record } from 'pocketbase';
import type { 
    InvestorProfile, 
    InvestorDashboardStats, 
    Investment,
    InvestmentFocus,
    InvestorDashboardState 
} from '$lib/types/investor.types';
import { writable, type Writable } from 'svelte/store';

// Helper function to get default stats
export function getDefaultStats(): InvestorDashboardStats {
    const industries: Record<InvestmentFocus, { count: number; totalInvested: number }> = {
        technology: { count: 0, totalInvested: 0 },
        healthcare: { count: 0, totalInvested: 0 },
        finance: { count: 0, totalInvested: 0 },
        education: { count: 0, totalInvested: 0 },
        agriculture: { count: 0, totalInvested: 0 },
        other: { count: 0, totalInvested: 0 }
    };

    return {
        totalInvested: 0,
        activeInvestments: 0,
        portfolioCompanies: 0,
        performanceByIndustry: industries,
        recentInvestments: []
    };
}

// Create dashboard store with proper typing
function createDashboardStore(): Writable<InvestorDashboardState> & {
    setProfile: (profile: InvestorProfile | null) => void;
    setStats: (stats: InvestorDashboardStats | null) => void;
    setInvestments: (investments: Investment[]) => void;
    setOpportunities: (opportunities: any[]) => void;
    setError: (error: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    reset: () => void;
} {
    const { subscribe, set, update } = writable<InvestorDashboardState>({
        profile: null,
        stats: getDefaultStats(),  // Initialize with default stats
        investments: [],
        opportunities: [],
        isLoading: true,
        error: null
    });

    return {
        subscribe,
        set,
        update,
        setProfile: (profile: InvestorProfile | null) => 
            update(state => ({ ...state, profile })),
        setStats: (stats: InvestorDashboardStats | null) => 
            update(state => ({ ...state, stats })),
        setInvestments: (investments: Investment[]) => 
            update(state => ({ ...state, investments })),
        setOpportunities: (opportunities: any[]) => 
            update(state => ({ ...state, opportunities })),
        setError: (error: string | null) => 
            update(state => ({ ...state, error })),
        setLoading: (isLoading: boolean) => 
            update(state => ({ ...state, isLoading })),
        reset: () => set({
            profile: null,
            stats: getDefaultStats(),
            investments: [],
            opportunities: [],
            isLoading: false,
            error: null
        })
    };
}

export const investorStore = createDashboardStore();

// Helper functions
function transformInvestorProfile(record: Record): InvestorProfile {
    return {
        id: record.id,
        user: record.user,
        profession: record.profession || '',
        type: record.type || 'individual',
        verificationStatus: record.verificationStatus || 'unverified',
        investment_history: record.investment_history || [],
        id_number: record.id_number || '',
        kra_pin: record.kra_pin || '',
        verification_documents: record.verification_documents || [],
        verification_notes: record.verification_notes || '',
        investment_focus: record.investment_focus || 'other',
        investment_range: record.investment_range || '0-100k',
        total_investments: record.total_investments || 0,
        active_investments: record.active_investments || 0,
        investment_preferences: record.investment_preferences || {},
        created: record.created,
        updated: record.updated
    };
}

// Export the service class
export class InvestorDashboardService {
    static async loadInvestorProfile(userId: string): Promise<InvestorProfile> {
        try {
            const record = await pb.collection('investors_profiles')
                .getFirstListItem(`user="${userId}"`);
            return transformInvestorProfile(record);
        } catch (err: any) {
            if (err.status === 404) {
                return await this.createInvestorProfile(userId);
            }
            throw err;
        }
    }

    static async createInvestorProfile(userId: string): Promise<InvestorProfile> {
        const record = await pb.collection('investors_profiles').create({
            user: userId,
            type: 'individual',
            verificationStatus: 'unverified',
            investment_focus: 'other',
            investment_range: '0-100k',
            total_investments: 0,
            active_investments: 0,
            investment_preferences: {},
            investment_history: []
        });
        
        return transformInvestorProfile(record);
    }

    static async loadDashboardData(userId: string) {
        investorStore.setLoading(true);
        
        try {
            const profile = await this.loadInvestorProfile(userId);
            
            const [investmentsResponse, opportunitiesResponse] = await Promise.all([
                pb.collection('investments').getList(1, 50, {
                    filter: `investor="${userId}"`,
                    sort: '-transaction_date',
                    expand: 'startup,project'
                }),
                pb.collection('projects').getList(1, 5, {
                    filter: 'status="active"',
                    sort: '-created'
                })
            ]);

            const investments = investmentsResponse.items;
            const stats: InvestorDashboardStats = {
                totalInvested: investments.reduce((sum, inv) => sum + (inv.amount || 0), 0),
                activeInvestments: investments.filter(inv => inv.status === 'completed').length,
                portfolioCompanies: new Set(investments.map(inv => inv.startup)).size,
                performanceByIndustry: investments.reduce((acc, inv) => {
                    const industry = (inv.expand?.startup?.industry as InvestmentFocus) || 'other';
                    if (!acc[industry]) {
                        acc[industry] = { count: 0, totalInvested: 0 };
                    }
                    acc[industry].count++;
                    acc[industry].totalInvested += inv.amount || 0;
                    return acc;
                }, getDefaultStats().performanceByIndustry),
                recentInvestments: investments.slice(0, 5)
            };

            investorStore.setProfile(profile);
            investorStore.setStats(stats);
            investorStore.setInvestments(investments);
            investorStore.setOpportunities(opportunitiesResponse.items);
            
            return { 
                profile, 
                stats, 
                investments, 
                opportunities: opportunitiesResponse.items 
            };
        } catch (err) {
            console.error('Error loading investor dashboard:', err);
            investorStore.setError('Failed to load dashboard data');
            throw err;
        } finally {
            investorStore.setLoading(false);
        }
    }

    static getDefaultStats = getDefaultStats;
}