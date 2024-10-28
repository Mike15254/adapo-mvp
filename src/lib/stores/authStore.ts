import { writable, derived } from 'svelte/store';
import { pb } from '$lib/pocketbase';
import { browser } from '$app/environment';
import type { User } from '$lib/types/';


interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: pb.authStore.isValid,
    user: pb.authStore.model,
    isLoading: false,
    error: null,
  });
 

  // Initialize the store with the current auth state
  if (browser) {
    // Listen for auth state changes
    pb.authStore.onChange((token, model) => {
      update(state => ({
        ...state,
        isAuthenticated: pb.authStore.isValid,
        user: model,
        isLoading: false
      }));
    });
  }

  return {
    subscribe,
    login: async (email: string, password: string) => {
      update(state => ({ ...state, isLoading: true, error: null }));
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        // Update local storage with auth data
        localStorage.setItem('pb_auth', JSON.stringify({
          token: pb.authStore.token,
          model: pb.authStore.model
        }));

        set({
          isAuthenticated: true,
          user: authData.record as User,
          isLoading: false,
          error: null
        });
        return authData;
      } catch (error) {
        update(state => ({
          ...state,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        }));
        throw error;
      }
    },
    logout: () => {
      pb.authStore.clear();
      localStorage.removeItem('pb_auth');
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    },
    updateUser: (userData: Partial<User>) => {
      update(state => ({
        ...state,
        user: state.user ? { ...state.user, ...userData } : null
      }));
    },
    // Add method to revalidate the session
    revalidate: async () => {
      update(state => ({ ...state, isLoading: true }));
      try {
        if (pb.authStore.isValid) {
          const authData = await pb.collection('users').authRefresh();
          set({
            isAuthenticated: true,
            user: authData.record as User,
            isLoading: false,
            error: null
          });
          return true;
        }
        return false;
      } catch (error) {
        pb.authStore.clear();
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: null
        });
        return false;
      }
    }
  };
}

export const authStore = createAuthStore();

