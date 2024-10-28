import type { Handle } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
    const authCookie = event.cookies.get('pb_auth');

    if (authCookie) {
        try {
            const authData = JSON.parse(authCookie);
            // Set the auth store
            pb.authStore.save(authData.token, authData.model);
        } catch (error) {
            // Clear the invalid cookie
            event.cookies.delete('pb_auth', { 
                path: '/',
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            pb.authStore.clear();
        }
    }

    const response = await resolve(event);
    return response;
};