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

export interface InvestorOnboardingData {
    user: string;
    type: 'individual' | 'institution';
    investment_focus: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
    id_number: string;  // Add this
    kra_pin: string;  
}

export interface StartupOnboardingData {
    user: string;
    company_name: string;
    business_registration_number: string;
    industry: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    description: string;
}