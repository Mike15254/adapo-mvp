import { pb } from './pocketbase';
import { get } from 'svelte/store';
import { currentUser } from './stores/userStore';
import type { RecordModel } from 'pocketbase';

export interface UserData {
    id: string;
    email: string;
    name: string;
    userType: 'investor' | 'entrepreneur';
}

export type User = UserData;

export interface InvestorData {
    id?: string;
    user: string;
    profession: string;
    investmentPreference: 'tech' | 'health' | 'finance' | 'other';
    verificationStatus: 'pending' | 'verified';
}

export interface EntrepreneurData {
    id?: string;
    user: string;
    profession: string;
    companyName: string;
    verificationStatus: 'pending' | 'verified';
}

export interface RegisterData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    userType: 'investor' | 'entrepreneur';
}

function convertToUserData(record: RecordModel): UserData {
    return {
        id: record.id,
        email: record.email,
        name: record.name,
        userType: record.userType
    };
}

export async function registerUser(userData: RegisterData): Promise<UserData> {
    try {
        const record = await pb.collection('users').create(userData);
        await loginUser(userData.email, userData.password);
        return convertToUserData(record);
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export async function createProfile(profileData: InvestorData | EntrepreneurData, userType: 'investor' | 'entrepreneur') {
    try {
        const collection = userType === 'investor' ? 'investors' : 'entrepreneurs';
        const record = await pb.collection(collection).create(profileData);
        return record;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
}



export async function loginUser(email: string, password: string): Promise<UserData> {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        if (!authData.record.verified) {
            await pb.authStore.clear();
            throw new Error('Email not verified');
        }
        
        const user = convertToUserData(authData.record);
        currentUser.set(user);
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export function logoutUser(): void {
    pb.authStore.clear();
    currentUser.set(null);
}

export async function sendVerificationEmail(email: string): Promise<void> {
    try {
        await pb.collection('users').requestVerification(email);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

export async function confirmVerification(token: string): Promise<void> {
    try {
        await pb.collection('users').confirmVerification(token);
    } catch (error) {
        console.error('Error confirming verification:', error);
        throw error;
    }
}

export async function updateUser(userId: string, data: Partial<UserData>): Promise<UserData> {
    try {
        const record = await pb.collection('users').update(userId, data);
        const updatedUser = convertToUserData(record);
        currentUser.set(updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export function getCurrentUser(): UserData | null {
    return get(currentUser);
}

export function isAuthenticated(): boolean {
    return pb.authStore.isValid;
}