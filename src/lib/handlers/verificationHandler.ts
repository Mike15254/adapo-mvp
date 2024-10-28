import type  Record  from 'pocketbase';
import { pb } from '$lib/pocketbase';

interface VerificationData {
    company_name: string;
    registration_number: string;
    documents: File[];
}

export async function handleVerification(userId: string, data: VerificationData) {
    try {
        const formData = new FormData();
        formData.append('user', userId);
        formData.append('company_name', data.company_name);
        formData.append('registration_number', data.registration_number);
        formData.append('verification_status', 'pending');
        
        // Add documents
        data.documents.forEach(doc => {
            formData.append('documents', doc);
        });

        const startup = await pb.collection('startups').create(formData);
        return startup;
    } catch (err) {
        console.error('Verification error:', err);
        throw new Error('Failed to submit verification');
    }
}

export async function checkVerificationStatus(userId: string) {
    try {
        const startup = await pb.collection('startups').getFirstListItem(`user="${userId}"`);
        return startup.verification_status;
    } catch (err) {
        return 'unverified';
    }
}