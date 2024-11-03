import { writable, derived } from 'svelte/store';

export type LoadingType = 'route' | 'page' | 'action';

interface LoadingState {
    isRouteLoading: boolean;
    isPageLoading: boolean;
    isActionLoading: boolean;
    loadingMessage: string;
    loadingType: LoadingType | null;
}

function createLoadingStore() {
    const { subscribe, set, update } = writable<LoadingState>({
        isRouteLoading: false,
        isPageLoading: false,
        isActionLoading: false,
        loadingMessage: '',
        loadingType: null
    });

    let loadingTimeout: number | undefined;

    return {
        subscribe,
        
        startLoading: (type: LoadingType, message = '') => {
            update(state => ({
                ...state,
                loadingMessage: message,
                loadingType: type,
                [type === 'route' ? 'isRouteLoading' : 
                 type === 'page' ? 'isPageLoading' : 'isActionLoading']: true
            }));
        },

        stopLoading: (type: LoadingType) => {
            // Clear any existing timeout
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }

            // Add minimal delay to prevent flashing
            loadingTimeout = setTimeout(() => {
                update(state => ({
                    ...state,
                    loadingMessage: '',
                    loadingType: null,
                    [type === 'route' ? 'isRouteLoading' : 
                     type === 'page' ? 'isPageLoading' : 'isActionLoading']: false
                }));
            }, 300);
        },

        setLoadingMessage: (message: string) => {
            update(state => ({ ...state, loadingMessage: message }));
        },

        reset: () => {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
            set({
                isRouteLoading: false,
                isPageLoading: false,
                isActionLoading: false,
                loadingMessage: '',
                loadingType: null
            });
        }
    };
}

export const loadingStore = createLoadingStore();

// Derived store for any loading state
export const isLoading = derived(
    loadingStore,
    $state => $state.isRouteLoading || $state.isPageLoading || $state.isActionLoading
);