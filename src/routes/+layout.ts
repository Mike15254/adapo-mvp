import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';
import { authStore } from '$lib/stores/authStore';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  if (browser) {
    // Try to restore auth state from localStorage
    const storedAuth = localStorage.getItem('pb_auth');
    if (storedAuth) {
      try {
        const { token, model } = JSON.parse(storedAuth);
        pb.authStore.save(token, model);
        await authStore.revalidate();
      } catch (error) {
        console.error('Error restoring auth state:', error);
        // Clear invalid auth data
        localStorage.removeItem('pb_auth');
        pb.authStore.clear();
      }
    }
  }

  return {};
};