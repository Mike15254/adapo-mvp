// types.ts
export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  customPattern?: RegExp;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: PasswordStrength;
  missingRequirements: string[];
}

// validators.ts
export class FormValidators {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email.trim());
  }

  static validateName(name: string, minLength = 2): boolean {
    return name.trim().length >= minLength;
  }

  static validatePassword(
    password: string,
    rules: ValidationRules = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    }
  ): PasswordValidationResult {
    const missingRequirements: string[] = [];
    
    if (rules.minLength && password.length < rules.minLength) {
      missingRequirements.push(`At least ${rules.minLength} characters`);
    }
    
    if (rules.maxLength && password.length > rules.maxLength) {
      missingRequirements.push(`Maximum ${rules.maxLength} characters`);
    }
    
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      missingRequirements.push('Uppercase letter');
    }
    
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      missingRequirements.push('Lowercase letter');
    }
    
    if (rules.requireNumbers && !/\d/.test(password)) {
      missingRequirements.push('Number');
    }
    
    if (rules.requireSpecialChars && !this.SPECIAL_CHARS_REGEX.test(password)) {
      missingRequirements.push('Special character');
    }
    
    if (rules.customPattern && !rules.customPattern.test(password)) {
      missingRequirements.push('Custom pattern requirement');
    }

    const strength = this.calculatePasswordStrength(password);
    
    return {
      isValid: missingRequirements.length === 0,
      strength,
      missingRequirements
    };
  }

  private static calculatePasswordStrength(password: string): PasswordStrength {
    let score = 0;
    
    // Length check
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (this.SPECIAL_CHARS_REGEX.test(password)) score += 2;
    
    // Complexity patterns
    if (/(?=.*[A-Z].*[A-Z])/.test(password)) score += 1; // Multiple uppercase
    if (/(?=.*[!@#$%^&*].*[!@#$%^&*])/.test(password)) score += 1; // Multiple special chars
    if (/(?=.*\d.*\d)/.test(password)) score += 1; // Multiple numbers
    
    if (score >= 7) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
  }
}

// form-state.ts
export class FormState {
  private validators: FormValidators;
  private passwordRules: ValidationRules;
  
  constructor(customPasswordRules?: ValidationRules) {
    this.validators = new FormValidators();
    this.passwordRules = customPasswordRules || {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    };
  }

  validateForm(userData: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    passwordConfirm?: string;
  }, field?: keyof typeof userData) {
    const validation = {
      isEmailValid: true,
      isFirstNameValid: true,
      isLastNameValid: true,
      passwordValidation: {
        isValid: true,
        strength: 'strong' as PasswordStrength,
        missingRequirements: [] as string[]
      },
      isPasswordMatch: true,
      isFormValid: false
    };

    if (!field || field === 'email') {
      validation.isEmailValid = FormValidators.validateEmail(userData.email || '');
    }

    if (!field || field === 'firstName') {
      validation.isFirstNameValid = FormValidators.validateName(userData.firstName || '');
    }

    if (!field || field === 'lastName') {
      validation.isLastNameValid = FormValidators.validateName(userData.lastName || '');
    }

    if (!field || field === 'password') {
      validation.passwordValidation = FormValidators.validatePassword(userData.password || '', this.passwordRules);
      if (userData.passwordConfirm) {
        validation.isPasswordMatch = userData.password === userData.passwordConfirm;
      }
    }

    if (!field || field === 'passwordConfirm') {
      validation.isPasswordMatch = (userData.password || '') === (userData.passwordConfirm || '');
    }

    validation.isFormValid = 
      validation.isEmailValid &&
      validation.isFirstNameValid &&
      validation.isLastNameValid &&
      validation.passwordValidation.isValid &&
      validation.isPasswordMatch &&
      !!userData.firstName &&
      !!userData.lastName &&
      !!userData.email &&
      !!userData.password &&
      !!userData.passwordConfirm;

    return validation;
  }
}