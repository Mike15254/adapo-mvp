// src/lib/services/onboarding.service.ts
import { AuthService } from './auth.service';
import type { RegisterData } from '../types/auth.types';
import { pb } from '../pocketbase';

interface InvestorProfile {
    user: string;
    type: string;
    investment_focus: string;
    id_number: string;
    kra_pin: string;
    verification_status: 'pending' | 'verified' | 'unverified';
}

interface StartupProfile {
    user: string;
    company_name: string;
    business_registration_number: string;
    industry: string;
    description: string;
    verification_status: 'pending' | 'verified' | 'unverified';
}

export class OnboardingService {
    static async completeRegistration(
        userData: RegisterData,
        profileData: InvestorProfile | StartupProfile
    ) {
        try {
            const user = await AuthService.register(userData);

            if (user) {
                const collection = userData.role === 'investor' ? 'investors_profiles' : 'startup_profiles';
                await pb.collection(collection).create({
                    user: user.id,
                    ...profileData,
                    verification_status: 'pending'
                });
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    }
}