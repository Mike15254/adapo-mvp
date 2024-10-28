// src/routes/api/auth/login/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return json({ error: 'Email and password are required' }, { status: 400 });
        }

        const authData = await pb.collection('users').authWithPassword(email, password);

        return json({ user: authData.record });
    } catch (error) {
        console.error('Login error:', error);
        
        if (error instanceof Error) {
            return json({ error: error.message }, { status: 400 });
        } else {
            return json({ error: 'An unexpected error occurred during login' }, { status: 500 });
        }
    }
};