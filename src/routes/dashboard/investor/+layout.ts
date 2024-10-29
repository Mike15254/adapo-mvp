import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { InvestorProfile, InvestorDashboardStats, Investment, InvestmentFocus } from '$lib/types/investor.types';
import type { RecordModel } from 'pocketbase';

function transformInvestorProfile(record: RecordModel): InvestorProfile {
    return {
        id: record.id,
        user: record.user,
        profession: record.profession,
        type: record.type || 'individual',
        verificationStatus: record.verificationStatus || 'unverified',
        investment_history: record.investment_history,
        id_number: record.id_number,
        kra_pin: record.kra_pin,
        verification_documents: record.verification_documents,
        verification_notes: record.verification_notes,
        investment_focus: record.investment_focus || 'other',
        investment_range: record.investment_range || '0-100k',
        total_investments: record.total_investments || 0,
        active_investments: record.active_investments || 0,
        investment_preferences: record.investment_preferences || {},
        created: record.created,
        updated: record.updated
    };
}

async function createInvestorProfile(userId: string): Promise<InvestorProfile> {
    try {
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
    } catch (err) {
        console.error('Error creating investor profile:', err);
        throw err;
    }
}

async function getOrCreateInvestorProfile(userId: string): Promise<InvestorProfile> {
    try {
        const record = await pb.collection('investors_profiles')
            .getFirstListItem(`user="${userId}"`);
        return transformInvestorProfile(record);
    } catch (err: any) {
        if (err.status === 404) {
            return await createInvestorProfile(userId);
        }
        throw err;
    }
}

function transformInvestment(record: RecordModel): Investment {
    return {
        id: record.id,
        amount: record.amount || 0,
        status: record.status || 'pending',
        project: record.project || '',
        investor: record.investor || '',
        startup: record.startup || '',
        transaction_date: record.transaction_date || '',
        investment_type: record.investment_type || 'seed',
        expand: record.expand
    };
}

function getDefaultStats(): InvestorDashboardStats {
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

export const load: LayoutLoad = async ({ parent }) => {
    try {
        const { user } = await parent();

        if (!user || user.role !== 'investor') {
            throw redirect(302, '/login');
        }

        try {
            // Get or create investor profile
            const investorProfile = await getOrCreateInvestorProfile(user.id);

            // Fetch investments
            const investmentsResponse = await pb.collection('investments').getList(1, 100, {
                filter: `investor="${user.id}"`,
                sort: '-transaction_date',
                expand: 'startup,project'
            });

            const investments = investmentsResponse.items.map(transformInvestment);

            // Calculate stats
            const stats: InvestorDashboardStats = {
                totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
                activeInvestments: investments.filter(inv => inv.status === 'completed').length,
                portfolioCompanies: new Set(investments.map(inv => inv.startup)).size,
                performanceByIndustry: investments.reduce((acc, inv) => {
                    const industry = (inv.expand?.startup?.industry as InvestmentFocus) || 'other';
                    acc[industry].count++;
                    acc[industry].totalInvested += inv.amount;
                    return acc;
                }, getDefaultStats().performanceByIndustry),
                recentInvestments: investments.slice(0, 5)
            };

            return {
                profile: investorProfile,
                stats,
                investments
            };

        } catch (err) {
            console.error('Error loading investor data:', err);
            if (err.status === 404) {
                // If profile doesn't exist and creation failed
                throw redirect(302, '/onboarding');
            }
            return {
                profile: null,
                stats: getDefaultStats(),
                investments: []
            };
        }
    } catch (err) {
        console.error('Layout load error:', err);
        throw redirect(302, '/login');
    }
};