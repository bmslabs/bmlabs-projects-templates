import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * User representation in application
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth context type definition
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Component
 * Wraps entire application with authentication state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Validate token and fetch current user
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { user: userData, token, refreshToken } = data;

      // Store tokens
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      setUser(userData);

      return userData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const signup = useCallback(async (data: SignupData): Promise<User> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const responseData = await response.json();
      const { user: userData, token, refreshToken } = responseData;

      // Store tokens
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      setUser(userData);

      return userData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Signup failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      // Notify backend of logout
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {
          // Ignore errors on logout
        });
      }

      // Clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh authentication token
   */
  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      if (!response.ok) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.token);
      
      return data.token;
    } catch (err) {
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (data: Partial<User>): Promise<User> => {
    try {
      setError(null);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Profile update failed');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * Check if user has role
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.roles.includes(role) ?? false;
  }, [user]);

  /**
   * Check if user has permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  }, [user]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
    hasRole,
    hasPermission,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

export default AuthContext;
