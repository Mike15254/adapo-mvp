export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: '' };
  }
  
  export function validateKRAPin(pin: string): boolean {
    // Add your KRA PIN validation logic here
    const kraRegex = /^[A-Z][0-9]{9}[A-Z]$/;
    return kraRegex.test(pin);
  }
  
  export function validateIDNumber(id: string): boolean {
    // Add your ID number validation logic here
    const idRegex = /^[0-9]{8}$/;
    return idRegex.test(id);
  }