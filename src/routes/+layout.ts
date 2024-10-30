// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { AuthService } from '$lib/services/auth.service';
import type { AuthUser } from '$lib/types/auth.types';

interface LayoutData {
    user: AuthUser | null;
    isAuthenticated: boolean;
    allowedRoute: boolean;
}

export const load: LayoutLoad = async ({ url }): Promise<LayoutData> => {
    if (!browser) {
        return { user: null, isAuthenticated: false, allowedRoute: true };
    }

    // Initialize auth state
    await AuthService.initialize();

    const user = AuthService.getCurrentUser();
    const isAuthenticated = !!user;

    // Define public routes that don't require verification
    const publicRoutes = ['/login', '/register', '/verify-email', '/forgot-password'];
    const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));
    
    // Define protected routes
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

    // Handle routing logic
    if (isAuthenticated && user) {
        if (!user.verified) {
            // Allow unverified users to see their profile info but restrict access
            if (isProtectedRoute && url.pathname !== '/verify-email') {
                throw redirect(302, '/verify-email');
            }
        } else if (isPublicRoute) {
            // Redirect verified users away from auth pages
            throw redirect(302, `/dashboard/${user.role}`);
        }
    } else if (isProtectedRoute) {
        // Redirect unauthenticated users
        throw redirect(302, '/login');
    }

    return {
        user,
        isAuthenticated,
        // Route is allowed if it's public, or user is verified for protected routes
        allowedRoute: isPublicRoute || (isAuthenticated && user?.verified) || false
    };
};

export const ssr = false;