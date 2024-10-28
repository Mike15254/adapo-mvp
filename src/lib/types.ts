export interface UserData {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    role: 'investor' | 'startup';
    account_status: 'pending' | 'active' | 'suspended';
    verification_status: 'unverified' | 'pending' | 'verified';
    registration_date: string;
  }
  
  export interface InvestorData {
    profession: string;
    type: 'individual' | 'institution';
    investment_focus: string;
    id_number: string;
    kra_pin: string;
    verificationStatus: 'pending' | 'verified' | 'unverified';
  }
  
  export interface StartupData {
    company_name: string;
    description: string;
    industry: string;
    founding_date: string;
    business_registration_number: string;
    verification_status: 'unverified' | 'pending' | 'verified';
  }
  