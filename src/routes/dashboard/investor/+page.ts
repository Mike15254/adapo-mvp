import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { investorStore } from '$lib/services/investor.service';

export const load: PageLoad = async ({ parent }) => {
    const { stats, investments, opportunities } = await parent();
    const { error } = get(investorStore);

    return {
        stats,
        investments,
        opportunities,
        error
    };
};