/**
 * Validators (Prompt G - CreateValidator)
 * Reusable validation functions for forms
 */

export interface ValidationError {
  isValid: boolean;
  message?: string;
}

/**
 * Email validator
 * @example validateEmail('user@example.com') // { isValid: true }
 */
export const validateEmail = (email: string): ValidationError => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * Password validator (min 8 chars, 1 uppercase, 1 number)
 */
export const validatePassword = (password: string): ValidationError => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters'
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  return { isValid: true };
};

/**
 * Required field validator
 */
export const validateRequired = (value: unknown): ValidationError => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: 'This field is required' };
  }

  return { isValid: true };
};

/**
 * Min length validator
 */
export const validateMinLength = (
  value: string,
  minLength: number
): ValidationError => {
  if (!value || value.length < minLength) {
    return {
      isValid: false,
      message: `Minimum ${minLength} characters required`
    };
  }

  return { isValid: true };
};

/**
 * Price validator (positive number)
 */
export const validatePrice = (price: number): ValidationError => {
  if (price === null || price === undefined) {
    return { isValid: false, message: 'Price is required' };
  }

  if (price <= 0) {
    return { isValid: false, message: 'Price must be greater than 0' };
  }

  if (!Number.isFinite(price)) {
    return { isValid: false, message: 'Price must be a valid number' };
  }

  return { isValid: true };
};

/**
 * URL validator
 */
export const validateUrl = (url: string): ValidationError => {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Invalid URL format' };
  }
};

/**
 * Match validator (confirms two values are equal)
 */
export const validateMatch = (
  value: string,
  compareValue: string,
  fieldName: string = 'values'
): ValidationError => {
  if (value !== compareValue) {
    return { isValid: false, message: `${fieldName} do not match` };
  }

  return { isValid: true };
};
