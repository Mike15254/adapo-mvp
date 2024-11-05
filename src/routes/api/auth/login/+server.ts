// routes/api/auth/login/+server.ts
import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return json({ 
                message: 'Email and password are required' 
            }, { status: 400 });
        }

        try {
            // Attempt authentication
            const authData = await pb.collection('users').authWithPassword(email, password);

            // Check verification status
            if (!authData.record.verified) {
                return json({ 
                    message: 'Please verify your email before logging in' 
                }, { status: 403 });
            }

            // Check account status
            if (authData.record.account_status === 'suspended') {
                return json({ 
                    message: 'Your account has been suspended' 
                }, { status: 403 });
            }

            // Set auth cookie
            cookies.set('pb_auth', pb.authStore.exportToCookie(), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30 // 30 days
            });

            return json({
                user: authData.record,
                token: authData.token
            });
            
        } catch (authError: any) {
            // Handle PocketBase authentication errors
            if (authError.status === 400) {
                return json({ 
                    message: 'Invalid email or password' 
                }, { status: 401 });
            }
            throw authError; // Re-throw unexpected errors
        }
        
    } catch (error: any) {
        console.error('Login error:', error);
        
        return json({ 
            message: error.message || 'An unexpected error occurred' 
        }, { 
            status: error.status || 500 
        });
    }
};