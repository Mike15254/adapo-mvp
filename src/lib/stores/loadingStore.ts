// src/lib/stores/loadingStore.ts
import { writable } from 'svelte/store';

interface LoadingState {
    isLoading: boolean;
    message: string;
}

export const loadingStore = writable<LoadingState>({
    isLoading: false,
    message: ''
});

export const showLoading = (message = 'Loading...') => {
    loadingStore.set({ isLoading: true, message });
};

export const hideLoading = () => {
    loadingStore.set({ isLoading: false, message: '' });
};