---
agent: "GitHub Copilot"
model: "Claude - Haiku 4.5"
name: "CreateAuthContext"
description: "Generate AuthContext and useAuth hook for application-wide authentication state management"
tools: ["read_file", "create_file", "edit_notebook_file"]
argument-hint: "No arguments required - generates complete auth context with login/signup/logout"
---

# Crear Auth Context y UseAuth Hook

## Role
You are a React expert specializing in authentication patterns and state management. You understand best practices for managing global auth state, token handling, and role-based access control.

## Goal
Generate a complete authentication context (`AuthContext.tsx`) with a custom `useAuth` hook that provides:
- User state management (login, signup, logout)
- Token persistence in localStorage
- Role and permission checking
- Error handling and loading states
- Automatic token refresh support
- SAML login support

## Output Requirements

Generate the following files:

### 1. `src/contexts/AuthContext.tsx`
Must include:
- `User` interface with id, email, name, roles, permissions
- `AuthContextType` interface with all methods
- `AuthProvider` component wrapping the application
- `useAuth` custom hook for components
- Methods: login(), signup(), logout(), refreshToken(), updateProfile(), hasRole(), hasPermission()
- TypeScript with strict mode enabled
- Proper error handling with try-catch
- localStorage for token persistence
- JSDoc comments on all public methods

### 2. `src/services/authService.ts`
Must include:
- `AuthService` class with all API methods
- Methods:
  - login(credentials) - Direct authentication
  - signup(userData) - User registration
  - logout() - Logout notification to backend
  - refreshToken(token) - Token refresh
  - getProfile() - Fetch current user
  - updateProfile(data) - Update user data
  - changePassword() - Password change
  - requestPasswordReset() - Password reset request
  - resetPassword() - Password reset execution
  - validateSAML(samlResponse) - SAML authentication
  - getSAMLMetadata() - Get SAML config
  - enable2FA() - Setup 2FA
  - verify2FA() - Verify 2FA code
- Error handling with user-friendly messages
- Request validation (null checks)
- Proper TypeScript interfaces for requests/responses

## Implementation Details

### Token Management
- Store `auth_token` and `refresh_token` in localStorage
- Auto-inject Bearer token in requests via apiClient interceptor
- Refresh token when 401 response received
- Clear storage on logout or expired token

### State Management
- Keep user data in React context
- Loading state during API calls
- Error state for failed operations
- isAuthenticated boolean computed from user presence

### Security Considerations
- No secrets in code
- Validate all inputs (email, passwords)
- HTTPS only for production
- httpOnly cookies for tokens (if backend supports)
- Token expiration handling

### Role & Permission System
- User.roles array (e.g., ['admin', 'user'])
- User.permissions array (e.g., ['read:users', 'write:users'])
- hasRole() and hasPermission() helper methods
- Use in ProtectedRoute for access control

## Patterns to Follow

```typescript
// Proper TypeScript for context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<User>;
  // ... more methods
}

// Proper error handling
try {
  const response = await apiClient.post('/auth/login', credentials);
  localStorage.setItem('auth_token', response.token);
  setUser(response.user);
} catch (err) {
  const error = err instanceof Error ? err : new Error('Login failed');
  setError(error);
  throw error;
}

// useAuth hook with error boundary
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Acceptance Criteria
- ✅ useAuth hook throws error if used outside AuthProvider
- ✅ Token persists across page refreshes
- ✅ LOGIN endpoint requires valid email and password
- ✅ SIGNUP includes password confirmation validation
- ✅ Role/permission checks are case-insensitive or exact match
- ✅ Error messages are user-friendly (not stack traces)
- ✅ All async operations have loading state
- ✅ SAML support included as alternative auth method

## Example Usage in Component

```typescript
import { useAuth } from '@/contexts/AuthContext';

export const MyComponent: React.FC = () => {
  const { user, login, logout, isLoading, error } = useAuth();
  
  if (!user) {
    return <LoginForm onLogin={login} />;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

---

**Next Steps**: After generating context, create Login/Signup pages with `I.-CreateLoginPage.prompt.md`
