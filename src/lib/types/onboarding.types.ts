export type UserRole = 'investor' | 'startup';
export type VerificationStatus = 'unverified' | 'pending' | 'verified';
export type AccountStatus = 'pending' | 'active' | 'suspended';
export type Industry = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
export type InvestorType = 'individual' | 'institution';

// Core user data for registration
export interface UserData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    role: UserRole;
}

// Investor onboarding data
export interface InvestorProfile {
    type: InvestorType;
    investment_focus: Industry;
    id_number: string;
    kra_pin: string;
    verification_status: VerificationStatus;
}

// Startup onboarding data
export interface StartupProfile {
    company_name: string;
    business_registration_number: string;
    industry: Industry;
    description: string;
    verification_status: VerificationStatus;
}

// Store state interface
export interface OnboardingState {
    currentStep: number;
    userData: UserData;
    investorData?: InvestorProfile;
    startupData?: StartupProfile;
}