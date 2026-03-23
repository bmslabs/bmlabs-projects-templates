/**
 * AuthDemo Page (Prompts I, J, K - Auth Context, Login/Signup, Protected Routes)
 * Demonstrates authentication flow
 */

import React, { useState } from 'react';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import {
  validateEmail,
  validatePassword
} from '../validators';

const AuthDemo: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'info'>('info');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Validate
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setLoginError((emailValidation.message || passwordValidation.message) ?? 'Invalid input');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      setEmail('');
      setPassword('');
      setActiveTab('info');
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-2xl text-slate-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Prompts I, J, K: Authentication
        </h1>

        {/* Auth Status */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Auth Status
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 mb-2">
                <span className="font-semibold">Authenticated:</span>{' '}
                {isAuthenticated ? (
                  <span className="text-green-600">✓ Yes</span>
                ) : (
                  <span className="text-red-600">✗ No</span>
                )}
              </p>

              {isAuthenticated && user && (
                <div className="bg-slate-100 p-4 rounded mt-4">
                  <p className="text-sm text-slate-700">
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <Button variant="danger" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </section>

        {/* Tabs */}
        {isAuthenticated ? (
          <section className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              User Information
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-lg font-semibold text-blue-900 mb-4">
                👤 Welcome, {user?.firstName} {user?.lastName}!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">User ID</p>
                  <p className="font-mono text-base text-slate-900">
                    {user?.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-mono text-base text-slate-900">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">First Name</p>
                  <p className="font-mono text-base text-slate-900">
                    {user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Last Name</p>
                  <p className="font-mono text-base text-slate-900">
                    {user?.lastName}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-100 rounded">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Stored in localStorage as:
                </p>
                <code className="text-xs text-slate-800">
                  window.localStorage.getItem('auth_user')
                </code>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-lg shadow p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }
                `}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded transition-colors ${
                  activeTab === 'info'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                Info
              </button>
            </div>

            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                {loginError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {loginError}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                >
                  Login
                </Button>

                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-900 font-semibold mb-2">
                    💡 Demo Credentials:
                  </p>
                  <p className="text-sm text-blue-800">
                    Email: any@email.com
                  </p>
                  <p className="text-sm text-blue-800">
                    Password: Abc123456
                  </p>
                </div>
              </form>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Authentication Features
                </h3>

                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        AuthContext Provider
                      </p>
                      <p className="text-sm text-slate-600">
                        Manages user state across the app
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        useAuth Hook
                      </p>
                      <p className="text-sm text-slate-600">
                        Access auth state and methods from anywhere
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        localStorage Persistence
                      </p>
                      <p className="text-sm text-slate-600">
                        User stays logged in after page refresh
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Protected Routes Pattern
                      </p>
                      <p className="text-sm text-slate-600">
                        Can wrap routes to require authentication
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Code Example */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Usage Example
          </h2>

          <div className="bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
            <pre className="text-sm">{`// Use AuthProvider in App
<AuthProvider>
  <App />
</AuthProvider>

// Access auth in any component
const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome {user.firstName}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </>
  );
};

// Protect routes
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthDemo;
