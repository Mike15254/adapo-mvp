import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import type { Project, RecentActivity } from '$lib/types/startup.types';

export const load: PageLoad = async ({ parent }) => {
    try {
        const { user, startup } = await parent();

        if (!startup) {
            return {
                projects: [],
                recentActivity: []
            };
        }

        // Fetch projects
        const projectsResponse = await pb.collection('projects').getList(1, 5, {
            filter: `startup="${startup.id}" && status="active"`,
            sort: '-created'
        });

        const projects = projectsResponse.items as Project[];

        // Compute stats from projects
        const totalFunding = projects.reduce((sum, p) => sum + (p.current_funding || 0), 0);
        const activeProjects = projects.filter(p => p.status === 'active').length;
        const totalInvestors = projects.reduce((sum, p) => sum + (p.investor_count || 0), 0);

        return {
            projects,
            stats: {
                totalFunding,
                activeProjects,
                totalInvestors,
                monthlyGrowth: 0, // Simplified for now
                investorGrowth: 0, // Simplified for now
                recentActivity: [],
                verificationStatus: startup.verification_status
            }
        };
    } catch (err) {
        console.error('Error in startup dashboard load:', err);
        throw error(500, {
            message: 'Failed to load dashboard data'
        });
    }
};