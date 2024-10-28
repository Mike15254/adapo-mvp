import  Record  from 'pocketbase';

// Base record interface to extend PocketBase's Record type
export interface BaseRecord extends Record {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

// Common types that can be reused
type VerificationStatus = 'unverified' | 'pending' | 'verified';
type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type Industry = 'tech' | 'health' | 'finance' | 'other';
type UserRole = 'investor' | 'startup';

export interface VerificationRequest extends BaseRecord {
  user: string;
  type: UserRole;
  status: ApprovalStatus;
  documents: string[];
  notes?: string;
  reviewer?: string;
  review_date?: string;
}

export interface ProjectUpdate extends BaseRecord {
  project: string;
  title: string;
  content: string;
  type: 'milestone' | 'general' | 'financial';
}

export interface User extends BaseRecord {
  email: string;
  name: string;
  role: UserRole;
  account_status: 'pending' | 'active' | 'suspended';
  verification_status: VerificationStatus;
  registration_date: string;
  profile_picture?: string;
}

export interface Investment extends BaseRecord {
  investor: string;
  project: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'refunded';
  expand?: {
    project?: Project;
    investor?: Investor;
  };
}

export interface Project extends BaseRecord {
  title: string;
  description: string;
  industry: Industry;
  funding_goal: number;
  current_funding: number;
  minInvestment: number;
  status: 'draft' | 'pending_approval' | 'active' | 'funded' | 'closed';
  start_date: string;
  end_date: string;
  startup: string;
  approval_status: ApprovalStatus;
  expand?: {
    investments?: Investment[];
    startup?: Startup;
  };
}

export interface Startup extends BaseRecord {
  user: string;
  company_name: string;
  description: string;
  industry: Industry;
  founding_date: string;
  business_registration_number: string;
  verification_status: VerificationStatus;
  verification_documents?: string[];
  verification_notes?: string;
  expand?: {
    user?: User;
    projects?: Project[];
  };
}

export interface Investor extends BaseRecord {
  user: string;
  profession: string;
  type: 'individual' | 'institution';
  investment_focus: string[];
  id_number: string;
  kra_pin: string;
  verification_status: VerificationStatus;
  verification_documents?: string[];
  verification_notes?: string;
  expand?: {
    user?: User;
    investments?: Investment[];
  };
}

export interface VerificationDocument {
  type: string;
  label: string;
  required: boolean;
  description: string;
  maxSize: number;
  allowedTypes: string[];
}

export interface VerificationRequirements {
  [key: string]: VerificationDocument[];
}

// Added type for expanded records
export type ExpandedRecord<T, E = {}> = T & {
  expand?: E;
};

export interface ListResult<T> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface ApiError {
  message: string;
  data?: unknown;
  code?: number;
}

export interface DashboardPageData {
  user: any;
  stats: {
      totalFunding: number;
      activeProjects: number;
      totalInvestors: number;
      recentActivity: any[];
  };
  startup: Startup | null;
  projects: Project[];
  investors: Investment[];
  error?: string;
}