// src/routes/dashboard/startup/verify/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const load: PageLoad = async ({ parent }) => {
    const { startup, user } = await parent();
    
    if (!startup || !user) {
        throw redirect(302, '/login');
    }

    // Get existing documents
    const documents = await pb.collection('verification_documents')
        .getList(1, 50, {
            filter: `user="${user.id}"`,
            sort: '-created'
        });

    const verificationSteps = [
        {
            id: 'company',
            title: 'Company Details',
            icon: 'Building',
            description: 'Basic company information',
            complete: !!startup.company_name && 
                     !!startup.business_registration_number && 
                     !!startup.description
        },
        {
            id: 'documents',
            title: 'Legal Documents',
            icon: 'FileText',
            description: 'Required business documents',
            complete: documents.items.some(d => 
                d.document_type === 'business_registration' &&
                d.status !== 'rejected'
            )
        },
        {
            id: 'pitch',
            title: 'Pitch Deck',
            icon: 'Presentation',
            description: 'Startup pitch presentation',
            complete: documents.items.some(d => 
                d.document_type === 'pitch_deck' &&
                d.status !== 'rejected'
            )
        },
        {
            id: 'team',
            title: 'Team Members',
            icon: 'Users',
            description: 'Key team information',
            complete: startup.team_members && 
                     startup.team_members.length > 0
        }
    ];

    return {
        startup,
        documents: documents.items,
        steps: verificationSteps,
        currentStep: verificationSteps.findIndex(step => !step.complete),
        canSubmit: verificationSteps.every(step => step.complete) && 
                  startup.verification_status !== 'under_review'
    };
};