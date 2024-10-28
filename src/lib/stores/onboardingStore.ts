import { writable } from 'svelte/store';

export interface OnboardingState {
  currentStep: number;
  userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    [key: string]: any;
  };
  isCompleted: boolean;
}

function createOnboardingStore() {
  const { subscribe, set, update } = writable<OnboardingState>({
    currentStep: 1,
    userData: {
      email: '',
      password: '',
      name: '',
      role: ''
    },
    isCompleted: false
  });

  return {
    subscribe,
    setStep: (step: number) => update(state => ({ ...state, currentStep: step })),
    updateUserData: (data: Partial<OnboardingState['userData']>) =>
      update(state => ({
        ...state,
        userData: { ...state.userData, ...data }
      })),
    reset: () => set({
      currentStep: 1,
      userData: {
        email: '',
        password: '',
        name: '',
        role: ''
      },
      isCompleted: false
    }),
    complete: () => update(state => ({ ...state, isCompleted: true }))
  };
}

export const onboardingStore = createOnboardingStore();
