// src/lib/services/startup.service.ts
import { pb } from '$lib/pocketbase';
import type { WalletTransaction, InvestorProfile } from '$lib/types/dashboard.type';

class StartupService {
    async getInvestors(campaignId: string) {
        try {
            // Get all investments for this startup with expanded relations
            const investments = await pb.collection('investments').getFullList({
                filter: `startup = "${campaignId}"`,
                expand: 'investor,investor.investors_profiles,transaction',
                sort: '-created'
            });

            // Group by investor
            const investorsMap = new Map();

            investments.forEach(inv => {
                if (!inv.expand?.investor) return;

                const investor = inv.expand.investor;
                const investorId = investor.id;

                if (!investorsMap.has(investorId)) {
                    investorsMap.set(investorId, {
                        user: {
                            id: investor.id,
                            email: investor.email,
                            name: investor.name,
                            profile_picture: investor.profile_picture
                        },
                        profile: investor.expand?.investors_profiles?.[0] || null,
                        totalInvested: 0,
                        investments: [],
                        transactions: []
                    });
                }

                const investorData = investorsMap.get(investorId);
                investorData.totalInvested += inv.amount;
                investorData.investments.push(inv);
                if (inv.expand?.transaction) {
                    investorData.transactions.push(inv.expand.transaction);
                }
            });

            return Array.from(investorsMap.values());
        } catch (error) {
            console.error('Error fetching investors:', error);
            throw error;
        }
    }

    async getInvestmentStats(campaignId: string) {
        try {
            const [investments, transactions] = await Promise.all([
                pb.collection('investments').getFullList({
                    filter: `startup = "${campaignId}" && status = "active"`,
                    fields: 'amount,investor'
                }),
                pb.collection('wallet_transactions').getFullList({
                    filter: `metadata.campaign_id = "${campaignId}" && type = "investment" && status = "complete"`,
                    fields: 'amount'
                })
            ]);

            // Get unique investors count
            const uniqueInvestors = new Set(investments.map(inv => inv.investor)).size;

            // Calculate total raised from transactions
            const totalRaised = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

            // Update startup profile with latest stats
            await pb.collection('startup_profiles').update(campaignId, {
                'funding_stats': {
                    total_raised: totalRaised,
                    total_investors: uniqueInvestors,
                    last_investment_date: investments[0]?.created || null,
                    updated_at: new Date().toISOString()
                },
                'investor_count': uniqueInvestors,
                'funding_raised_total': totalRaised
            });

            return {
                totalAmount: totalRaised,
                totalInvestors: uniqueInvestors
            };
        } catch (error) {
            console.error('Error fetching investment stats:', error);
            throw error;
        }
    }

    // Helper method to update funding stats
    async updateFundingStats(campaignId: string) {
        const stats = await this.getInvestmentStats(campaignId);
        
        try {
            await pb.collection('startup_profiles').update(campaignId, {
                'funding_stats': {
                    ...stats,
                    updated_at: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Error updating funding stats:', error);
            throw error;
        }
    }

    // Get quick stats without full recalculation
    async getQuickStats(campaignId: string) {
        try {
            const startup = await pb.collection('startup_profiles').getOne(campaignId, {
                fields: 'funding_stats,investor_count,funding_raised_total'
            });

            // If stats are recent (less than 1 hour old), return them
            const lastUpdate = new Date(startup.funding_stats?.updated_at || 0);
            const isStale = Date.now() - lastUpdate.getTime() > 3600000; // 1 hour

            if (isStale) {
                // Update stats in background
                this.updateFundingStats(campaignId).catch(console.error);
            }

            return {
                totalAmount: startup.funding_raised_total || 0,
                totalInvestors: startup.investor_count || 0,
                lastUpdated: lastUpdate
            };
        } catch (error) {
            console.error('Error fetching quick stats:', error);
            throw error;
        }
    }
}

export const startupService = new StartupService();