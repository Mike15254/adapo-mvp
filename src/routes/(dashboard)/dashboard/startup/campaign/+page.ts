// src/routes/(dashboard)/startup/campaign/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const load: PageLoad = async ({ parent }) => {
    const { user } = await parent();
    
    if (!user) {
        throw redirect(303, '/login');
    }

    // Check if user already has a campaign
    try {
        const existingCampaign = await pb.collection('startup_profiles')
            .getFirstListItem(`user="${user.id}"`);
        
        // if (existingCampaign) {
        //     throw redirect(303, '/dashboard/startup');
        // }
    } catch (error: any) {
        // No campaign found - this is what we want
        if (error.status !== 404) {
            throw error;
        }
    }

    return {
        userId: user.id
    };
};