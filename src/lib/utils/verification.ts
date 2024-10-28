import type { VerificationDocument } from '$lib/types/';

export const verificationRequirements: Record<string, VerificationDocument[]> = {
  investor: [
    {
      type: 'id',
      label: 'National ID',
      required: true,
      description: 'Clear photo or scan of your National ID (front and back)',
      maxSize: 5242880, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'application/pdf']
    },
    {
      type: 'kra',
      label: 'KRA PIN Certificate',
      required: true,
      description: 'Your KRA PIN certificate in PDF format',
      maxSize: 5242880,
      allowedTypes: ['application/pdf']
    },
    {
      type: 'bank',
      label: 'Bank Statement',
      required: true,
      description: 'Last 3 months bank statement',
      maxSize: 5242880,
      allowedTypes: ['application/pdf']
    }
  ],
  startup: [
    {
      type: 'registration',
      label: 'Business Registration Certificate',
      required: true,
      description: 'Official business registration certificate',
      maxSize: 5242880,
      allowedTypes: ['application/pdf']
    },
    {
      type: 'kra',
      label: 'KRA PIN Certificate',
      required: true,
      description: 'Company KRA PIN certificate',
      maxSize: 5242880,
      allowedTypes: ['application/pdf']
    },
    {
      type: 'financial',
      label: 'Financial Statements',
      required: true,
      description: 'Last year financial statements (if applicable)',
      maxSize: 10485760, // 10MB
      allowedTypes: ['application/pdf']
    }
  ]
};