import { writable } from 'svelte/store';
import type { OnboardingStore } from '$lib/types/onboarding.types';
import { saveProgress, clearProgress } from '$lib/utils/progress';

function createOnboardingStore() {
  const initialState: OnboardingStore = {
    currentStep: 1,
    userData: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      role: 'investor'
    }
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    setStep: (step: number) => update(state => {
      const newState = { ...state, currentStep: step };
      saveProgress(newState);
      return newState;
    }),
    updateUserData: (data: Partial<OnboardingStore['userData']>) => update(state => {
      const newState = { ...state, userData: { ...state.userData, ...data } };
      saveProgress(newState);
      return newState;
    }),
    reset: () => {
      clearProgress();
      set(initialState);
    },
    complete: () => {
      clearProgress();
      update(state => ({ ...state, currentStep: 5 }));
    }
  };
}

export const onboardingStore = createOnboardingStore();