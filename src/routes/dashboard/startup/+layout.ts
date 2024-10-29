import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { User, StartupProfile, DashboardStats } from '$lib/types/dashboard.types';
import type { RecordModel } from 'pocketbase';

function transformStartupProfile(record: RecordModel): StartupProfile {
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

async function createStartupProfile(userId: string): Promise<StartupProfile> {
    try {
        const record = await pb.collection('startup_profiles').create({
            user: userId,
            company_name: '',
            business_registration_number: '',
            industry: '',
            verification_documents: [],
            verification_status: 'unverified',
            team_members: [],
            logo: '',
            social_links: {},
            funding_raised_total: 0,
            investor_count: 0,
            founded_Date: '',
            pitch_deck: '',
            funding_goal: 0,
            funds_raised: 0
        });
        
        return transformStartupProfile(record);
    } catch (err) {
        console.error('Error creating startup profile:', err);
        throw err;
    }
}

async function getOrCreateStartupProfile(userId: string): Promise<StartupProfile> {
    try {
        const record = await pb.collection('startup_profiles')
            .getFirstListItem(`user="${userId}"`)
            .catch(() => null);
        return record ? transformStartupProfile(record) : await createStartupProfile(userId);
    } catch (err) {
        console.error('Error getting startup profile:', err);
        throw err;    
    }
}

export const load: LayoutLoad = async ({ parent }) => {
    try {
        const { user } = await parent();

        if (!user || user.role !== 'startup') {
            throw redirect(302, '/login');
        }

    try {
        // Try to get startup profile
        const startupProfile = await getOrCreateStartupProfile(user.id);

        // If no profile exists, redirect to onboarding
        if (!startupProfile) {
            // Only redirect to onboarding if authenticated
            if (pb.authStore.isValid) {
                throw redirect(302, '/onboarding');
            }
            throw redirect(302, '/login');
        }

        

        // Calculate stats
        const stats = await calculateStats(startupProfile).catch(() => getDefaultStats());

        return {
            startup: startupProfile,
            stats
        };

    } catch (err) {
        if (err instanceof Response) {
            throw err; // Rethrow redirects
        }
        
        // Handle other errors
        console.error('Layout load error:', err);
        if (!pb.authStore.isValid) {
            throw redirect(302, '/login');
        }
        
        // Return default data if authenticated but error occurred
        return {
            user: user,
            startup: null,
            stats: getDefaultStats()
        };
    }
} catch (err) {
    console.error('Error loading startup data:', err);
    return {
        user: pb.authStore.model,
        startup: null,
        stats: getDefaultStats()
    };
}
}

async function calculateStats(startup: StartupProfile): Promise<DashboardStats> {
    try {
        // Only fetch investments if we have a valid startup
        if (!startup?.id) {
            return getDefaultStats();
        }

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
            recentInvestments: investmentsResponse.items.map(record => ({
                id: record.id,
                amount: record.amount || 0,
                status: record.status || 'pending',
                project: record.project,
                investor: record.investor,
                transaction_date: record.transaction_date,
                startup: record.startup
            })),
            verificationStatus: startup.verification_status
        };
    } catch (error) {
        console.error('Error calculating stats:', error);
        return getDefaultStats();
    }
}

function getDefaultStats(): DashboardStats {
    return {
        totalFundsRaised: 0,
        fundingGoal: 0,
        progressPercentage: 0,
        totalInvestors: 0,
        recentInvestments: [],
        verificationStatus: 'unverified'
    };
}