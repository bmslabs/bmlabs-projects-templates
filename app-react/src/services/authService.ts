import apiClient from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    roles: string[];
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

/**
 * Authentication service
 * Handles all auth-related API calls and token management
 */
class AuthService {
  private baseUrl = '/auth';

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      return await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Register new user with email, password and name
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      if (!data.email || !data.password || !data.name) {
        throw new Error('Email, password and name are required');
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Remove confirmPassword before sending
      const { confirmPassword, ...signupData } = data;
      
      return await apiClient.post<AuthResponse>(`${this.baseUrl}/signup`, signupData);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    }
  }

  /**
   * Logout (notify backend)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(`${this.baseUrl}/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw - logout should succeed even if backend call fails
    }
  }

  /**
   * Refresh authentication token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string; expiresIn: number }> {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      return await apiClient.post<{ token: string; expiresIn: number }>(
        `${this.baseUrl}/refresh`,
        { refreshToken }
      );
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    try {
      return await apiClient.get(`${this.baseUrl}/me`);
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: { name?: string; avatar?: string; bio?: string }) {
    try {
      return await apiClient.put(`${this.baseUrl}/profile`, data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error('Current and new passwords are required');
      }

      await apiClient.post<void>(`${this.baseUrl}/change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to change password');
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      return await apiClient.post(`${this.baseUrl}/forgot-password`, { email });
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to request password reset'
      );
    }
  }

  /**
   * Verify password reset token and reset password
   */
  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ message: string }> {
    try {
      if (!token || !password) {
        throw new Error('Token and password are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      return await apiClient.post(`${this.baseUrl}/reset-password`, {
        token,
        password,
      });
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to reset password');
    }
  }

  /**
   * Validate SAML response and authenticate
   */
  async validateSAML(samlResponse: string): Promise<AuthResponse> {
    try {
      if (!samlResponse) {
        throw new Error('SAML response is required');
      }

      return await apiClient.post<AuthResponse>(`${this.baseUrl}/saml/login`, {
        samlResponse,
      });
    } catch (error) {
      console.error('SAML validation error:', error);
      throw new Error(error instanceof Error ? error.message : 'SAML authentication failed');
    }
  }

  /**
   * Get SAML metadata URL
   */
  async getSAMLMetadata(): Promise<{ metadataUrl: string }> {
    try {
      return await apiClient.get<{ metadataUrl: string }>(`${this.baseUrl}/saml/metadata`);
    } catch (error) {
      console.error('Get SAML metadata error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get SAML metadata'
      );
    }
  }

  /**
   * Request two-factor authentication setup
   */
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    try {
      return await apiClient.post<{ secret: string; qrCode: string }>(
        `${this.baseUrl}/2fa/enable`,
        {}
      );
    } catch (error) {
      console.error('Enable 2FA error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to enable 2FA');
    }
  }

  /**
   * Verify two-factor authentication code
   */
  async verify2FA(code: string): Promise<{ message: string }> {
    try {
      if (!code) {
        throw new Error('2FA code is required');
      }

      return await apiClient.post(`${this.baseUrl}/2fa/verify`, { code });
    } catch (error) {
      console.error('2FA verification error:', error);
      throw new Error(error instanceof Error ? error.message : '2FA verification failed');
    }
  }
}

export const authService = new AuthService();
