import React, { InputHTMLAttributes } from 'react';

/**
 * Checkbox Component
 *
 * Checkbox accesible con label integrado y soporte para errores.
 *
 * @example
 * <Checkbox
 *   id="terms"
 *   label="I accept the terms and conditions"
 *   checked={acceptTerms}
 *   onChange={(e) => setAcceptTerms(e.target.checked)}
 *   error={errors.terms}
 *   required
 * />
 */

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text or React node */
  label?: React.ReactNode;

  /** Error message to display */
  error?: string;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Checkbox component with built-in label and error handling
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const inputId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={`
              w-4 h-4 mt-1 rounded border border-gray-300
              text-blue-600 bg-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <span className="text-sm text-gray-700">{label}</span>
        </label>

        {/* Error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-600 font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
