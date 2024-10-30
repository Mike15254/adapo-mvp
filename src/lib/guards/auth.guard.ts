import { redirect, type LoadEvent } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { authStore } from '../stores/authStore';
import type { AuthUser } from '../types/auth.types';

export async function requireAuth(event: LoadEvent): Promise<AuthUser> {
    const { isAuthenticated, user } = get(authStore);
    
    if (!isAuthenticated || !user) {
        throw redirect(302, '/login');
    }
    
    return user;
}

export async function requireVerified(event: LoadEvent): Promise<AuthUser> {
    const user = await requireAuth(event);
    
    // Check PocketBase's native verified field
    if (!user.verified) {
        throw redirect(302, '/verify-email');
    }
    
    return user;
}

export async function requireRole(event: LoadEvent, allowedRoles: string[]): Promise<AuthUser> {
    const user = await requireVerified(event); // Change from requireAuth to requireVerified
    
    if (!allowedRoles.includes(user.role)) {
        throw redirect(302, `/dashboard/${user.role}`);
    }
    
    return user;
}

// New guard for the verify-email page
export async function requireUnverified(event: LoadEvent): Promise<AuthUser> {
    const user = await requireAuth(event);
    
    // Redirect verified users away from verification page
    if (user.verified) {
        throw redirect(302, `/dashboard/${user.role}`);
    }
    
    return user;
}

export async function redirectIfAuthenticated(event: LoadEvent) {
    const { isAuthenticated, user } = get(authStore);
    
    if (isAuthenticated && user) {
        if (!user.verified) {
            throw redirect(302, '/verify-email');
        }
        throw redirect(302, `/dashboard/${user.role}`);
    }
}