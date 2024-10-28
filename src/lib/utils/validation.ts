type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

const validationRules: Record<string, ValidationRule> = {
  email: {
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
  },
  password: {
      validate: (value) => value.length >= 8,
      message: 'Password must be at least 8 characters'
  },
  name: {
      validate: (value) => value.length >= 2,
      message: 'Name must be at least 2 characters'
  },
  company_name: {
      validate: (value) => value.length >= 2,
      message: 'Company name must be at least 2 characters'
  },
  business_registration_number: {
      validate: (value) => value.length >= 5,
      message: 'Please enter a valid registration number'
  },
  id_number: {
      validate: (value) => value.length >= 5,
      message: 'Please enter a valid ID number'
  },
  kra_pin: {
      validate: (value) => value.length >= 5,
      message: 'Please enter a valid KRA PIN'
  }
};

export const validate = (field: string, value: string): string | null => {
  if (!value) return 'This field is required';
  
  const rule = validationRules[field];
  if (!rule) return null;
  
  return rule.validate(value) ? null : rule.message;
};