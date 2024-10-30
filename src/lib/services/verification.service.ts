import { pb } from '$lib/pocketbase';
import { writable } from 'svelte/store';
import type { 
    VerificationDocument,
    StartupVerification, 
    TeamMember 
} from '$lib/types/verification.types';

interface VerificationState {
    documents: VerificationDocument[];
    currentStep: number;
    isLoading: boolean;
    error: string | null;
    success: string | null;
}

function createVerificationStore() {
    const { subscribe, set, update } = writable<VerificationState>({
        documents: [],
        currentStep: 0,
        isLoading: false,
        error: null,
        success: null
    });

    return {
        subscribe,
        setStep: (step: number) => 
            update(state => ({ ...state, currentStep: step })),
        setLoading: (isLoading: boolean) => 
            update(state => ({ ...state, isLoading, error: null })),
        setError: (error: string | null) => 
            update(state => ({ ...state, error, success: null })),
        setSuccess: (success: string | null) => 
            update(state => ({ ...state, success, error: null })),
        reset: () => set({
            documents: [],
            currentStep: 0,
            isLoading: false,
            error: null,
            success: null
        })
    };
}

export const verificationStore = createVerificationStore();

export class VerificationService {
    static async updateCompanyInfo(startupId: string, data: Partial<StartupVerification>) {
        verificationStore.setLoading(true);
        try {
            const record = await pb.collection('startup_profiles').update(startupId, data);
            verificationStore.setSuccess('Company information updated successfully');
            return record;
        } catch (error: any) {
            verificationStore.setError(error.message || 'Failed to update company information');
            throw error;
        } finally {
            verificationStore.setLoading(false);
        }
    }

    static async uploadDocuments(
        startupId: string, 
        documents: { file: File, type: string }[]
    ) {
        verificationStore.setLoading(true);
        try {
            const uploads = documents.map(async ({ file, type }) => {
                const formData = new FormData();
                
                // Add the file with a specific field name expected by PocketBase
                formData.append('file', file);
                
                // Add other fields as regular form fields
                formData.append('document_type', type);
                formData.append('status', 'pending');
                formData.append('user', startupId);

                // Explicitly set the content type to multipart/form-data
                const options = {
                    headers: {
                        'Accept': 'application/json',
                    }
                };

                return pb.collection('verification_documents').create(formData, options);
            });

            await Promise.all(uploads);
            
            // Update startup profile status
            await pb.collection('startup_profiles').update(startupId, {
                verification_status: 'documents_pending'
            });

            verificationStore.setSuccess('Documents uploaded successfully');
        } catch (error: any) {
            console.error('Upload error:', error);
            verificationStore.setError(error.message || 'Failed to upload documents');
            throw error;
        } finally {
            verificationStore.setLoading(false);
        }
    }

    static async updateTeamMembers(startupId: string, members: TeamMember[]) {
        verificationStore.setLoading(true);
        try {
            await pb.collection('startup_profiles').update(startupId, {
                team_members: members
            });
            verificationStore.setSuccess('Team information updated successfully');
        } catch (error: any) {
            verificationStore.setError(error.message || 'Failed to update team information');
            throw error;
        } finally {
            verificationStore.setLoading(false);
        }
    }

    static async submitVerification(startupId: string) {
        verificationStore.setLoading(true);
        try {
            await pb.collection('startup_profiles').update(startupId, {
                verification_status: 'under_review'
            });
            verificationStore.setSuccess('Verification submitted successfully');
        } catch (error: any) {
            verificationStore.setError(error.message || 'Failed to submit verification');
            throw error;
        } finally {
            verificationStore.setLoading(false);
        }
    }
}