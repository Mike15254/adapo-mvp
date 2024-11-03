import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { campaignService } from '$lib/services/campaign.service';

export const load: PageLoad = async ({ params }) => {
    try {
        const campaign = await campaignService.getCampaignDetails(params.id);
        if (!campaign) {
            throw error(404, 'Campaign not found');
        }
        return { campaign };
    } catch (err) {
        throw error(404, 'Campaign not found');
    }
};