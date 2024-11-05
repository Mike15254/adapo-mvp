// src/lib/stores/investor.store.ts
import { writable, derived, get } from 'svelte/store';
import type { 
    InvestorProfile,
    Investment,
    Wallet,
    StartupProfile,
    WalletTransaction,
    TransactionType,
    TransactionStatus,
    InvestorType,
    IndustryType,
    InvestmentRange
} from '../types/dashboard.type';
import { pb } from '../pocketbase';
import type { Record as PocketbaseRecord } from 'pocketbase';
import { dashboardStore } from './dashboard.store';

interface InvestorState {
    profile: InvestorProfile | null;
    wallet: Wallet | null;
    investments: Investment[];
    availableCampaigns: StartupProfile[];
    isLoading: boolean;
    error: string | null;
}

const initialState: InvestorState = {
    profile: null,
    wallet: null,
    investments: [],
    availableCampaigns: [],
    isLoading: false,
    error: null
};

function createInvestorStore() {
    const { subscribe, set, update } = writable<InvestorState>(initialState);

    const store = {
        subscribe,

        initialize: async (userId: string) => {
            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                // First check if profile exists
                let profileData;
                try {
                    profileData = await pb.collection('investors_profiles').getFirstListItem(`user="${userId}"`);
                } catch (e) {
                    // If profile doesn't exist, create one
                    profileData = await pb.collection('investors_profiles').create({
                        user: userId,
                        verificationStatus: 'unverified',
                        type: 'individual',
                        investment_history: [],
                        investment_focus: 'other',
                        investment_range: '0-100k',
                        total_investments: 0,
                        active_investments: 0,
                        investment_preferences: {}
                    });
                }

                const profile: InvestorProfile = {
                    ...profileData,
                    user: profileData.user,
                    verificationStatus: profileData.verificationStatus || 'unverified',
                    type: profileData.type || 'individual',
                    investment_history: profileData.investment_history || [],
                    investment_focus: profileData.investment_focus || 'other',
                    investment_range: profileData.investment_range || '0-100k',
                    total_investments: profileData.total_investments || 0,
                    active_investments: profileData.active_investments || 0,
                    investment_preferences: profileData.investment_preferences || {}
                };

                // Check if wallet exists, if not create one
                let walletData;
                try {
                    walletData = await pb.collection('wallets').getFirstListItem(`user="${userId}"`);
                } catch (e) {
                    walletData = await pb.collection('wallets').create({
                        user: userId,
                        balance: 0,
                        currency: 'KES',
                        status: 'active'
                    });
                }

                // Fetch transactions
                const transactionsData = await pb.collection('wallet_transactions').getList(1, 50, {
                    filter: `user="${userId}"`,
                    sort: '-created'
                });
                
                const transactions: WalletTransaction[] = transactionsData.items.map(t => ({
                    ...t,
                    user: t.user,
                    type: t.type as TransactionType,
                    amount: t.amount,
                    status: t.status as TransactionStatus,
                    reference: t.reference,
                    description: t.description,
                    payment_method: t.payment_method,
                    metadata: t.metadata
                }));

                const wallet: Wallet = {
                    ...walletData,
                    user: walletData.user,
                    balance: walletData.balance,
                    currency: walletData.currency,
                    status: walletData.status,
                    transactions
                };

                // Fetch verified campaigns
                const campaignsData = await pb.collection('startup_profiles').getList(1, 50, {
                    filter: 'verification_status = "verified"',
                    sort: '-created'
                });

                const availableCampaigns: StartupProfile[] = campaignsData.items.map(campaign => ({
                    ...campaign,
                    user: campaign.user,
                    company_name: campaign.company_name,
                    description: campaign.description,
                    industry: campaign.industry,
                    verification_status: campaign.verification_status,
                    team_members: campaign.team_members || [],
                    funding_raised_total: campaign.funding_raised_total || 0,
                    investor_count: campaign.investor_count || 0,
                    funding_goal: campaign.funding_goal || 0,
                    funds_raised: campaign.funds_raised || 0
                }));

                update(state => ({
                    ...state,
                    profile,
                    wallet,
                    availableCampaigns,
                    isLoading: false
                }));
            } catch (error: any) {
                console.error('Initialize error:', error);
                update(state => ({ 
                    ...state, 
                    error: error.message || 'Failed to load investor data',
                    isLoading: false 
                }));
                throw error;
            }
        },

        submitVerification: async (data: {
            id_number: string;
            kra_pin: string;
            verification_documents: File[];
            type: InvestorType;
            profession?: string;
            investment_focus: IndustryType;
            investment_range: InvestmentRange;
        }) => {
            const store = get({ subscribe }) as InvestorState;
            
            if (!store.profile) {
                throw new Error('Please initialize the investor profile first');
            }

            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                const formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (Array.isArray(value) && value[0] instanceof File) {
                        value.forEach(file => {
                            formData.append('verification_documents', file);
                        });
                    } else {
                        formData.append(key, String(value));
                    }
                });

                formData.append('verificationStatus', 'pending');

                const updatedProfile = await pb.collection('investors_profiles').update(
                    store.profile.id,
                    formData
                );

                // Ensure we have all required fields in the updated profile
                const fullUpdatedProfile: InvestorProfile = {
                    ...store.profile,
                    ...updatedProfile,
                    verificationStatus: 'pending',
                    investment_history: store.profile.investment_history,
                    investment_preferences: store.profile.investment_preferences
                };

                update(state => ({
                    ...state,
                    profile: fullUpdatedProfile,
                    isLoading: false
                }));

                return fullUpdatedProfile;
            } catch (error: any) {
                console.error('Verification submission error:', error);
                update(state => ({ 
                    ...state, 
                    error: error.message || 'Verification submission failed',
                    isLoading: false 
                }));
                throw error;
            }
        },
        // Add to investor.store.ts
refreshWallet: async (userId: string) => {
    try {
        // Fetch updated wallet data
        const walletData = await pb.collection('wallets').getFirstListItem(`user="${userId}"`);
        
        // Fetch latest transactions
        const transactionsData = await pb.collection('wallet_transactions').getList(1, 50, {
            filter: `user="${userId}"`,
            sort: '-created'
        });
        
        const transactions: WalletTransaction[] = transactionsData.items.map(t => ({
            ...t,
            user: t.user,
            type: t.type as TransactionType,
            amount: t.amount,
            status: t.status as TransactionStatus,
            reference: t.reference,
            description: t.description,
            payment_method: t.payment_method,
            metadata: t.metadata
        }));

        const updatedWallet: Wallet = {
            ...walletData,
            user: walletData.user,
            balance: walletData.balance,
            currency: walletData.currency,
            status: walletData.status,
            transactions
        };

        update(state => ({
            ...state,
            wallet: updatedWallet
        }));

        return updatedWallet;
    } catch (error: any) {
        console.error('Refresh wallet error:', error);
        throw error;
    }
},

        reset: () => set(initialState)
    };

    return store;
}

export const investorStore = createInvestorStore();

// Derived stores
export const profile = derived(investorStore, $store => $store.profile);
export const wallet = derived(investorStore, $store => $store.wallet);
export const investments = derived(investorStore, $store => $store.investments);
export const availableCampaigns = derived(investorStore, $store => $store.availableCampaigns);