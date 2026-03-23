import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components';
import { validators } from '@/utils';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

/**
 * Login Page
 * Allows users to authenticate with email and password
 * Supports both direct authentication and SAML
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validators.minLength(formData.password, 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setApiError(null);
      clearError();

      await login(formData.email, formData.password);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/signup')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </button>
          </p>
        </div>

        {/* Error Messages */}
        {(apiError || authError) && (
          <div
            className="rounded-md bg-red-50 p-4 border border-red-200"
            role="alert"
            aria-label="Error message"
          >
            <p className="text-sm font-medium text-red-800">
              {apiError || authError?.message}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={loading}
                required
                aria-label="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mt-4">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                disabled={loading}
                required
                aria-label="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label={loading ? 'Signing in...' : 'Sign in'}
            fullWidth
            disabled={loading}
            loading={loading}
            aria-busy={loading}
          />
        </form>

        {/* SAML Authentication */}
        <div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              label="Sign in with SAML"
              variant="secondary"
              fullWidth
              onClick={() => window.location.href = '/api/auth/saml/login'}
              aria-label="Sign in with SAML"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
