
import type { PageLoad } from './$types';
import { campaignService } from '$lib/services/campaign.service';

export const load: PageLoad = async () => {
    try {
        const campaigns = await campaignService.getVerifiedCampaigns();
        return { campaigns };
    } catch (error) {
        console.error('Error loading campaigns:', error);
        return { campaigns: [] };
    }
};
