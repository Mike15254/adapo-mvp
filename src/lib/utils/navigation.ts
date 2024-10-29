// src/lib/utils/navigation.ts
import { goto } from '$app/navigation';
import { showLoading, hideLoading } from '$lib/stores/loadingStore';

export async function navigateWithLoading(path: string, message?: string) {
    showLoading(message);
    await goto(path);
    // Hide loading after a small delay to ensure smooth transition
    setTimeout(hideLoading, 300);
}