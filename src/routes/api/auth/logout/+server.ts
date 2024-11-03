import { pb } from '$lib/pocketbase';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    pb.authStore.clear();
    
    // Delete the cookie with proper options
    cookies.delete('pb_auth', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
    });

    return json({ success: true });
};