import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// Auto-refresh auth tokens
pb.authStore.onChange(() => {
    console.log('Auth state changed');
});

// Type for the User model
export interface UserData {
    id: string;
    email: string;
    name: string;
    userType: 'investor' | 'entrepreneur';
    verified?: boolean;
}

// Type for investor-specific data
export interface InvestorData {
    user: string; // This will be the user ID
    profession: string;
    investmentPreference: string;
    verificationStatus: 'pending' | 'verified';
}

// Type for entrepreneur-specific data
export interface EntrepreneurData {
    user: string; // This will be the user ID
    profession: string;
    companyName: string;
    verificationStatus: 'pending' | 'verified';
}

// Helper function to get the current user with correct typing
export function getCurrentUser(): UserData | null {
    if (pb.authStore.isValid) {
        return pb.authStore.model as UserData;
    }
    return null;
}

// Example of a typed API call
export async function getProduct(id: string) {
    return pb.collection('products').getOne(id);
}