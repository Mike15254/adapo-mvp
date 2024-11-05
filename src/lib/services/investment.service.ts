// src/lib/services/investment.service.ts
import { pb } from '$lib/pocketbase';
import {
	type WalletTransaction,
	type StartupProfile,
	mapRecordToWalletTransaction,
    type FundingStats,
    type Wallet
} from '../types/dashboard.type';

export class InvestmentService {
    private async updateCampaignFundingStats(campaignId: string): Promise<FundingStats> {
        try {
            // Get all successful investment transactions for this campaign
            const transactions = await pb.collection('wallet_transactions').getList(1, 500, {
                filter: `type="investment" && status="complete" && metadata.campaign_id="${campaignId}"`,
                sort: 'created'
            });

            // Calculate funding statistics
            const stats: FundingStats = {
                total_raised: 0,
                total_investors: new Set(transactions.items.map(t => t.user)).size,
                transactions: transactions.items.map(t => t.id),
                monthly_stats: {},
                last_investment_date: transactions.items[transactions.items.length - 1]?.created
            };

            // Calculate monthly stats
            transactions.items.forEach(tx => {
                const date = new Date(tx.created);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                
                if (!stats.monthly_stats[monthKey]) {
                    stats.monthly_stats[monthKey] = { amount: 0, count: 0 };
                }
                
                stats.monthly_stats[monthKey].amount += tx.amount;
                stats.monthly_stats[monthKey].count += 1;
                stats.total_raised += tx.amount;
            });

            // Update campaign
            await pb.collection('startup_profiles').update(campaignId, {
                funding_stats: stats
            });

            return stats;
        } catch (error) {
            console.error('Error updating campaign funding stats:', error);
            throw error;
        }
    }

    async createInvestment(data: {
        campaignId: string;
        amount: number;
        termsAccepted: boolean;
        risksAcknowledged: boolean;
    }) {
        const user = pb.authStore.model;
        if (!user) throw new Error('Not authenticated');

        try {
            // Start "transaction"
            console.log('Starting investment process:', {
                ...data,
                user: user.id
            });

            // Get current states
            const [wallet, campaign] = await Promise.all([
                pb.collection('wallets').getFirstListItem(`user="${user.id}"`),
                pb.collection('startup_profiles').getOne<StartupProfile>(data.campaignId)
            ]);

            // Validations
            this.validateInvestment(wallet, campaign, data.amount);

            // Create transaction record
            const monthKey = new Date().toISOString().slice(0, 7);
            const transaction = await pb.collection('wallet_transactions').create<WalletTransaction>({
                user: user.id,
                type: 'investment',
                amount: data.amount,
                status: 'pending',
                reference: `INV-${Date.now()}`,
                description: `Investment in ${campaign.company_name}`,
                payment_method: 'wallet',
                metadata: {
                    campaign_id: data.campaignId,
                    terms_accepted: data.termsAccepted,
                    risks_acknowledged: data.risksAcknowledged,
                    timestamp: new Date().toISOString(),
                    monthly_key: monthKey
                }
            });

            try {
                // Update wallet balance
                await pb.collection('wallets').update(wallet.id, {
                    balance: wallet.balance - data.amount
                });

                // Complete transaction
                await pb.collection('wallet_transactions').update(transaction.id, {
                    status: 'complete'
                });

                // Update campaign funding stats
                await this.updateCampaignFundingStats(data.campaignId);

                return transaction;
            } catch (error) {
                // Rollback: Mark transaction as failed
                await pb.collection('wallet_transactions').update(transaction.id, {
                    status: 'failed',
                    metadata: {
                        ...transaction.metadata,
                        error: error.message,
                        failed_at: new Date().toISOString()
                    }
                });
                throw error;
            }
        } catch (error) {
            console.error('Investment error:', error);
            throw error;
        }
    }

    private validateInvestment(wallet: Wallet, campaign: StartupProfile, amount: number) {
        if (wallet.balance < amount) {
            throw new Error('Insufficient wallet balance');
        }
        if (campaign.verification_status !== 'verified') {
            throw new Error('Campaign is not accepting investments');
        }
        if (amount < campaign.min_investment) {
            throw new Error(`Minimum investment is ${campaign.min_investment}`);
        }
        const remainingToGoal = campaign.funding_goal - (campaign.funding_stats?.total_raised || 0);
        if (amount > remainingToGoal) {
            throw new Error(`Maximum investment available is ${remainingToGoal}`);
        }
    }

    // Add method to get campaign funding statistics
    async getCampaignFundingStats(campaignId: string): Promise<FundingStats> {
        const campaign = await pb.collection('startup_profiles').getOne<StartupProfile>(campaignId);
        return campaign.funding_stats;
    }
    async getInvestmentHistory(userId: string) {
        try {
            const records = await pb.collection('wallet_transactions').getList(1, 50, {
                filter: `user="${userId}" && type="investment"`,
                sort: '-created'
            });
            
            // Map records to correct type
            return records.items.map(record => mapRecordToWalletTransaction(record));
        } catch (error) {
            console.error('Error fetching investment history:', error);
            throw error;
        }
    }
    async getCampaignInvestments(campaignId: string) {
        try {
            const records = await pb.collection('wallet_transactions').getList(1, 50, {
                filter: `type="investment" && metadata.campaign_id = "${campaignId}"`,
                sort: '-created'
            });
            return records.items;
        } catch (error) {
            console.error('Error fetching campaign investments:', error);
            throw error;
        }
    }


    // Add method to get investment analytics
    async getInvestmentAnalytics(campaignId: string) {
        const stats = await this.getCampaignFundingStats(campaignId);
        return {
            totalRaised: stats.total_raised,
            totalInvestors: stats.total_investors,
            monthlyTrends: Object.entries(stats.monthly_stats)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, data]) => ({
                    month,
                    amount: data.amount,
                    count: data.count,
                    averageInvestment: data.amount / data.count
                }))
        };
    }
}
export const investmentService = new InvestmentService();
