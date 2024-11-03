import { writable, derived, get } from 'svelte/store';
import type { 
    InvestorProfile, 
    Wallet, 
    StartupProfile,
    WalletTransaction,
    TransactionType,
    TransactionStatus,
} from '$lib/types/dashboard.type';
import { pb } from '$lib/pocketbase';
import type { Record as PocketbaseRecord } from 'pocketbase';

interface DashboardState {
    profile: InvestorProfile | null;
    wallet: Wallet | null;
    campaigns: StartupProfile[];
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: DashboardState = {
    profile: null,
    wallet: null,
    campaigns: [],
    isLoading: false,
    error: null,
    isInitialized: false
};

function createDashboardStore() {
    const { subscribe, set, update } = writable<DashboardState>(initialState);
    let currentState: DashboardState = initialState;

    // Keep track of current state
    subscribe(state => {
        currentState = state;
    });

    return {
        subscribe,
        initialize: async (userId: string) => {
            // If already initialized and we have data, skip loading
            if (currentState.isInitialized && currentState.profile) {
                return;
            }

            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                // Load or create investor profile
                let profileData: PocketbaseRecord;
                try {
                    profileData = await pb.collection('investors_profiles')
                        .getFirstListItem(`user="${userId}"`);
                } catch {
                    profileData = await pb.collection('investors_profiles').create({
                        user: userId,
                        verificationStatus: 'unverified',
                        type: 'individual',
                        investment_history: [],
                        investment_focus: 'technology',
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
                    investment_focus: profileData.investment_focus || 'technology',
                    investment_range: profileData.investment_range || '0-100k',
                    total_investments: profileData.total_investments || 0,
                    active_investments: profileData.active_investments || 0,
                    investment_preferences: profileData.investment_preferences || {}
                };

                // Load or create wallet
                let walletData: PocketbaseRecord;
                try {
                    walletData = await pb.collection('wallets')
                        .getFirstListItem(`user="${userId}"`);
                } catch {
                    walletData = await pb.collection('wallets').create({
                        user: userId,
                        balance: 0,
                        currency: 'KES',
                        status: 'active'
                    });
                }

                // Load transactions
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
                    balance: walletData.balance || 0,
                    currency: walletData.currency || 'KES',
                    status: walletData.status || 'active',
                    transactions
                };

                // Load campaigns
                const campaignsData = await pb.collection('startup_profiles').getList(1, 50, {
                    filter: 'verification_status = "verified"',
                    sort: '-created'
                });

                const campaigns: StartupProfile[] = campaignsData.items.map(campaign => ({
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
                    funds_raised: campaign.funds_raised || 0,
                    social_links: campaign.social_links || {}
                }));

                update(state => ({
                    ...state,
                    profile,
                    wallet,
                    campaigns,
                    isLoading: false,
                    isInitialized: true
                }));
            } catch (e: any) {
                console.error('Error initializing dashboard:', e);
                update(state => ({
                    ...state,
                    error: e.message || 'Failed to load dashboard data',
                    isLoading: false
                }));
            }
        },
        updateProfile: (profile: InvestorProfile) => {
            update(state => ({
                ...state,
                profile
            }));
        },
        updateWallet: (wallet: Wallet) => {
            update(state => ({
                ...state,
                wallet
            }));
        },
        reset: () => {
            set(initialState);
        }
    };
}

export const dashboardStore = createDashboardStore();

// Derived stores for easier access
export const profile = derived(dashboardStore, $store => $store.profile);
export const wallet = derived(dashboardStore, $store => $store.wallet);
export const campaigns = derived(dashboardStore, $store => $store.campaigns);
export const isLoading = derived(dashboardStore, $store => $store.isLoading);
export const isInitialized = derived(dashboardStore, $store => $store.isInitialized);