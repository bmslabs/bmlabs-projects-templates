import React, { InputHTMLAttributes } from 'react';

/**
 * Input Component
 *
 * Input accesible con soporte para label, error messages y helper text.
 * Soporta todos los tipos de input HTML (text, email, password, number, etc).
 *
 * @example
 * <Input
 *   id="email"
 *   type="email"
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={errors.email}
 *   helperText="We'll never share your email"
 *   required
 * />
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above input */
  label?: string;

  /** Error message displayed below input */
  error?: string;

  /** Helper text displayed below input (if no error) */
  helperText?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Input component with built-in label, error handling and helper text
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', type = 'text', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine if input has error
    const hasError = !!error;

    // Determine border color based on error state
    const borderColor = hasError ? 'border-red-500' : 'border-gray-300';
    const focusRing = hasError
      ? 'focus:ring-red-500'
      : 'focus:ring-blue-500';

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            px-3.5 py-2.5 border rounded-lg text-sm
            bg-white text-gray-900
            placeholder-gray-500
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${borderColor}
            ${focusRing}
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />

        {/* Error message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-600 font-medium"
          >
            {error}
          </p>
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
