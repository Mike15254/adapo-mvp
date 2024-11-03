// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { authStore } from '$lib/stores/auth.store';

const publicPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/', '/about'];

export const load: LayoutLoad = async ({ url }) => {
    const currentPath = url.pathname;
    // console.log('🚀 [Root Layout] Current path:', currentPath);

    if (!browser) {
        // console.log('⚠️ [Root Layout] Server-side rendering, returning null state');
        // return {
        //     user: null,
        //     isAuthenticated: false,
        // };
    }

    // console.log('🔄 [Root Layout] Initializing auth state...');
    const user = await authStore.initialize();
    const isAuthenticated = !!user;
    
    // console.log('👤 [Root Layout] Auth State:', {
    //     user: user ? { id: user.id, role: user.role } : null,
    //     isAuthenticated,
    //     path: currentPath
    // });

    // Check if current path is public
    const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
    // console.log('🔒 [Root Layout] Path access:', { isPublicPath, currentPath });

    // Handle protected routes
    if (currentPath.startsWith('/dashboard')) {
        // console.log('🛡️ [Root Layout] Checking dashboard access...');
        
        if (!isAuthenticated) {
            // console.log('❌ [Root Layout] Not authenticated, redirecting to login');
            throw redirect(302, `/login?redirect=${encodeURIComponent(currentPath)}`);
        }

        // Verify user role matches the dashboard type
        const dashboardRole = currentPath.split('/')[2];
        // console.log('👥 [Root Layout] Checking role match:', {
        //     userRole: user?.role,
        //     dashboardRole
        // });

        if (dashboardRole && user?.role !== dashboardRole) {
            // console.log('⚠️ [Root Layout] Role mismatch, redirecting to correct dashboard');
            throw redirect(302, `/dashboard/${user?.role}`);
        }
    }

    // Redirect authenticated users from auth pages to their dashboard
    if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
        // console.log('🔄 [Root Layout] Authenticated user on auth page, redirecting to dashboard');
        throw redirect(302, `/dashboard/${user.role}`);
    }

    return {
        user,
        isAuthenticated,
    };
};

export const ssr = false;