import { pb } from '$lib/pocketbase';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const { user } = await parent();
    
    if (!user) {
        throw error(401, 'Unauthorized');
    }

    try {
        // Load or create investor profile
        let profile;
        try {
            profile = await pb.collection('investors_profiles')
                .getFirstListItem(`user="${user.id}"`);
        } catch {
            // Create profile if it doesn't exist
            profile = await pb.collection('investors_profiles').create({
                user: user.id,
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

        // Load wallet
        let wallet;
        try {
            wallet = await pb.collection('wallets')
                .getFirstListItem(`user="${user.id}"`);
        } catch {
            // Create wallet if it doesn't exist
            wallet = await pb.collection('wallets').create({
                user: user.id,
                balance: 0,
                currency: 'KES',
                status: 'active'
            });
        }

        // Load available campaigns
        const campaigns = await pb.collection('startup_profiles').getList(1, 50, {
            filter: 'verification_status = "verified"',
            sort: '-created'
        });

        return {
            profile,
            wallet,
            campaigns: campaigns.items
        };
    } catch (e) {
        console.error('Error loading investor data:', e);
        throw error(500, 'Failed to load investor data');
    }
}) satisfies PageLoad;