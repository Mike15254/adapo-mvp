// src/lib/services/investment.service.ts
import type { Record } from 'pocketbase';
import { pb } from '$lib/pocketbase';

interface Investment extends Record {
    campaign: string;
    investor: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    transaction_date: string;
}

interface CreateInvestmentData {
    campaignId: string;
    amount: number;
}

class InvestmentService {
    private collectionName = 'investments';

    async createInvestment(data: CreateInvestmentData) {
        try {
            // First check if there's enough wallet balance
            const user = pb.authStore.model;
            if (!user) throw new Error('Not authenticated');

            const wallet = await pb.collection('wallets').getFirstListItem(`user="${user.id}"`);
            if (wallet.balance < data.amount) {
                throw new Error('Insufficient wallet balance');
            }

            // Create the investment record
            const investment = await pb.collection(this.collectionName).create<Investment>({
                campaign: data.campaignId,
                investor: user.id,
                amount: data.amount,
                status: 'pending',
                transaction_date: new Date().toISOString()
            });

            // Update campaign funding
            const campaign = await pb.collection('startup_profiles').getOne(data.campaignId);
            await pb.collection('startup_profiles').update(data.campaignId, {
                funds_raised: (campaign.funds_raised || 0) + data.amount,
                investor_count: (campaign.investor_count || 0) + 1
            });

            // Update wallet balance
            await pb.collection('wallets').update(wallet.id, {
                balance: wallet.balance - data.amount
            });

            // Create transaction record
            await pb.collection('wallet_transactions').create({
                user: user.id,
                type: 'investment',
                amount: data.amount,
                status: 'completed',
                reference: `INV-${investment.id}`,
                description: `Investment in campaign ${data.campaignId}`
            });

            return investment;
        } catch (error) {
            console.error('Investment error:', error);
            throw error;
        }
    }

    async getInvestmentsByCampaign(campaignId: string): Promise<Investment[]> {
        try {
            const records = await pb.collection(this.collectionName).getList(1, 50, {
                filter: `campaign = "${campaignId}"`,
                sort: '-created'
            });
            return records.items;
        } catch (error) {
            console.error('Error fetching campaign investments:', error);
            throw error;
        }
    }
}

export const investmentService = new InvestmentService();