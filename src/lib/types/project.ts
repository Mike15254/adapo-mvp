import type  Record  from 'pocketbase';

// Expand interface for better type safety
interface ExpandedUser {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
}

interface ExpandedStartup {
    id: string;
    company_name: string;
    logo?: string;
    verification_status: string;
    industry: string;
}

interface ExpandedTransaction {
    id: string;
    amount: number;
    status: string;
    transaction_date: string;
    user: string;
    payment_method?: string;
    expand?: {
        user?: ExpandedUser;
    };
}

export type ProjectStatus = 'draft' | 'active' | 'funded' | 'closed' | 'pending_approval';
export type ProjectIndustry = 'technology' | 'healthcare' | 'finance' | 'education' | 'agriculture' | 'other';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type UpdateType = 'milestone' | 'general' | 'financial';

export interface TeamMember {
    name: string;
    role: string;
    bio?: string;
}

export interface TimelineEvent {
    title: string;
    date: string;
    description: string;
}

export interface BaseRecord {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}

export interface Project extends BaseRecord {
    title: string;
    description: string;
    industry: ProjectIndustry;
    funding_goal: number;
    current_funding: number;
    min_investment: number;
    status: ProjectStatus;
    start_date: string;
    end_date: string;
    campaign_duration: number;
    startup: string;
    raised?: number;
    approval_status: ApprovalStatus;
    approval_notes?: string;
    pitch_deck?: string;
    project_video?: string;
    project_images?: string[];
    project_timeline: TimelineEvent[];
    team_members: TeamMember[];
    expand?: {
        startup?: ExpandedStartup;
        transactions?: ExpandedTransaction[];
    };
}

export interface ProjectUpdate extends BaseRecord {
    project: string;
    title: string;
    content: string;
    date: string;
    type: UpdateType;
    attachments?: string[];
    expand?: {
        project?: Project;
    };
}

export interface ProjectStats {
    total_raised: number;
    investor_count: number;
    progress_percentage: number;
    days_remaining: number;
    recent_transactions: ExpandedTransaction[];
    recent_updates: ProjectUpdate[];
}