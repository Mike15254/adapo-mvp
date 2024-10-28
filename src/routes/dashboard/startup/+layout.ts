import { error, redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';
import type { AuthUser } from '$lib/types/auth.types';
import type { DashboardStats, StartupProfile } from '$lib/types/startup.types';

export const load: LayoutLoad = async ({ parent }) => {
    try {
        const { user } = await parent();
        const authUser = user as AuthUser;

        if (!authUser || authUser.role !== 'startup') {
            throw redirect(302, '/login');
        }

        // Get startup profile
        const startupProfile = await pb.collection('startupProfiles')
            .getFirstListItem(`user="${authUser.id}"`)
            .catch(() => null) as StartupProfile | null;

        return {
            user: authUser,
            stats: getDefaultStats(),
            startup: startupProfile
        };
    } catch (err) {
        console.error('Startup layout error:', err);
        throw redirect(302, '/login');
    }
};

function getDefaultStats(): DashboardStats {
    return {
        totalFunding: 0,
        activeProjects: 0,
        totalInvestors: 0,
        recentActivity: [],
        monthlyGrowth: 0,
        investorGrowth: 0,
        verificationStatus: 'unverified'
    };
}