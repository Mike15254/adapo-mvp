// src/routes/onboarding/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { Industry, InvestmentRange } from '$lib/types/onboarding.types';

interface PageData {
    industries: Industry[];
    investmentRanges: InvestmentRange[];
}

export const load: PageLoad<PageData> = async () => {
    if (pb.authStore.isValid) {
        throw redirect(302, `/dashboard/${pb.authStore.model?.role}`);
    }

    const industries: Industry[] = [
        'technology',
        'healthcare',
        'finance',
        'education',
        'agriculture',
        'other'
    ];

    const investmentRanges: InvestmentRange[] = [
        '0-100k',
        '100k-500k',
        '500k-1M',
        '1M-5M'
    ];

    return {
        industries,
        investmentRanges
    };
};