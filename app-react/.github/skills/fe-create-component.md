# Skill: Crear Componente React

## Propósito
Generar componentes React funcionales, tipados y reutilizables siguiendo las mejores prácticas del proyecto.

## Invocación
```
@copilot /fe-create-component [ComponentName] [options]
```

## Argumentos

- `ComponentName` (requerido): Nombre del componente en PascalCase
- `type` (opcional): 'ui', 'form', 'layout', 'feature' (default: 'ui')
- `props` (opcional): Lista de props (ej: "title, onClick, disabled")
- `styles` (opcional): 'tailwind' o 'css-module' (default: 'tailwind')

## Ejemplo de Invocación

```
@copilot /fe-create-component Button type:ui props:"label, onClick, disabled, variant" styles:tailwind
```

## Que Genera

1. **archivo.tsx**: Componente funcional con React.FC
2. **archivo.types.ts**: Interfaces de props
3. **archivo.module.css** (opcional): Estilos CSS Module
4. **archivo.test.tsx**: Tests básicos

## Estándares Aplicados

- TypeScript estricto required
- Props interface tipada
- React.memo para optimización
- Accesibilidad WCAG 2.1
- Tailwind CSS para estilos
- Barrel exports en index.ts
- JSDoc comments

## Ejemplo de Salida

```typescript
// Button.types.ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

// Button.tsx
import React from 'react';
import type { ButtonProps } from './Button.types';

/**
 * Componente Button reutilizable
 * @param props - Props del componente
 * @returns Elemento button personalizado
 */
export const Button: React.FC<ButtonProps> = React.memo(({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
}) => {
  const baseStyles = 'font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-disabled={disabled}
    >
      {label}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
```

## Uso en Componentes

```typescript
import { Button } from '@/components/ui';

export const MyComponent = () => {
  const handleClick = () => {
    console.log('Clicked!');
  };

  return (
    <Button 
      label="Click me"
      onClick={handleClick}
      variant="primary"
      size="md"
    />
  );
};
```

## Variantes Comunes

### Para formularios
```
@copilot /fe-create-component Input type:form props:"label, value, onChange, type, error" styles:tailwind
```

### Para secciones de página
```
@copilot /fe-create-component ProductCard type:feature props:"product, onEdit, onDelete" styles:tailwind
```

### Para layouts
```
@copilot /fe-create-component Container type:layout props:"children, className, maxWidth" styles:tailwind
```

## Checklist de Calidad

- [ ] TypeScript con tipos explícitos
- [ ] Props interface definida
- [ ] React.memo para optimización
- [ ] ARIA labels para accesibilidad
- [ ] Tailwind CSS utilizado correctamente
- [ ] Tests unitarios incluidos
- [ ] Documentación JSDoc
- [ ] Exportado en index.ts
- [ ] Responsive design considerado
- [ ] Dark mode compatible
