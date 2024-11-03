import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email } = await request.json();

        if (!email) {
            return new Response(
                JSON.stringify({ message: 'Email is required' }), 
                { status: 400 }
            );
        }

        await pb.collection('users').requestVerification(email);
        
        return json({
            success: true,
            message: 'Verification email sent successfully'
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({ message: error.message || 'Failed to send verification email' }), 
            { status: error.status || 500 }
        );
    }
};