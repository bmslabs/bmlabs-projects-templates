/**
 * FormDemo Page (Prompt H - CreateForm)
 * Demonstrates form handling with validation and error states
 */

import React, { useState } from 'react';
import { Button, Input } from '../components';
import { useForm } from '../hooks/useForm';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateMatch,
  ValidationError
} from '../validators';

const FormDemo: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Login Form
  const loginForm = useForm(
    { email: '', password: '' },
    {
      email: validateEmail,
      password: validateRequired
    }
  );

  // Signup Form
  const signupFormInitialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const signupForm = useForm<typeof signupFormInitialValues>(
    signupFormInitialValues,
    {
      firstName: validateRequired,
      lastName: validateRequired,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (value: any): ValidationError => {
        const passwordValue = (signupForm.values as any).password || '';
        return validateMatch(
          value as string,
          passwordValue,
          'Passwords'
        );
      }
    }
  );

  const handleLoginSubmit =
    loginForm.handleSubmit(async (values: any) => {
      console.log('Login submitted:', values);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      loginForm.resetForm();
    });

  const handleSignupSubmit =
    signupForm.handleSubmit(async (values: any) => {
      console.log('Signup submitted:', values);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      signupForm.resetForm();
    });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Prompt H: CreateForm
        </h1>

        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
            ✓ Form submitted successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Login Form
            </h2>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                name="email"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={
                  loginForm.touched.email ? loginForm.errors.email : undefined
                }
                helperText="Enter your email address"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={
                  loginForm.touched.password
                    ? loginForm.errors.password
                    : undefined
                }
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={loginForm.isSubmitting}
              >
                Login
              </Button>

              <div className="text-sm text-slate-600">
                <p>💡 Try: user@example.com / password</p>
              </div>
            </form>
          </section>

          {/* Signup Form */}
          <section className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Signup Form
            </h2>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <Input
                label="First Name"
                placeholder="John"
                name="firstName"
                value={signupForm.values.firstName}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={
                  signupForm.touched.firstName
                    ? signupForm.errors.firstName
                    : undefined
                }
              />

              <Input
                label="Last Name"
                placeholder="Doe"
                name="lastName"
                value={signupForm.values.lastName}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={
                  signupForm.touched.lastName
                    ? signupForm.errors.lastName
                    : undefined
                }
              />

              <Input
                label="Email"
                type="email"
                placeholder="user@example.com"
                name="email"
                value={signupForm.values.email}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={
                  signupForm.touched.email ? signupForm.errors.email : undefined
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={signupForm.values.password}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={
                  signupForm.touched.password
                    ? signupForm.errors.password
                    : undefined
                }
                helperText="Min 8 chars, 1 uppercase, 1 number"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={signupForm.values.confirmPassword}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={
                  signupForm.touched.confirmPassword
                    ? signupForm.errors.confirmPassword
                    : undefined
                }
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={signupForm.isSubmitting}
              >
                Sign Up
              </Button>
            </form>
          </section>
        </div>

        {/* Form Features Section */}
        <section className="bg-white rounded-lg shadow p-8 mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Form Features Demonstrated
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Real-time validation with custom validators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Error messages displayed per field</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Touched tracking to show errors only after blur</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Loading state during submission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Form reset functionality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Password confirmation validation</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default FormDemo;
