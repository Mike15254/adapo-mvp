// src/routes/dashboard/startup/+page.ts
import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import { ClientResponseError } from 'pocketbase';  // Remove 'type' to use as value

interface Project {
    id: string;
    title: string;
    description: string;
    funding_goal: number;
    current_funding: number;
    status: 'draft' | 'active' | 'funded' | 'closed';
    end_date: string;
    start_date: string;
    startup: string;
    industry: string;
    min_investment: number;
    campaign_duration: number;
    pitch_deck?: string;
    raised?: number;
    approval_status?: string;
    approval_notes?: string;
    project_video?: string;
    project_images?: string[];
    project_timeline?: any;
    team_members?: any;
}

interface StartupProfile {
    id: string;
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: string;
    verification_status: string;
    verification_documents: string[];
    team_members: any;
    logo?: string;
    funding_raised_total?: number;
    investor_count?: number;
}

interface Transaction {
    id: string;
    amount: number;
    status: string;
    user: string;
    project: string;
    transaction_date: string;
    payment_method?: string;
    transaction_id?: string;
    expand?: {
        project?: Project;
    };
}

interface DashboardStats {
    totalFunding: number;
    activeProjects: number;
    totalInvestors: number;
    monthlyGrowth: number;
    investorGrowth: number;
}

interface DashboardData {
    projects: Project[];
    stats: DashboardStats;
    startup: StartupProfile | null;
}

export const load: PageLoad = async ({ parent }): Promise<DashboardData> => {
    try {
        const { user } = await parent();

        if (!user) {
            throw error(401, 'Unauthorized');
        }

        try {
            // Get startup profile
            const startupProfile = await pb.collection('startupProfiles').getFirstListItem(`user="${user.id}"`) as StartupProfile;
            
            if (!startupProfile) {
                return getDefaultDashboardData();
            }

            // Fetch projects from the correct collection
            let projectsData: Project[] = [];
            try {
                const projectsResponse = await pb.collection('projects').getList(1, 5, {
                    filter: `startup="${startupProfile.id}"`,
                    sort: '-created'
                });
                projectsData = projectsResponse.items as Project[];
            } catch (err) {
                console.error('Error fetching projects:', err);
                projectsData = [];
            }

            // Fetch transactions
            let totalFunding = 0;
            let totalInvestors = 0;
            try {
                const transactionsResponse = await pb.collection('transactions').getList(1, 1000, {
                    filter: `status="completed"`,
                    expand: 'project'
                });

                const startupTransactions = (transactionsResponse.items as Transaction[]).filter(
                    transaction => transaction.expand?.project?.startup === startupProfile.id
                );

                totalFunding = startupTransactions.reduce(
                    (sum, transaction) => sum + (transaction.amount || 0), 
                    0
                );

                const uniqueInvestors = new Set(
                    startupTransactions.map(transaction => transaction.user)
                );
                totalInvestors = uniqueInvestors.size;

            } catch (err) {
                console.error('Error fetching transactions:', err);
            }

            const activeProjects = projectsData.filter(
                project => project.status === 'active'
            ).length;

            return {
                projects: projectsData,
                stats: {
                    totalFunding,
                    activeProjects,
                    totalInvestors,
                    monthlyGrowth: await calculateMonthlyGrowth(startupProfile.id),
                    investorGrowth: 0
                },
                startup: startupProfile
            };

        } catch (err) {
            if (err instanceof ClientResponseError && err.status === 404) {
                return getDefaultDashboardData();
            }
            throw err;
        }

    } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (err instanceof ClientResponseError) {
            if (err.status === 401) {
                throw error(401, 'Unauthorized');
            }
        }
        throw error(500, {
            message: 'Failed to load dashboard data'
        });
    }
};

function getDefaultDashboardData(): DashboardData {
    return {
        projects: [],
        stats: {
            totalFunding: 0,
            activeProjects: 0,
            totalInvestors: 0,
            monthlyGrowth: 0,
            investorGrowth: 0
        },
        startup: null
    };
}

async function calculateMonthlyGrowth(startupId: string): Promise<number> {
    try {
        const now = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        try {
            const currentMonthTransactions = await pb.collection('transactions').getList(1, 1000, {
                filter: `status="completed" && created >= "${lastMonth.toISOString()}"`,
                expand: 'project'
            });

            const previousMonthStart = new Date(lastMonth);
            previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
            
            const previousMonthTransactions = await pb.collection('transactions').getList(1, 1000, {
                filter: `status="completed" && created >= "${previousMonthStart.toISOString()}" && created < "${lastMonth.toISOString()}"`,
                expand: 'project'
            });

            const currentMonthAmount = (currentMonthTransactions.items as Transaction[])
                .filter(t => t.expand?.project?.startup === startupId)
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            const previousMonthAmount = (previousMonthTransactions.items as Transaction[])
                .filter(t => t.expand?.project?.startup === startupId)
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            if (previousMonthAmount === 0) return 0;
            return ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100;

        } catch (err) {
            console.error('Error calculating growth:', err);
            return 0;
        }

    } catch (err) {
        console.error('Error in calculateMonthlyGrowth:', err);
        return 0;
    }
}