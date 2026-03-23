import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { SignupData } from '@/contexts/AuthContext';
import { Button, Input } from '@/components';
import { validators } from '@/utils';

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Signup Page
 * Allows new users to create an account with email, name and password
 */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!validators.minLength(formData.name, 2)) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!validators.maxLength(formData.name, 100)) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validators.minLength(formData.password, 8)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    if (!agreeTerms) {
      setApiError('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      setApiError(null);
      clearError();

      await signup(formData);
      
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
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
    setFormData((prev: SignupData) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
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

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
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

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              disabled={loading}
              required
              aria-label="Full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="At least 8 characters"
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
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              disabled={loading}
              required
              aria-label="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              className="mt-1"
              aria-label="Agree to terms and conditions"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => window.open('/terms', '_blank')}
              >
                terms and conditions
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label={loading ? 'Creating account...' : 'Create account'}
            fullWidth
            disabled={loading || !agreeTerms}
            loading={loading}
            aria-busy={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
