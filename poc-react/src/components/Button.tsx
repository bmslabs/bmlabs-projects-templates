/**
 * Button Component (Prompt A - CreateComponent)
 * UI Component example: fully typed, accessible, optimized
 */

import React from 'react';
import clsx from 'clsx';

export interface ButtonProps {
  /** Button text or content */
  children: React.ReactNode;
  /** Button variant style */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state (shows spinner) */
  isLoading?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Button Component - Reusable UI Component
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click Me
 * </Button>
 */
const Button = React.memo<ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    onClick,
    className,
    type = 'button',
    ariaLabel
  }) => {
    const baseStyles = 'font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={isLoading}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {isLoading ? (
          <>
            <span className="inline-block mr-2">⏳</span>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
