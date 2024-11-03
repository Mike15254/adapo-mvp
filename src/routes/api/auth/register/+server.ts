import { pb } from '$lib/pocketbase';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const { firstName, lastName, email, password, passwordConfirm, role } = data;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !passwordConfirm || !role) {
            return json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if email already exists
        try {
            const existingUser = await pb.collection('users').getFirstListItem(`email = "${email}"`);
            if (existingUser) {
                return json(
                    { error: 'Email already exists. Please log in or use a different email.' },
                    { status: 400 }
                );
            }
        } catch (e) {
            // User not found - this is what we want
        }

        // Create user with combined name
        const user = await pb.collection('users').create({
            email,
            password,
            passwordConfirm,
            name: `${firstName} ${lastName}`,
            role
        });

        // Send verification email 
        await pb.collection('users').requestVerification(email);

        return json({ user });
    } catch (error: any) {
        console.error('Server registration error:', error);
        
        // Handle specific errors
        let errorMessage = 'Registration failed';

        if (error.status === 400) {
            if (error.data?.data?.email) {
                errorMessage = 'Email is invalid or already in use.';
            } else if (error.data?.data?.password) {
                errorMessage = 'Password does not meet requirements.';
            }
        }

        return json(
            { error: errorMessage },
            { status: error.status || 500 }
        );
    }
};