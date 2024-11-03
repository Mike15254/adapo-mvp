// src/routes/api/campaign/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { campaignService } from '$lib/services/campaign.service';

export async function POST(event: RequestEvent) {
    console.log('📝 [Campaign API] Processing POST request');
    
    try {
        const userId = event.locals.user?.id;

        if (!userId) {
            console.log('❌ [Campaign API] Unauthorized request');
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user already has a campaign
        const existingCampaign = await campaignService.getUserCampaign(userId);
        if (existingCampaign) {
            console.log('⚠️ [Campaign API] User already has a campaign');
            return json({ error: 'User already has a campaign' }, { status: 400 });
        }

        const formData = await event.request.formData();
        const campaign = await campaignService.createCampaign(formData, userId);
        console.log('✅ [Campaign API] Campaign created successfully');
        return json(campaign);
    } catch (error: any) {
        console.error('❌ [Campaign API] Error creating campaign:', error);
        return json({ error: error.message }, { status: 500 });
    }
}

export async function GET(event: RequestEvent) {
    console.log('🔍 [Campaign API] Processing GET request');
    
    try {
        const userId = event.locals.user?.id;

        if (!userId) {
            console.log('❌ [Campaign API] Unauthorized request');
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const campaign = await campaignService.getUserCampaign(userId);
        console.log('✅ [Campaign API] Campaign fetched successfully');
        return json(campaign);
    } catch (error: any) {
        console.error('❌ [Campaign API] Error fetching campaign:', error);
        return json({ error: error.message }, { status: 500 });
    }
}

// // src/routes/api/campaign/[id]/+server.ts
// export async function PATCH(event: RequestEvent) {
//     console.log('🔄 [Campaign API] Processing PATCH request');
    
//     try {
//         const campaignId = event.params.id;
//         const userId = event.locals.user?.id;

//         if (!userId) {
//             console.log('❌ [Campaign API] Unauthorized request');
//             return json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         // Verify ownership
//         const campaign = await campaignService.getUserCampaign(userId);
//         if (!campaign || campaign.id !== campaignId) {
//             console.log('⚠️ [Campaign API] Unauthorized campaign access');
//             return json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const formData = await event.request.formData();
//         const updatedCampaign = await campaignService.updateCampaign(campaignId, formData);
//         console.log('✅ [Campaign API] Campaign updated successfully');
//         return json(updatedCampaign);
//     } catch (error: any) {
//         console.error('❌ [Campaign API] Error updating campaign:', error);
//         return json({ error: error.message }, { status: 500 });
//     }
// }

// export async function DELETE(event: RequestEvent) {
//     console.log('🗑️ [Campaign API] Processing DELETE request');
    
//     try {
//         const campaignId = event.params.id;
//         const userId = event.locals.user?.id;

//         if (!userId) {
//             console.log('❌ [Campaign API] Unauthorized request');
//             return json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         // Verify ownership
//         const campaign = await campaignService.getUserCampaign(userId);
//         if (!campaign || campaign.id !== campaignId) {
//             console.log('⚠️ [Campaign API] Unauthorized campaign access');
//             return json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         await campaignService.deleteCampaign(campaignId);
//         console.log('✅ [Campaign API] Campaign deleted successfully');
//         return json({ success: true });
//     } catch (error: any) {
//         console.error('❌ [Campaign API] Error deleting campaign:', error);
//         return json({ error: error.message }, { status: 500 });
//     }
// }