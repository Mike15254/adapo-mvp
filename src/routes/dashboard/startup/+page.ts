import type { PageLoad } from './$types';
import { DashboardService, dashboardStore } from '$lib/services/dashboard.service';

export const load: PageLoad = async ({ parent }) => {
    const { startup } = await parent();
    
    if (!startup?.id) {
        return { updates: [], error: 'Startup profile not found' };
    }

    try {
        const updates = await DashboardService.loadStartupUpdates(startup.id);
        dashboardStore.setUpdates(updates);
        
        return { updates };
    } catch (err) {
        console.error('Error loading updates:', err);
        return { 
            updates: [],
            error: 'Failed to load startup updates'
        };
    }
};