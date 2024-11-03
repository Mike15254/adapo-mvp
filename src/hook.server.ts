// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
    // Get the auth cookie
    const token = event.cookies.get('pb_auth');
    
    // console.log('🔐 [Hooks] Processing request:', {
    //     path: event.url.pathname,
    //     hasToken: !!token
    // });

    if (token) {
        try {
            // Validate the token
            pb.authStore.loadFromCookie(token);
            
            if (pb.authStore.isValid) {
                const user = pb.authStore.model;
                // console.log('✅ [Hooks] Valid auth token:', {
                //     userId: user?.id,
                //     role: user?.role
                // });
                
                // Add user to locals
                event.locals.user = user;
            } else {
                // console.log('⚠️ [Hooks] Invalid auth token');
                event.locals.user = null;
            }
        } catch (error) {
            // console.error('❌ [Hooks] Auth token error:', error);
            event.locals.user = null;
        }
    } else {
        // console.log('ℹ️ [Hooks] No auth token found');
        event.locals.user = null;
    }

    const response = await resolve(event);

    // Update the auth cookie if it changed
    const newToken = pb.authStore.exportToCookie();
    if (newToken !== token) {
        // console.log('🔄 [Hooks] Updating auth cookie');
        response.headers.append('set-cookie', newToken);
    }

    return response;
};