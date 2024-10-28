import { browser } from '$app/environment';
import type { OnboardingStore } from '$lib/types/onboarding.types';

export const saveProgress = (store: OnboardingStore) => {
  if (browser) {
    const state = JSON.stringify(store);
    localStorage.setItem('onboarding_progress', state);
  }
};

export const loadProgress = (): OnboardingStore | null => {
  if (browser) {
    const saved = localStorage.getItem('onboarding_progress');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

export const clearProgress = () => {
  if (browser) {
    localStorage.removeItem('onboarding_progress');
  }
};