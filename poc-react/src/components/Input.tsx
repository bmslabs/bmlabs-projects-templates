/**
 * Input Component (Prompt A - CreateComponent)
 * Form input component: accessible, typed, validated
 */

import React from 'react';
import clsx from 'clsx';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Container class */
  containerClassName?: string;
}

/**
 * Input Component - Reusable form input with validation
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="user@example.com"
 *   error={errors.email}
 * />
 */
const Input = React.memo<InputProps>(
  React.forwardRef<HTMLInputElement, InputProps>(
    ({
      label,
      error,
      helperText,
      containerClassName,
      className,
      id,
      ...props
    }, ref) => {
      const inputId = id || `input-${Math.random()}`;

      return (
        <div className={clsx('flex flex-col', containerClassName)}>
          {label && (
            <label
              htmlFor={inputId}
              className="mb-2 text-sm font-medium text-slate-700"
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={clsx(
              'px-3 py-2 rounded border',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              error
                ? 'border-red-500 focus:ring-red-400'
                : 'border-slate-300 focus:ring-blue-400',
              className
            )}
            {...props}
          />
          {error && (
            <p
              id={`${inputId}-error`}
              className="mt-1 text-sm text-red-600"
            >
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-1 text-sm text-slate-500">{helperText}</p>
          )}
        </div>
      );
    }
  )
);

Input.displayName = 'Input';

export { Input };
export default Input;
