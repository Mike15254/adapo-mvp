// src/routes/api/auth/register/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { User } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json() as Partial<User> & { 
            password: string; 
            passwordConfirm: string;
        };

        console.log('Received registration data:', JSON.stringify(body, null, 2));

        if (!body.email || !body.password || !body.passwordConfirm) {
            return json({ error: 'Email and password are required' }, { status: 400 });
        }

        if (body.password !== body.passwordConfirm) {
            return json({ error: 'Passwords do not match' }, { status: 400 });
        }

        // Add default values for required fields
        const userData = {
            email: body.email,
            password: body.password,
            passwordConfirm: body.passwordConfirm,
            name: body.name,
            role: body.role || 'investor',
            account_status: 'pending',
            verification_status: 'unverified',
            registration_date: new Date().toISOString().split('T')[0]
        };

        console.log('Processed user data:', JSON.stringify(userData, null, 2));

        const user = await pb.collection('users').create(userData);
        console.log('User created successfully:', user);

        // Authenticate the user after registration
        const authData = await pb.collection('users').authWithPassword(body.email, body.password);

        return json({ user: authData.record });
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            return json({ error: error.message }, { status: 400 });
        } else {
            console.error('Unexpected error:', error);
            return json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
        }
    }
};