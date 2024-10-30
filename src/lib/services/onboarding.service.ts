// src/lib/services/onboarding.service.ts
import { pb } from '$lib/pocketbase';
import type { 
    UserData, 
    InvestorProfile, 
    StartupProfile, 
    VerificationStatus 
} from '../types/onboarding.types';

export class OnboardingError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'OnboardingError';
    }
}

export class OnboardingService {
    private static async createUser(userData: UserData) {
        try {
            const data = {
                ...userData,
                emailVisibility: true,
                verification_status: 'unverified' as VerificationStatus,
                account_status: 'pending',
                onboarding_completed: false
            };

            const record = await pb.collection('users').create(data);
            await pb.collection('users').requestVerification(userData.email);
            
            return record;
        } catch (error: any) {
            throw new OnboardingError(
                error.message || 'Failed to create user account',
                error.code
            );
        }
    }

    private static async createProfile(
        userId: string,
        profileData: InvestorProfile | StartupProfile,
        isInvestor: boolean
    ) {
        try {
            const collection = isInvestor ? 'investors_profiles' : 'startup_profiles';
            const data = {
                user: userId,
                ...profileData
            };

            return await pb.collection(collection).create(data);
        } catch (error: any) {
            throw new OnboardingError(
                error.message || 'Failed to create profile',
                error.code
            );
        }
    }

    static async completeOnboarding(
        userData: UserData,
        profileData: InvestorProfile | StartupProfile
    ) {
        try {
            // Create user account
            const user = await this.createUser(userData);
            
            // Create corresponding profile
            await this.createProfile(
                user.id,
                profileData,
                userData.role === 'investor'
            );

            // Authenticate user
            await pb.collection('users').authWithPassword(
                userData.email,
                userData.password
            );

            return user;
        } catch (error: any) {
            throw new OnboardingError(
                error.message || 'Onboarding failed',
                error.code
            );
        }
    }

    static async resendVerification(email: string) {
        try {
            await pb.collection('users').requestVerification(email);
        } catch (error: any) {
            throw new OnboardingError(
                error.message || 'Failed to resend verification',
                error.code
            );
        }
    }
}