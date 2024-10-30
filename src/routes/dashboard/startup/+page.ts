import type { PageLoad } from './$types';
import { DashboardService, dashboardStore } from '$lib/services/dashboard.service';

export const load: PageLoad = async ({ parent }) => {
    const { startup } = await parent();
    
    if (!startup?.id) {
        dashboardStore.setError('Startup profile not found');
        return { updates: [] };
    }

    try {
        const updates = await DashboardService.loadStartupUpdates(startup.id);
        dashboardStore.setUpdates(updates);
        dashboardStore.setError(null);
        
        return { updates };
    } catch (err) {
        console.error('Error loading updates:', err);
        dashboardStore.setError('Failed to load startup updates');
        return { updates: [] };
    }
};