// src/routes/dashboard/+layout.ts
import type { LayoutLoad } from './$types';
import { requireVerified } from '$lib/guards/auth.guard';

export const load: LayoutLoad = async (event) => {
    const user = await requireVerified(event);
    return { user };
};