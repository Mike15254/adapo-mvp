import { writable } from 'svelte/store';

interface LoadingState {
    isRouteLoading: boolean;
    isPageLoading: boolean;
    loadingMessage: string;
}

const createLoadingStore = () => {
    const { subscribe, set, update } = writable<LoadingState>({
        isRouteLoading: false,
        isPageLoading: false,
        loadingMessage: ''
    });

    return {
        subscribe,
        setRouteLoading: (isLoading: boolean) => {
            update(state => ({ ...state, isRouteLoading: isLoading }));
        },
        setPageLoading: (isLoading: boolean, message = '') => {
            update(state => ({
                ...state,
                isPageLoading: isLoading,
                loadingMessage: message
            }));
        },
        reset: () => {
            set({
                isRouteLoading: false,
                isPageLoading: false,
                loadingMessage: ''
            });
        }
    };
};

export const loadingStore = createLoadingStore();