/**
 * useForm Hook (Prompt D - CreateCustomHook)
 * Custom hook for form state management and validation
 */

import { useState, useCallback } from 'react';
import { ValidationError } from '../validators';

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  setValues: (values: T) => void;
  resetForm: () => void;
}

/**
 * useForm - Hook for managing form state
 * @example
 * const form = useForm(
 *   { email: '', password: '' },
 *   validateEmail,
 *   validatePassword
 * );
 */
export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validators?: Record<keyof T, (value: unknown) => ValidationError>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;

      setValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));

      // Validate on change if field is touched
      if (touched[name] && validators?.[name as keyof T]) {
        const validator = validators[name as keyof T];
        const result = validator(value);

        setErrors((prev) => ({
          ...prev,
          [name]: result.isValid ? '' : result.message || ''
        }));
      }
    },
    [touched, validators]
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name } = e.target;

      setTouched((prev) => ({
        ...prev,
        [name]: true
      }));

      // Validate on blur
      if (validators?.[name as keyof T]) {
        const validator = validators[name as keyof T];
        const result = validator(values[name as keyof T]);

        setErrors((prev) => ({
          ...prev,
          [name]: result.isValid ? '' : result.message || ''
        }));
      }
    },
    [values, validators]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {};
        let isFormValid = true;

        Object.keys(initialValues).forEach((key) => {
          if (validators?.[key as keyof T]) {
            const validator = validators[key as keyof T];
            const result = validator(values[key as keyof T]);

            if (!result.isValid) {
              newErrors[key] = result.message || '';
              isFormValid = false;
            }
          }
        });

        setErrors(newErrors);

        if (!isFormValid) return;

        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
    [initialValues, values, validators]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    resetForm
  };
};

export default useForm;
