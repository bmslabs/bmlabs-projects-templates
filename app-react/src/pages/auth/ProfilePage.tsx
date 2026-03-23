import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components';
import { validators } from '@/utils';

interface ProfileFormData {
  name: string;
  email: string;
  bio?: string;
}

interface FormErrors {
  name?: string;
  bio?: string;
}

/**
 * User Profile Page
 * Allows users to view and edit their profile information
 */
export const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!validators.minLength(formData.name, 2)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.bio && !validators.maxLength(formData.bio, 500)) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission to update profile
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
      setSuccessMessage(null);

      await updateProfile({
        name: formData.name,
        bio: formData.bio,
      });
      
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // Redirect will be handled by auth state change
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setApiError(errorMessage);
    } finally {
      setLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account information and security settings</p>
      </div>

      {/* Error Messages */}
      {(apiError || authError) && (
        <div
          className="mb-6 rounded-md bg-red-50 p-4 border border-red-200"
          role="alert"
          aria-label="Error message"
        >
          <p className="text-sm font-medium text-red-800">
            {apiError || authError?.message}
          </p>
        </div>
      )}

      {/* Success Messages */}
      {successMessage && (
        <div
          className="mb-6 rounded-md bg-green-50 p-4 border border-green-200"
          role="status"
          aria-label="Success message"
        >
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
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

          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              aria-label="Email address (read-only)"
            />
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>

          {/* Role Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <div className="py-2 px-3 bg-gray-100 rounded border border-gray-300">
              <p className="text-sm text-gray-700">
                {user.roles.length > 0 ? user.roles.join(', ') : 'User'}
              </p>
            </div>
          </div>

          {/* Bio Input */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              aria-label="Bio"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {(formData.bio || '').length}/500 characters
            </p>
          </div>

          {/* Profile Account Info */}
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            <p><strong>Account created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><strong>Last updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label={loading ? 'Saving...' : 'Save Changes'}
            disabled={loading}
            loading={loading}
            aria-busy={loading}
          />
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        
        {/* Logout Section */}
        <div className="mb-6 pb-6 border-b border-red-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Sign Out</h3>
          <p className="text-sm text-gray-600 mb-4">
            Sign out from this device. You will need to sign in again to access your account.
          </p>
          
          {!showLogoutConfirm ? (
            <Button
              type="button"
              label="Sign Out"
              variant="danger"
              onClick={() => setShowLogoutConfirm(true)}
              disabled={loading}
            />
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-900">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  label="Confirm Sign Out"
                  variant="danger"
                  onClick={handleLogout}
                  disabled={loading}
                  loading={loading}
                />
                <Button
                  type="button"
                  label="Cancel"
                  variant="secondary"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Delete Account Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            type="button"
            label="Delete Account"
            variant="danger"
            disabled={loading}
            onClick={() => alert('Contact support to delete account')}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
