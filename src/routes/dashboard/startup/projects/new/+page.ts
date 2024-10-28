// src/routes/dashboard/startup/projects/new/+page.ts
import { error, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    const { user } = await parent();

    if (!user) {
        throw redirect(302, '/login');
    }

    // Get startup profile
    try {
        const startup = await pb.collection('startupProfiles').getFirstListItem(`user="${user.id}"`);
        
        return {
            startup,
            industries: [
                { value: 'technology', label: 'Technology' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'finance', label: 'Finance' },
                { value: 'education', label: 'Education' },
                { value: 'agriculture', label: 'Agriculture' },
                { value: 'other', label: 'Other' }
            ]
        };
    } catch (err) {
        throw error(500, 'Could not load startup data');
    }
};