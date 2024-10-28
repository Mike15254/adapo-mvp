// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
    // Get cookie if it exists
    const authCookie = event.cookies.get('pb_auth');
    
    if (authCookie) {
        try {
            const authData = JSON.parse(authCookie);
            pb.authStore.save(authData.token, authData.model);
        } catch (error) {
            event.cookies.delete('pb_auth');
            pb.authStore.clear();
        }
    }

    const response = await resolve(event);
    return response;
};