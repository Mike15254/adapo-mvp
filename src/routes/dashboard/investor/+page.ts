// src/routes/dashboard/investor/+page.ts
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { investorStore } from '$lib/services/investor.service';
import type { InvestorDashboardStats, Investment } from '$lib/types/investor.types';

interface PageData {
    stats: InvestorDashboardStats;
    investments: Investment[];
    opportunities: any[];
    error?: string | null;
}

export const load: PageLoad<PageData> = async ({ parent }) => {
    const parentData = await parent();
    const storeData = get(investorStore);

    return {
        stats: parentData.stats || storeData.stats || getDefaultStats(),
        investments: parentData.investments || storeData.investments || [],
        opportunities: parentData.opportunities || storeData.opportunities || [],
        error: storeData.error
    };
};