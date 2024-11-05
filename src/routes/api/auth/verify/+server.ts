// routes/api/auth/verify/+server.ts
import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return json({ message: 'Email is required' }, { status: 400 });
        }

        await pb.collection('users').requestVerification(email);
        
        return json({
            success: true,
            message: 'Verification email sent successfully'
        });
    } catch (error: any) {
        return json(
            { message: error.message || 'Failed to send verification email' }, 
            { status: error.status || 500 }
        );
    }
};

// Handle resend verification
export const PUT: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return json({ message: 'Email is required' }, { status: 400 });
        }

        await pb.collection('users').requestVerification(email);
        
        return json({
            success: true,
            message: 'Verification email resend successfully'
        });
    } catch (error: any) {
        return json(
            { message: error.message || 'Failed to resend verification email' }, 
            { status: error.status || 500 }
        );
    }
};