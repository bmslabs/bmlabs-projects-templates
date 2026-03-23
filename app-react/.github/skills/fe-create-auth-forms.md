# Skill: Formularios de Autenticación - Login, Signup, Profiles

## Propósito
Construir formularios seguros, accesibles y validados para login, registro y perfiles de usuario.

## Estructura General de Formularios

### 1. Email Validation
```typescript
import { validators } from '@/utils';

const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!validators.email(email)) {
    return 'Invalid email format';
  }
  return null;
};
```

### 2. Password Validation
```typescript
// Mínimo 8 caracteres
// Pueden ser números + letras

const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return 'Password is required';
  }
  if (!validators.minLength(password, 8)) {
    return 'Password must be 8+ characters';
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain letters and numbers';
  }
  return null;
};
```

### 3. Name Validation
```typescript
const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (!validators.minLength(name, 2)) {
    return 'Name must be at least 2 characters';
  }
  if (!validators.maxLength(name, 100)) {
    return 'Name must not exceed 100 characters';
  }
  return null;
};
```

## Componentes Necesarios

### Input Component (FALTA crear)

```typescript
// src/components/ui/Input.tsx
import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const Input = ({
  label,
  error,
  helperText,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          px-3 py-2 border rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <p id={`${props.id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

### Button Component (Ya existe)

```typescript
// src/components/Button.tsx - Ya existe
<Button type="submit" className="w-full">
  Iniciar Sesión
</Button>
```

## Patrón de Formulario de Login

```typescript
// src/pages/auth/LoginPage.tsx - Ya existe

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components';
import { validators } from '@/utils';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando usuario edita campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
            aria-label="Email address"
          />

          <Input
            id="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            helperText="Minimum 6 characters"
            required
            aria-label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
```

## Patrón de Formulario de Signup

```typescript
// src/pages/auth/SignupPage.tsx - Ya existe

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components';
import { validators } from '@/utils';
import Checkbox from '@/components/ui/Checkbox'; // Necesario crear

interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: SignupFormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation (8+ chars)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain letters';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain numbers';
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!formData.acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando usuario edita
    if (errors[field as keyof SignupFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
            autoComplete="name"
          />

          <Input
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <div>
            <Input
              id="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters, must include letters and numbers
            </p>
          </div>

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />

          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onChange={(checked) => handleChange('acceptTerms', checked)}
            label={
              <span>
                I accept the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </span>
            }
            error={errors.terms}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
```

## Checkbox Component (FALTA crear)

```typescript
// src/components/ui/Checkbox.tsx
import { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = ({ label, error, className, ...props }: CheckboxProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          aria-invalid={!!error}
          {...props}
        />
        <span className="text-sm text-gray-700">{label}</span>
      </label>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

## Accesibilidad en Formularios

✅ **WCAG 2.1 Compliant**

```typescript
// 1. Labels asociados a inputs
<label htmlFor="email">Email</label>
<input id="email" ... />

// 2. Error messages con aria-describedby
<input aria-describedby="email-error" />
<p id="email-error">Invalid email</p>

// 3. Indicar campos inválidos
<input aria-invalid={!!error} />

// 4. Mensajes de error con role="alert"
<div role="alert" className="text-red-600">
  {error}
</div>

// 5. Validación clara
<Input
  label="Password"
  helperText="Minimum 8 characters, letters and numbers"
/>

// 6. Teclado navigation
<form onKeyDown={(e) => {
  if (e.key === 'Enter') {
    handleSubmit(e);
  }
}}>
</form>
```

## Real-time Validation (Opcional)

```typescript
const handleBlur = (field: string) => {
  const error = validateField(field, formData[field]);
  if (error) {
    setErrors(prev => ({ ...prev, [field]: error }));
  }
};

<Input
  onBlur={() => handleBlur('email')}
/>
```

## Password Strength Indicator (Opcional)

```typescript
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

const renderStrength = (password: string) => {
  const strength = getPasswordStrength(password);
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i < strength ? colors[strength - 1] : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {strength === 0 && 'Very weak'}
        {strength === 1 && 'Weak'}
        {strength === 2 && 'Fair'}
        {strength === 3 && 'Good'}
        {strength === 4 && 'Strong'}
        {strength === 5 && 'Very strong'}
      </p>
    </div>
  );
};
```

## SAML Login Button

```typescript
const handleSAMLLogin = () => {
  // Redirigir a backend SAML endpoint
  window.location.href = '/api/auth/saml/login';
};

<Button
  variant="outline"
  onClick={handleSAMLLogin}
  className="w-full mt-4"
>
  Sign in with SSO
</Button>
```

## Componentes a Crear

Necesitas crear estos componentes UI:
- ✅ Input.tsx - Campos de texto con validación
- ✅ Checkbox.tsx - Checkboxes para términos
- (Button.tsx - Ya existe)
- (ProtectedRoute.tsx - Ya existe)

## Referencias

- [WCAG 2.1 Forms](https://www.w3.org/WAI/tutorials/forms/)
- [HTML Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [Password Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
