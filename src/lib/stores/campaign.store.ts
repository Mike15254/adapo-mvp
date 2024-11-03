// src/lib/stores/campaign.store.ts
import { writable, derived } from 'svelte/store';
import type { CampaignDocuments, CampaignFormData, SocialLinks, TeamMember } from '$lib/types/dashboard.type';
import { pb } from '$lib/pocketbase';

interface CampaignState {
    currentStep: number;
    formData: CampaignFormData;
    isSubmitting: boolean;
    error: string | null;
}

const initialState: CampaignState = {
    currentStep: 1,
    formData: {
        company_name: '',
        description: '',
        industry: 'technology',
        funding_goal: 0,
        team_members: [],
        social_links: {},
        documents: {
            verification_documents: []
        }
    },
    isSubmitting: false,
    error: null
};

function createCampaignStore() {
    const { subscribe, set, update } = writable<CampaignState>(initialState);
    
    function validateStep(state: CampaignState, step: number): boolean {
        switch (step) {
            case 1: // Basic Info
                return !!(
                    state.formData.company_name &&
                    state.formData.description &&
                    state.formData.industry &&
                    state.formData.funding_goal > 0
                );
            case 2: // Team Members
                return state.formData.team_members.length > 0;
            case 3: // Documents
                return !!(
                    state.formData.documents.pitch_deck &&
                    state.formData.documents.verification_documents.length > 0
                );
            case 4: // Review
                return true;
            default:
                return false;
        }
    }

    let currentState: CampaignState = initialState;
    subscribe(state => {
        currentState = state;
    });

    return {
        subscribe,
        
        setStep: (step: number) => update(s => ({ ...s, currentStep: step })),

        updateBasicInfo: (data: Partial<CampaignFormData>) => {
            update(s => ({
                ...s,
                formData: { ...s.formData, ...data }
            }));
        },

        addTeamMember: (member: TeamMember) => {
            update(state => ({
                ...state,
                formData: {
                    ...state.formData,
                    team_members: [...state.formData.team_members, member]
                }
            }));
        },

        removeTeamMember: (index: number) => {
            update(state => ({
                ...state,
                formData: {
                    ...state.formData,
                    team_members: state.formData.team_members.filter((_, i) => i !== index)
                }
            }));
        },

        updateSocialLinks: (links: Partial<SocialLinks>) => {
            update(state => ({
                ...state,
                formData: {
                    ...state.formData,
                    social_links: {
                        ...state.formData.social_links,
                        ...links
                    }
                }
            }));
        },

        updateDocuments: (documents: Partial<CampaignDocuments>) => {
            update(state => ({
                ...state,
                formData: {
                    ...state.formData,
                    documents: {
                        ...state.formData.documents,
                        ...documents
                    }
                }
            }));
        },

        async submitCampaign(userId: string) {
            update(s => ({ ...s, isSubmitting: true, error: null }));
        
            try {
                const formData = new FormData();
        
                // Add all the basic fields
                formData.append('company_name', currentState.formData.company_name);
                formData.append('description', currentState.formData.description);
                formData.append('industry', currentState.formData.industry);
                formData.append('funding_goal', currentState.formData.funding_goal.toString());
                formData.append('team_members', JSON.stringify(currentState.formData.team_members));
                formData.append('social_links', JSON.stringify(currentState.formData.social_links));
        
                // Add the user ID to the form data
                formData.append('user', userId); // This is the key that maps to your relation field
        
                // Add files
                if (currentState.formData.documents.pitch_deck) {
                    formData.append('pitch_deck', currentState.formData.documents.pitch_deck);
                }
                if (currentState.formData.documents.business_plan) {
                    formData.append('business_plan', currentState.formData.documents.business_plan);
                }
                currentState.formData.documents.verification_documents.forEach(doc => {
                    formData.append('verification_documents', doc);
                });
        
                // Create campaign directly using PocketBase
                const record = await pb.collection('startup_profiles').create(formData);
                return record;
        
            } catch (error: any) {
                console.error('Campaign submission error:', error);
                const errorMessage = error.message || 'Failed to create campaign';
                update(s => ({ ...s, error: errorMessage }));
                throw new Error(errorMessage);
            } finally {
                update(s => ({ ...s, isSubmitting: false }));
            }
        },
        

        isStepValid: (step: number): boolean => {
            return validateStep(currentState, step);
        },

        reset: () => set(initialState)
    };
}

export const campaignStore = createCampaignStore();

// Derived stores for easier access
export const currentStep = derived(campaignStore, $store => $store.currentStep);
export const isSubmitting = derived(campaignStore, $store => $store.isSubmitting);
export const formError = derived(campaignStore, $store => $store.error);