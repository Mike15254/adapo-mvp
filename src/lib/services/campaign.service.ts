// src/lib/services/campaign.service.ts
import { pb } from '$lib/pocketbase';
import type { Campaign, CampaignFilters, CampaignUpdate } from '$lib/types/campaign.types';

export class CampaignService {
    private collectionName = 'startup_profiles';

    async getCampaignDetails(campaignId: string): Promise<Campaign> {
        try {
            const record = await pb.collection(this.collectionName).getOne(campaignId, {
                expand: 'updates'
            });

            // Calculate days remaining
            const endDate = new Date(record.end_date);
            const today = new Date();
            const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            const campaign: Campaign = {
                ...record,
                title: record.company_name,
                current_funding: record.funds_raised || 0,
                days_remaining: daysRemaining,
                updates: record.expand?.updates || [],
                startup: {
                    company_name: record.company_name,
                    logo: record.logo,
                    team_members: record.team_members || []
                },
                documents: [
                    ...(record.pitch_deck ? [{
                        name: 'Pitch Deck',
                        url: record.pitch_deck,
                        type: 'pitch_deck'
                    }] : []),
                    ...(record.verification_documents ? [{
                        name: 'Verification Documents',
                        url: record.verification_documents,
                        type: 'verification'
                    }] : [])
                ]
            };

            return campaign;
        } catch (error) {
            console.error('Error fetching campaign details:', error);
            throw error;
        }
    }

    async getUserCampaign(userId: string) {
        try {
            const records = await pb.collection(this.collectionName).getList(1, 1, {
                filter: `user = "${userId}"`,
                sort: '-created'
            });
            return records.items[0] || null;
        } catch (error) {
            console.error('Error fetching user campaign:', error);
            throw error;
        }
    }

    async getVerifiedCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
        try {
            let filter = 'verification_status = "verified"';
            
            if (filters?.industry) {
                filter += ` && industry = "${filters.industry}"`;
            }
            if (filters?.minInvestment) {
                filter += ` && min_investment >= ${filters.minInvestment}`;
            }
            if (filters?.status) {
                filter += ` && status = "${filters.status}"`;
            }

            let sort = '-created';
            if (filters?.sortBy) {
                switch (filters.sortBy) {
                    case 'funding':
                        sort = 'funds_raised/funding_goal desc';
                        break;
                    case 'goal':
                        sort = 'funding_goal desc';
                        break;
                }
            }

            const records = await pb.collection(this.collectionName).getList(1, 50, {
                filter,
                sort,
                expand: 'updates'
            });

            return records.items.map(record => ({
                ...record,
                title: record.company_name,
                current_funding: record.funds_raised || 0,
                updates: record.expand?.updates || [],
                startup: {
                    company_name: record.company_name,
                    logo: record.logo,
                    team_members: record.team_members || []
                }
            }));
        } catch (error) {
            console.error('Error fetching verified campaigns:', error);
            throw error;
        }
    }

    async createCampaign(formData: FormData, userId: string) {
        try {
            // Validate required fields
            const requiredFields = [
                'company_name', 'description', 'industry', 
                'funding_goal', 'pitch_deck', 'verification_documents'
            ];

            for (const field of requiredFields) {
                if (!formData.get(field)) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }

            // Add additional fields
            formData.append('user', userId);
            formData.append('verification_status', 'pending');
            formData.append('funds_raised', '0');
            formData.append('investor_count', '0');
            formData.append('status', 'active');
            formData.append('end_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString());

            return await pb.collection(this.collectionName).create(formData);
        } catch (error: any) {
            console.error('Campaign creation error:', error);
            throw error;
        }
    }

    async updateCampaign(campaignId: string, formData: FormData) {
        try {
            return await pb.collection(this.collectionName).update(campaignId, formData);
        } catch (error) {
            console.error('Error updating campaign:', error);
            throw error;
        }
    }

    async deleteCampaign(campaignId: string) {
        try {
            return await pb.collection(this.collectionName).delete(campaignId);
        } catch (error) {
            console.error('Error deleting campaign:', error);
            throw error;
        }
    }
}

// Export a singleton instance
export const campaignService = new CampaignService();