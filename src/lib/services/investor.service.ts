// src/lib/services/investor.service.ts
import { pb } from '$lib/pocketbase';
import type { Record } from 'pocketbase';
import type { 
    InvestorProfile,
    Investment,
    InvestorStats,
    InvestorDashboardState,
    Industry
} from '../types/investor.types';
import { writable } from 'svelte/store';

// Create investor store
function createInvestorStore() {
    const { subscribe, set, update } = writable<InvestorDashboardState>({
        profile: null,
        stats: null,
        investments: [],
        opportunities: [],
        isLoading: false,
        error: null
    });

    return {
        subscribe,
        setProfile: (profile: InvestorProfile | null) => 
            update(state => ({ ...state, profile })),
        setStats: (stats: InvestorStats | null) => 
            update(state => ({ ...state, stats })),
        setInvestments: (investments: Investment[]) =>
            update(state => ({ ...state, investments })),
        setLoading: (isLoading: boolean) => 
            update(state => ({ ...state, isLoading })),
        setError: (error: string | null) => 
            update(state => ({ ...state, error })),
        reset: () => set({
            profile: null,
            stats: null,
            investments: [],
            opportunities: [],
            isLoading: false,
            error: null
        })
    };
}

export const investorStore = createInvestorStore();

function calculatePerformanceByIndustry(investments: Investment[]): Record<Industry, { count: number; totalInvested: number }> {
    const initial = {
        technology: { count: 0, totalInvested: 0 },
        healthcare: { count: 0, totalInvested: 0 },
        finance: { count: 0, totalInvested: 0 },
        education: { count: 0, totalInvested: 0 },
        agriculture: { count: 0, totalInvested: 0 },
        other: { count: 0, totalInvested: 0 }
    };

    return investments.reduce((acc, inv) => {
        if (inv.expand?.startup?.industry) {
            const industry = inv.expand.startup.industry;
            acc[industry].count++;
            acc[industry].totalInvested += inv.amount;
        }
        return acc;
    }, initial);
}

export class InvestorService {
    static async loadDashboardData(userId: string) {
        investorStore.setLoading(true);
        try {
            const [profile, investments] = await Promise.all([
                this.loadInvestorProfile(userId),
                this.loadInvestments(userId)
            ]);

            if (!profile) {
                throw new Error('Investor profile not found');
            }

            const stats = this.calculateStats(profile, investments);

            investorStore.setProfile(profile);
            investorStore.setStats(stats);
            investorStore.setInvestments(investments);
            investorStore.setError(null);

            return { profile, stats, investments };
        } catch (error: any) {
            investorStore.setError(error.message);
            return {
                profile: null,
                stats: this.getDefaultStats(),
                investments: []
            };
        } finally {
            investorStore.setLoading(false);
        }
    }

    private static async loadInvestorProfile(userId: string): Promise<InvestorProfile | null> {
        const record = await pb.collection('investors_profiles')
            .getFirstListItem(`user="${userId}"`);

        return record ? {
            id: record.id,
            user: record.user,
            type: record.type || 'individual',
            investment_focus: record.investment_focus || 'other',
            verification_status: record.verification_status || 'unverified',
            id_number: record.id_number || '',
            kra_pin: record.kra_pin || '',
            total_investments: record.total_investments || 0,
            active_investments: record.active_investments || 0
        } : null;
    }

    private static async loadInvestments(userId: string): Promise<Investment[]> {
        const records = await pb.collection('investments').getList(1, 50, {
            filter: `investor="${userId}"`,
            sort: '-transaction_date',
            expand: 'startup'
        });

        return records.items.map(record => ({
            id: record.id,
            amount: record.amount || 0,
            status: record.status || 'pending',
            transaction_date: record.transaction_date || record.created,
            startup: record.startup,
            expand: {
                startup: record.expand?.startup ? {
                    company_name: record.expand.startup.company_name,
                    industry: record.expand.startup.industry
                } : undefined
            }
        }));
    }

    private static calculateStats(profile: InvestorProfile, investments: Investment[]): InvestorStats {
        return {
            totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
            activeInvestments: profile.active_investments,
            portfolioCompanies: new Set(investments.map(inv => inv.startup)).size,
            performanceByIndustry: calculatePerformanceByIndustry(investments),
            recentInvestments: investments.slice(0, 5)
        };
    }

    static getDefaultStats(): InvestorStats {
        return {
            totalInvested: 0,
            activeInvestments: 0,
            portfolioCompanies: 0,
            performanceByIndustry: {
                technology: { count: 0, totalInvested: 0 },
                healthcare: { count: 0, totalInvested: 0 },
                finance: { count: 0, totalInvested: 0 },
                education: { count: 0, totalInvested: 0 },
                agriculture: { count: 0, totalInvested: 0 },
                other: { count: 0, totalInvested: 0 }
            },
            recentInvestments: []
        };
    }
}