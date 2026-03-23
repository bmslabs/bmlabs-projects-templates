import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

/**
 * Hook para manejo de formularios con validación
 */
export interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (
    onSubmit: (values: T) => Promise<void> | void
  ) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
  reset: () => void;
  setValues: (values: T) => void;
}

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormResult<T> => {
  const [values, setValuesState] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));

      // Validar campo si existe validador
      if (validate) {
        const newErrors = validate({ ...values, [field]: value });
        setErrors((prev) => ({
          ...prev,
          [field]: newErrors[field],
        }));
      }
    },
    [validate, values]
  );

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const fieldValue =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
      setFieldValue(name as keyof T, fieldValue);
    },
    [setFieldValue]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void> | void) =>
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar todos los campos
        if (validate) {
          const newErrors = validate(values);
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) {
            return;
          }
        }

        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleSubmit,
    reset,
    setValues: setValuesState,
  };
};

export default useForm;
