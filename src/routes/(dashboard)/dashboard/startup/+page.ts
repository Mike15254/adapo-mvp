// src/routes/(dashboard)/startup/+page.ts
import type { PageLoad } from './$types';
import type { DashboardData } from '$lib/types/dashboard.type';

export const load: PageLoad = async ({ parent }): Promise<DashboardData> => {
    const data = await parent();
    return data;
};