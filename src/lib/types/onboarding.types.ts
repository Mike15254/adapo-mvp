export interface OnboardingStore {
    currentStep: number;
    userData: {
        email: string;
        password: string;
        passwordConfirm: string;
        name: string;
        role: 'investor' | 'startup';
    };
}

// src/lib/types/onboarding.types.ts
export interface InvestorOnboardingData {
    user: string;
    type: 'individual' | 'institution';
    investment_focus: string;
    verification_status: 'pending' | 'verified' | 'unverified';
    id_number: string;
    kra_pin: string;
}

export interface StartupOnboardingData {
    user: string;
    company_name: string;
    business_registration_number: string;
    industry: string;
    verification_status: 'pending' | 'verified' | 'unverified';
    description: string;
}