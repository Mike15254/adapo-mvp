import { startupService } from "$lib/services/startup.service";

// src/routes/(dashboard)/startup/investors/+page.ts
export const load = (async ({ parent }) => {
    const { campaign } = await parent();
    
    if (!campaign) {
        return {
            investors: [],
            stats: {
                totalAmount: 0,
                totalInvestors: 0
            }
        };
    }

    try {
        // Get quick stats first
        const quickStats = await startupService.getQuickStats(campaign.id);
        
        // Then get detailed investor data
        const investors = await startupService.getInvestors(campaign.id);

        return {
            investors,
            stats: quickStats
        };
    } catch (err) {
        console.error('Error loading investor data:', err);
        throw error(500, {
            message: 'Failed to load investor data'
        });
    }
});