import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

/**
 * Componente Button reutilizable
 * Soporta múltiples variantes, tamaños y estados
 */
export const Button: React.FC<ButtonProps> = React.memo(({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  loading = false,
  icon,
}) => {
  // Estilos base
  const baseStyles =
    'font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 justify-center';

  // Variantes
  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 focus:ring-blue-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100 focus:ring-gray-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 focus:ring-red-500',
    success:
      'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 focus:ring-green-500',
  };

  // Tamaños
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Estados deshabilitados
  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  // Ancho completo
  const widthStyles = fullWidth ? 'w-full' : '';

  const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyles}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin">⏳</span>
          {label}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
