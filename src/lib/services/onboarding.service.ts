import { AuthService } from './auth.service';
import type { RegisterData } from '../types/auth.types';
import { pb } from '../pocketbase';

export class OnboardingService {
    static async completeRegistration(
        userData: RegisterData,
        profileData: any  // type will be inferred from the collection
    ) {
        try {
            // Register the user
            const user = await AuthService.register(userData);

            // Create profile based on role
            if (user) {
                const collection = userData.role === 'investor' ? 'investors_profiles' : 'startup_profiles';
                await pb.collection(collection).create({
                    user: user.id,
                    ...profileData
                });
            }

            return user;
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    }
}