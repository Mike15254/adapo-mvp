// src/lib/stores/startup.store.ts
import { writable, derived } from 'svelte/store';
import type { StartupProfile, StartupCampaign } from '$lib/types/dashboard.type';
import { pb } from '$lib/pocketbase';
import type { Record as PocketbaseRecord } from 'pocketbase';

interface StartupState {
    profile: StartupProfile | null;
    campaign: StartupCampaign | null;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: StartupState = {
    profile: null,
    campaign: null,
    isLoading: false,
    error: null,
    isInitialized: false
};

function createStartupStore() {
    const { subscribe, set, update } = writable<StartupState>(initialState);
    let currentState: StartupState = initialState;

    // Keep track of current state
    subscribe(state => {
        currentState = state;
    });

    return {
        subscribe,
        initialize: async (userId: string) => {
            if (currentState.isInitialized && currentState.profile) {
                return;
            }

            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                // Try to load existing profile
                let profileData: PocketbaseRecord | null = null;
                try {
                    profileData = await pb.collection('startup_profiles')
                        .getFirstListItem(`user="${userId}"`);
                } catch (e) {
                    // Profile doesn't exist yet, that's okay
                    console.log('No startup profile found');
                }

                // Only create profile if one doesn't exist
                if (profileData) {
                    const profile: StartupProfile = {
                        ...profileData,
                        user: profileData.user,
                        company_name: profileData.company_name || '',
                        description: profileData.description || '',
                        industry: profileData.industry || 'technology',
                        verification_status: profileData.verification_status || 'unverified',
                        team_members: profileData.team_members || [],
                        funding_raised_total: profileData.funding_raised_total || 0,
                        investor_count: profileData.investor_count || 0,
                        funding_goal: profileData.funding_goal || 0,
                        funds_raised: profileData.funds_raised || 0,
                        social_links: profileData.social_links || {}
                    };

                    update(state => ({
                        ...state,
                        profile,
                        isLoading: false,
                        isInitialized: true
                    }));
                } else {
                    update(state => ({
                        ...state,
                        isLoading: false,
                        isInitialized: true
                    }));
                }
            } catch (e: any) {
                console.error('Error initializing startup store:', e);
                update(state => ({
                    ...state,
                    error: e.message || 'Failed to load startup data',
                    isLoading: false
                }));
            }
        },
        createProfile: async (profileData: Partial<StartupProfile>) => {
            update(state => ({ ...state, isLoading: true, error: null }));

            try {
                const newProfile = await pb.collection('startup_profiles').create({
                    ...profileData,
                    verification_status: 'unverified',
                    funds_raised: 0,
                    investor_count: 0,
                    team_members: profileData.team_members || [],
                    social_links: profileData.social_links || {}
                });

                const profile: StartupProfile = {
                    ...newProfile,
                    user: newProfile.user,
                    company_name: newProfile.company_name,
                    description: newProfile.description,
                    industry: newProfile.industry,
                    verification_status: 'unverified',
                    team_members: newProfile.team_members || [],
                    funding_raised_total: 0,
                    investor_count: 0,
                    funding_goal: newProfile.funding_goal || 0,
                    funds_raised: 0,
                    social_links: newProfile.social_links || {}
                };

                update(state => ({
                    ...state,
                    profile,
                    isLoading: false
                }));

                return profile;
            } catch (e: any) {
                console.error('Error creating startup profile:', e);
                update(state => ({
                    ...state,
                    error: e.message || 'Failed to create startup profile',
                    isLoading: false
                }));
                throw e;
            }
        },
        reset: () => set(initialState)
    };
}

export const startupStore = createStartupStore();

// Derived stores
export const profile = derived(startupStore, $store => $store.profile);
export const campaign = derived(startupStore, $store => $store.campaign);
export const isLoading = derived(startupStore, $store => $store.isLoading);