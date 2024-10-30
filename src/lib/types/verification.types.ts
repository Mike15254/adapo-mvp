// src/lib/types/verification.types.ts
import type { AuthUser } from './auth.types';

export type VerificationStatus = 'unverified' | 'documents_pending' | 'under_review' | 'changes_requested' | 'verified' | 'rejected';
export type DocumentType = 'verification' | 'business_registration' | 'pitch_deck' | 'other';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';
export type IndustryType = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';

export const VERIFICATION_STATUSES = {
    UNVERIFIED: 'unverified',
    DOCUMENTS_PENDING: 'documents_pending',
    UNDER_REVIEW: 'under_review',
    CHANGES_REQUESTED: 'changes_requested',
    VERIFIED: 'verified',
    REJECTED: 'rejected'
} as const;

export interface VerificationDocument {
    id: string;
    user: string;
    file: string;
    document_type: DocumentType;
    status: DocumentStatus;
    review_notes?: string;
    upload_date: string;
}

export interface StartupVerification {
    user: string;
    company_name: string;
    business_registration_number: string;
    description: string;
    industry: IndustryType;
    verification_status: VerificationStatus;
    verification_documents: string[];
    team_members: TeamMember[];
    founded_Date: string;
    funding_goal: number;
}

export interface TeamMember {
    name: string;
    role: string;
    bio?: string;
}

export interface VerificationStep {
    id: string;
    title: string;
    completed: boolean;
    required: boolean;
    description: string;
}

export interface VerificationState {
    documents: VerificationDocument[];
    profile: StartupVerification | null;
    currentStep: number;
    isLoading: boolean;
    error: string | null;
}