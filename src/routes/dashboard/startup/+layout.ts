import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { DashboardService, dashboardStore } from '$lib/services/dashboard.service';
import { requireRole } from '$lib/guards/auth.guard';

export const load: LayoutLoad = async (event) => {
    // Verify user role and auth status
    const user = await requireRole(event, ['startup']);
    
    try {
        dashboardStore.setLoading(true);
        
        // Load startup profile
        const startup = await DashboardService.loadStartupProfile(user.id);
        
        if (!startup) {
            throw redirect(302, '/onboarding');
        }

        // Load dashboard stats
        const stats = await DashboardService.loadDashboardStats(startup);
        
        // Update store and return data
        dashboardStore.setStartup(startup);
        dashboardStore.setStats(stats);
        
        return { startup, stats };
    } catch (err) {
        if (err instanceof Response) throw err;
        
        console.error('Dashboard layout error:', err);
        dashboardStore.setError('Failed to load dashboard data');
        
        return {
            startup: null,
            stats: DashboardService.getDefaultStats()
        };
    } finally {
        dashboardStore.setLoading(false);
    }
};