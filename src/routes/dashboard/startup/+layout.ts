import type { LayoutLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

// Update the type to match actual transaction types
interface RecentActivity {
    type: 'investment' | 'update' | 'milestone' | 'verification' | 'general' | 'financial';
    description: string;
    date: string;
    relatedId?: string;
}

interface DashboardStats {
    totalFunding: number;
    activeProjects: number;
    totalInvestors: number;
    recentActivity: RecentActivity[];
    monthlyGrowth: number;
    investorGrowth: number;
    verificationStatus: string;
}

export const load: LayoutLoad = async ({ fetch, parent }) => {
    try {
        const { user } = await parent();

        // Check authentication and role
        if (!user || user.role !== 'startup') {
            throw redirect(302, '/login');
        }

        try {
            // Get startup profile data
            const startupProfile = await pb.collection('startupProfiles').getFirstListItem(`user="${user.id}"`);
            
            if (!startupProfile) {
                // If no startup profile exists, return default values
                return {
                    user,
                    stats: getDefaultStats(),
                    startup: null,
                    projects: []
                };
            }

            // Fetch active projects
            const projectsResponse = await pb.collection('projects').getList(1, 10, {
                filter: `startup="${startupProfile.id}" && status="active"`,
                sort: '-created'
            });

            // Fetch recent transactions
            const transactionsResponse = await pb.collection('transactions').getList(1, 5, {
                filter: `project.startup="${startupProfile.id}"`,
                sort: '-transaction_date',
                expand: 'project,user'
            });

            // Fetch project updates
            const updatesResponse = await pb.collection('projectUpdates').getList(1, 5, {
                filter: `project.startup="${startupProfile.id}"`,
                sort: '-date',
                expand: 'project'
            });

            // Calculate metrics
            const totalFunding = startupProfile.funding_raised_total || 0;
            const activeProjectsCount = projectsResponse.totalItems;
            const totalInvestors = startupProfile.investor_count || 0;

            // Compile recent activity with type assertion
            const recentActivity: RecentActivity[] = [
                ...transactionsResponse.items.map(t => ({
                    type: 'investment' as const,
                    description: `New investment of ${formatCurrency(t.amount)} received for ${t.expand?.project?.title || 'project'}`,
                    date: t.transaction_date,
                    relatedId: t.id
                })),
                ...updatesResponse.items.map(u => ({
                    type: (u.type || 'update') as RecentActivity['type'],
                    description: `Update posted: ${u.title}`,
                    date: u.date,
                    relatedId: u.id
                }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

            return {
                user,
                stats: {
                    totalFunding,
                    activeProjects: activeProjectsCount,
                    totalInvestors,
                    recentActivity,
                    monthlyGrowth: calculateMonthlyGrowth(transactionsResponse.items),
                    investorGrowth: calculateInvestorGrowth(totalInvestors),
                    verificationStatus: startupProfile.verification_status
                },
                startup: startupProfile,
                projects: projectsResponse.items
            };

        } catch (e) {
            if (e.status === 404) {
                // Return default values if no data is found
                return {
                    user,
                    stats: getDefaultStats(),
                    startup: null,
                    projects: [],
                    error: 'No startup profile found'
                };
            }
            throw e;
        }
    } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (err.status === 401 || err.status === 403) {
            throw redirect(302, '/login');
        }
        throw error(500, {
            message: 'Failed to load dashboard data'
        });
    }
};

// Helper function to get default stats
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

// Helper functions
function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0
    }).format(amount);
}

function calculateMonthlyGrowth(transactions: any[]): number {
    if (!transactions.length) return 0;
    
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
    
    const thisMonthTotal = transactions
        .filter(t => new Date(t.transaction_date) > lastMonth)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const lastMonthTotal = transactions
        .filter(t => {
            const date = new Date(t.transaction_date);
            return date <= lastMonth && date > new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    if (!lastMonthTotal) return 0;
    return ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
}

function calculateInvestorGrowth(currentCount: number): number {
    // Implement actual growth calculation logic here
    // For now, return 0 if no investors
    return currentCount > 0 ? 5 : 0; // Example: 5% growth if there are investors
}