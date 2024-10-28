// src/routes/dashboard/startup/verification/+page.ts
import { error, redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
    const { user } = await parent();
    
    if (!user) {
        throw redirect(302, '/login');
    }

    // Check if user is a startup
    if (user.role !== 'startup') {
        throw redirect(302, '/dashboard');
    }

    try {
        // Get startup profile if it exists
        const startup = await pb.collection('startups').getFirstListItem(`user="${user.id}"`);
        
        // Handle different verification states
        if (startup?.verification_status === 'verified') {
            return { // Instead of redirect, let parent handle navigation
                user,
                startup,
                redirectTo: '/dashboard/startup',
                message: 'already-verified'
            };
        }

        if (startup?.verification_status === 'pending') {
            return { // Let parent handle navigation
                user,
                startup,
                redirectTo: '/dashboard/startup',
                message: 'verification-pending'
            };
        }

        // Return data for verification form
        return {
            user,
            startup: startup || null,
            documents: [
                {
                    type: 'business_registration',
                    title: 'Business Registration Certificate',
                    description: 'Official registration document',
                    required: true,
                    maxSize: 5 * 1024 * 1024,
                    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
                },
                {
                    type: 'company_profile',
                    title: 'Company Profile',
                    description: 'Detailed business description',
                    required: true,
                    maxSize: 5 * 1024 * 1024,
                    allowedTypes: ['application/pdf']
                }
            ]
        };
    } catch (err) {
        console.error('Error loading verification page:', err);
        if (err.status === 404) {
            // No startup profile yet, show verification form
            return {
                user,
                startup: null,
                documents: [
                    {
                        type: 'business_registration',
                        title: 'Business Registration Certificate',
                        description: 'Official registration document',
                        required: true,
                        maxSize: 5 * 1024 * 1024,
                        allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
                    },
                    {
                        type: 'company_profile',
                        title: 'Company Profile',
                        description: 'Detailed business description',
                        required: true,
                        maxSize: 5 * 1024 * 1024,
                        allowedTypes: ['application/pdf']
                    }
                ]
            };
        }
        throw error(500, 'Failed to load verification page');
    }
}) satisfies PageLoad;