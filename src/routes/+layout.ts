// src/routes/+layout.ts
import { pb } from '$lib/pocketbase';
import { authStore } from '$lib/stores/authStore';

export const load = async () => {
    return {
        user: pb.authStore.model,
        isAuthenticated: pb.authStore.isValid
    };
};

export const ssr = false;