import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { User, StartupProfile, DashboardStats } from '$lib/types/dashboard.types';
import type { ClientResponseError } from 'pocketbase';

export const load: LayoutLoad = async ({ parent }) => {
    // Get parent data and handle potential errors
    const parentData = await parent().catch(() => ({ user: null }));
    const authUser = parentData.user as User | null;

    // Check authentication
    if (!authUser) {
        throw redirect(302, '/login');
    }

    // Verify correct role
    if (authUser.role !== 'startup') {
        throw redirect(302, '/dashboard/investor');
    }

    try {
        // Try to get startup profile
        const startupProfileRecord = await pb.collection('startup_profiles')
            .getFirstListItem(`user="${authUser.id}"`)
            .catch(() => null);

        // If no profile exists, redirect to onboarding
        if (!startupProfileRecord) {
            // Only redirect to onboarding if authenticated
            if (pb.authStore.isValid) {
                throw redirect(302, '/onboarding');
            }
            throw redirect(302, '/login');
        }

        // Transform the record to our type
        const startupProfile: StartupProfile = {
            id: startupProfileRecord.id,
            user: startupProfileRecord.user,
            company_name: startupProfileRecord.company_name || '',
            business_registration_number: startupProfileRecord.business_registration_number || '',
            description: startupProfileRecord.description || '',
            industry: startupProfileRecord.industry || 'other',
            verification_documents: startupProfileRecord.verification_documents,
            verification_status: startupProfileRecord.verification_status || 'unverified',
            team_members: startupProfileRecord.team_members || [],
            logo: startupProfileRecord.logo,
            social_links: startupProfileRecord.social_links || {},
            funding_raised_total: startupProfileRecord.funding_raised_total || 0,
            investor_count: startupProfileRecord.investor_count || 0,
            founded_Date: startupProfileRecord.founded_Date,
            pitch_deck: startupProfileRecord.pitch_deck,
            funding_goal: startupProfileRecord.funding_goal || 0,
            funds_raised: startupProfileRecord.funds_raised || 0
        };

        // Calculate stats
        const stats = await calculateStats(startupProfile).catch(() => getDefaultStats());

        return {
            user: authUser,
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
            user: authUser,
            startup: null,
            stats: getDefaultStats()
        };
    }
};

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