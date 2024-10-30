// src/routes/dashboard/investor/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { InvestorDashboardService, getDefaultStats } from '$lib/services/investor.service';
import { requireRole } from '$lib/guards/auth.guard';
import type { InvestorDashboardStats } from '$lib/types/investor.types';

export const load: LayoutLoad = async (event) => {
    // Verify user role and auth status
    const user = await requireRole(event, ['investor']);
    
    try {
        const dashboardData = await InvestorDashboardService.loadDashboardData(user.id);
        return {
            ...dashboardData,
            user
        };
    } catch (err) {
        if (err instanceof Response) throw err;
        
        console.error('Investor dashboard error:', err);
        return {
            profile: null,
            stats: getDefaultStats(),
            investments: [],
            opportunities: [],
            user
        };
    }
};