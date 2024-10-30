import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { InvestorService } from '$lib/services/investor.service';
import { requireRole } from '$lib/guards/auth.guard';

export const load: LayoutLoad = async (event) => {
    try {
        // Verify user role and auth status
        const user = await requireRole(event, ['investor']);
        
        // Load dashboard data
        const dashboardData = await InvestorService.loadDashboardData(user.id);
        
        return {
            ...dashboardData,
            user
        };
    } catch (err) {
        if (err instanceof Response) throw err;
        
        console.error('Investor dashboard error:', err);
        return {
            profile: null,
            stats: InvestorService.getDefaultStats(),
            investments: [],
            opportunities: [],
            user: null
        };
    }
};