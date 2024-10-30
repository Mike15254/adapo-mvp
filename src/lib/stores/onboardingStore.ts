import { writable } from 'svelte/store';
import type { OnboardingState, UserData } from '../types/onboarding.types';

const initialState: OnboardingState = {
    currentStep: 1,
    userData: {
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        role: 'investor'
    }
};

function createOnboardingStore() {
    const { subscribe, set, update } = writable<OnboardingState>(initialState);

    return {
        subscribe,
        setStep: (step: number) => update(state => ({ ...state, currentStep: step })),
        updateUserData: (data: Partial<UserData>) =>
            update(state => ({
                ...state,
                userData: { ...state.userData, ...data }
            })),
        reset: () => set(initialState),
        // Save progress to localStorage
        saveProgress: () => {
            update(state => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('onboardingProgress', JSON.stringify(state));
                }
                return state;
            });
        },
        // Load progress from localStorage
        loadProgress: () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('onboardingProgress');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    set(parsed);
                }
            }
        }
    };
}

export const onboardingStore = createOnboardingStore();