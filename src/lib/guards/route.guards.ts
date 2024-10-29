// src/lib/guards/route.guards.ts
import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase';
import type { AuthUser } from '$lib/types/auth.types';

// Define proper types
interface Parent {
    user: AuthUser | null;
    isAuthenticated: boolean;
}

export async function requireAuth(parentData: Parent): Promise<AuthUser> {
    if (!parentData.isAuthenticated || !parentData.user) {
        throw redirect(302, '/login');
    }

    return parentData.user;
}

export async function requireRole(user: AuthUser, allowedRoles: string[], redirectPath = '/login') {
    if (!user.role || !allowedRoles.includes(user.role)) {
        throw redirect(302, redirectPath);
    }
}

interface GuardOptions {
    allowedRoles?: string[];
    redirectTo?: string;
}

export function createAuthGuard(options: GuardOptions = {}) {
    return async (parentData: Parent) => {
        try {
            const user = await requireAuth(parentData);

            if (options.allowedRoles?.length) {
                await requireRole(user, options.allowedRoles, options.redirectTo);
            }

            return { user };
        } catch (error) {
            if (error instanceof Response) {
                throw error;
            }
            throw redirect(302, '/login');
        }
    };
}