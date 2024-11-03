// src/routes/(dashboard)/startup/+layout.ts
import type { LayoutLoad } from './$types';
import type { StartupCampaign } from '$lib/types/dashboard.type';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const load: LayoutLoad = async ({ parent }) => {
    const { user } = await parent();

    if (!user) {
        throw redirect(302, '/login');
    }

    if (user.role !== 'startup') {
        throw redirect(302, `/dashboard/${user.role}`);
    }

    try {
        const campaign = await pb.collection('startup_profiles').getFirstListItem(
            `user = "${user.id}"`,
            {
                expand: 'user',
                fields: `
                    id,
                    user,
                    company_name,
                    description,
                    industry,
                    funding_goal,
                    funds_raised,
                    verification_status,
                    team_members,
                    social_links,
                    created,
                    updated
                `
            }
        ) as StartupCampaign;

        if (campaign.user !== user.id) {
            throw new Error('Campaign does not belong to this user');
        }

        return {
            user,
            campaign
        };
    } catch (error) {
        if (error.status === 404) {
            return {
                user,
                campaign: null
            };
        }
        throw error;
    }
};