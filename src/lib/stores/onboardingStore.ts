// src/lib/stores/onboardingStore.ts
import { writable } from 'svelte/store';

export interface OnboardingState {
  currentStep: number;
  totalSteps: number; // Added to track total steps
  userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    verification_status: 'unverified' | 'pending' | 'verified';
    account_status: 'pending' | 'active' | 'suspended';
    [key: string]: any;
  };
  isCompleted: boolean;
  verificationSent: boolean;
}

function createOnboardingStore() {
  const { subscribe, set, update } = writable<OnboardingState>({
    currentStep: 1,
    totalSteps: 4, // Now including verification step
    userData: {
      email: '',
      password: '',
      name: '',
      role: '',
      verification_status: 'unverified',
      account_status: 'pending'
    },
    isCompleted: false,
    verificationSent: false
  });

  return {
    subscribe,
    setStep: (step: number) => update(state => ({ ...state, currentStep: step })),
    updateUserData: (data: Partial<OnboardingState['userData']>) =>
      update(state => ({
        ...state,
        userData: { ...state.userData, ...data }
      })),
    setVerificationSent: (sent: boolean) =>
      update(state => ({ ...state, verificationSent: sent })),
    reset: () => set({
      currentStep: 1,
      totalSteps: 4,
      userData: {
        email: '',
        password: '',
        name: '',
        role: '',
        verification_status: 'unverified',
        account_status: 'pending'
      },
      isCompleted: false,
      verificationSent: false
    }),
    complete: () => update(state => ({ ...state, isCompleted: true }))
  };
}

export const onboardingStore = createOnboardingStore();