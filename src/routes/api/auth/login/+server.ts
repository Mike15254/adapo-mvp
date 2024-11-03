import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return new Response(
                JSON.stringify({ message: 'Email and password are required' }), 
                { status: 400 }
            );
        }

        // Attempt authentication
        const authData = await pb.collection('users').authWithPassword(email, password);

        if (!authData.record.verified) {
            throw new Error('Please verify your email before logging in');
        }

        if (authData.record.account_status === 'suspended') {
            throw new Error('Your account has been suspended');
        }

        // Set auth cookie
        cookies.set('pb_auth', pb.authStore.exportToCookie(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return json({
            user: authData.record,
            token: authData.token
        });
        
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || 'An error occurred during login';
        
        return new Response(
            JSON.stringify({ message }), 
            { status }
        );
    }
};