import { writable } from 'svelte/store';
import type { UserRole } from '$lib/types/auth.types';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role: UserRole | '';
}

interface OnboardingState {
    currentStep: number;
    userData: UserData;
}

function createOnboardingStore() {
    const { subscribe, set, update } = writable<OnboardingState>({
        currentStep: 1,
        userData: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            role: ''
        }
    });

    return {
        subscribe,
        setStep: (step: number) => {
            update(state => ({ ...state, currentStep: step }));
        },
        updateUserData: (data: Partial<UserData>) => {
            update(state => ({
                ...state,
                userData: { ...state.userData, ...data }
            }));
        },
        reset: () => {
            set({
                currentStep: 1,
                userData: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    role: ''
                }
            });
        }
    };
}

export const onboardingStore = createOnboardingStore();