---
agent: agent
name: "CreateLoginSignupPages"
description: "Generate Login and Signup pages with form validation and auth integration"
tools: [execute, read, edit, search, web, agent, todo]
argument-hint: "No arguments required - generates complete auth pages with validation"
---

# Crear Páginas de Login y Signup

## Role
You are a React and UX expert specializing in authentication forms. You create accessible, user-friendly login/signup pages with proper validation, error messages, and SAML support.

## Goal
Generate complete Login and Signup pages that:
- Connect to AuthContext via useAuth hook
- Validate email and password fields
- Show success and error messages clearly
- Support both direct auth and SAML login
- Are mobile-responsive and accessible (WCAG 2.1)
- Handle loading  states during API calls
- Redirect on successful authentication

## Output Requirements

Generate the following files:

### 1. `src/pages/auth/LoginPage.tsx`
Must include:
- Email and password input fields
- Client-side validation (email format, password length)
- Call useAuth().login() on form submit
- Error message display (both form errors and API errors)
- Loading state during authentication
- "Forgot password?" link (can be placeholder)
- "Create account" link to signup page
- SAML "Sign in with SAML" button
- Accessibility: aria-labels, semantic HTML, keyboard navigation
- Responsive design (mobile-first with Tailwind)
- JSDoc comments explaining components

### 2. `src/pages/auth/SignupPage.tsx`
Must include:
- Email, name, password, confirm password inputs
- Client-side validation:
  - Email format validation
  - Name length (2-100 chars)
  - Password strength (8+ chars)
  - Password == confirm password
  - Terms & conditions checkbox (required)
- Call useAuth().signup() on form submit
- Both form errors and API errors displayed
- Loading state while signing up
- "Already have an account?" link to login page
- Navigate to dashboard on success
- Accessibility and responsive design
- JSDoc comments

### 3. `src/pages/auth/ProfilePage.tsx`
Must include:
- Display current user info (name, email, role, permissions)
- Edit form for name and bio
- Read-only email field
- Account creation date display
- Logout button with confirmation dialog
- Delete account button (can be placeholder)
- Danger zone section with red styling
- Accessibility and responsive design
- Success message after profile update

## Implementation Details

### Form Validation Pattern
Use validators utility:
```typescript
import { validators } from '@/utils';

if (!validators.email(formData.email)) {
  newErrors.email = 'Invalid email format';
}
```

### Error Handling
```typescript
try {
  await login(email, password);
  navigate('/dashboard');
} catch (err) {
  setApiError(err instanceof Error ? err.message : 'Login failed');
}
```

### SAML Support
```typescript
<button onClick={() => window.location.href = '/api/auth/saml/login'}>
  Sign in with SAML
</button>
```

### Accessibility
- `aria-label` on inputs
- `aria-busy` on submit buttons during loading
- Semantic HTML: `<form>`, `<button type="submit">`, `<label htmlFor>`
- Focus management and keyboard navigation
- Error messages linked to inputs with `aria-describedby`

### Tailwind Classes
Use consistent patterns:
```typescript
<div className="max-w-md w-full space-y-8"> {/* Container */}
<button className="text-blue-600 hover:text-blue-500"> {/* Links */}
<div className="rounded-md bg-red-50 p-4 border border-red-200"> {/* Alerts */}
```

## Patterns to Follow

### LoginPage Structure
1. Header with site logo/title
2. Error display area (if any errors)
3. Form (email, password, forgot password link)
4. Divider with "Or continue with"
5. SAML button

### SignupPage Structure
1. Header with "Create account" title
2. Error display area
3. Form (email, name, password, confirm, terms checkbox)
4. Submit button
5. Link to login page

### ProfilePage Structure
1. Page header "Profile Settings"
2. Error & success message areas
3. Basic info section (name, email, role, bio)
4. Account timestamps
5. Danger zone (logout, delete account)

## Acceptance Criteria
- ✅ Form submits disabled while loading
- ✅ Validation runs before API call
- ✅ Password and confirm password must match
- ✅ Email format validated (using validators.email)
- ✅ Error messages clear and user-friendly
- ✅ Success redirects user to appropriate page
- ✅ SAML button redirects to backend endpoint
- ✅ ProfilePage shows user.roles and user.permissions
- ✅ Logout confirmation dialog implemented
- ✅ All fields have ARIA labels

## Example Usage Pattern

```typescript
// In LoginPage
const { login, error, clearError } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  try {
    setLoading(true);
    await login(formData.email, formData.password);
    navigate('/dashboard');
  } catch (err) {
    setApiError(err instanceof Error ? err.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

---

**Prerequisite**: AuthContext and AuthService must be created first  
**Next Steps**: Create ProtectedRoute component with `K.-CreateProtectedRoute.prompt.md`
