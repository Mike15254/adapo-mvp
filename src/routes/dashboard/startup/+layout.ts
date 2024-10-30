import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { DashboardService, dashboardStore } from '$lib/services/dashboard.service';
import { requireRole } from '$lib/guards/auth.guard';

export const load: LayoutLoad = async (event) => {
    try {
        // Verify user role and auth status
        const user = await requireRole(event, ['startup']);
        dashboardStore.setLoading(true);

        // Load startup profile and stats
        const startup = await DashboardService.loadStartupProfile(user.id);
        
        if (!startup) {
            throw redirect(302, '/onboarding');
        }

        const stats = await DashboardService.loadDashboardStats(startup);

        // Update store
        dashboardStore.setStartup(startup);
        dashboardStore.setStats(stats);
        dashboardStore.setError(null);

        return {
            startup,
            stats,
            user
        };
    } catch (err) {
        if (err instanceof Response) throw err;
        
        console.error('Dashboard layout error:', err);
        dashboardStore.setError('Failed to load dashboard data');
        
        return {
            startup: null,
            stats: DashboardService.getDefaultStats(),
            user: null
        };
    } finally {
        dashboardStore.setLoading(false);
    }
};