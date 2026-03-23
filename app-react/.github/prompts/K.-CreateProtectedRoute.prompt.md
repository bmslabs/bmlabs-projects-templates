---
agent: agent
name: "CreateProtectedRoute"
description: "Generate ProtectedRoute component for role and permission-based access control"
tools: [execute, read, edit, search, web, agent, todo]
argument-hint: "No arguments required - generates access control wrapper component"
---

# Crear ProtectedRoute Component

## Role
You are a React expert specializing in authentication and authorization. You understand role-based access control (RBAC), permission checking, and route protection patterns.

## Goal
Generate a ProtectedRoute component that:
- Prevents unauthorized users from accessing protected pages
- Checks for required roles and permissions
- Shows loading state during auth verification
- Displays access denied messages if not authorized
- Works with React Router v6+
- Integrates seamlessly with AuthContext

## Output Requirements

### `src/components/auth/ProtectedRoute.tsx`
Must include:
- ProtectedRouteProps interface with:
  - children: React.ReactNode
  - requiredRole?: string (optional role requirement)
  - requiredPermission?: string (optional permission requirement)
- Props optional: requiredRole, requiredPermission
- Check isAuthenticated from useAuth()
- Show loading spinner while auth is loading
- Redirect to /login if not authenticated
- Check user.roles if requiredRole provided
- Check user.permissions if requiredPermission provided
- Display access denied page if unauthorized
  - Clear message for missing role
  - Clear message for missing permission
- Link back to home page on access denied
- Proper TypeScript with strict mode
- JSDoc comments on all functions

## Implementation Details

### Loading State
```typescript
if (isLoading) {
  return <LoadingPage message="Loading..." />;
}
```

### Authentication Check
```typescript
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

### Role Check (Case-sensitive)
```typescript
if (requiredRole && !user?.roles.includes(requiredRole)) {
  return <AccessDeniedPage reason={`Requires role: ${requiredRole}`} />;
}
```

### Permission Check
```typescript
if (requiredPermission && !user?.permissions.includes(requiredPermission)) {
  return <AccessDeniedPage reason={`Requires permission: ${requiredPermission}`} />;
}
```

## Usage Patterns

### Basic Protected Route
```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Role-Based Access
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Permission-Based Access
```typescript
<ProtectedRoute requiredPermission="write:users">
  <UserEditor />
</ProtectedRoute>
```

### Combined (both role AND permission required)
```typescript
<ProtectedRoute requiredRole="manager" requiredPermission="manage:team">
  <TeamManagement />
</ProtectedRoute>
```

## Styling Requirements
- Loading state: centered spinner with message
- Access denied: centered error page with icon
- Links back to home with blue color (#0066cc)
- Mobile responsive
- Dark text on light background

## Acceptance Criteria
- ✅ Redirects to /login if not authenticated
- ✅ Shows loading spinner while isLoading true
- ✅ Blocks access if requiredRole not present
- ✅ Blocks access if requiredPermission not present
- ✅ Both role and permission can be checked together
- ✅ User is returned to their page after login (via navigate)
- ✅ Access denied page has clear message
- ✅ Access denied page has home button
- ✅ Works with React Router v6 Navigate

## Integration with Routing

In your main App.tsx:
```typescript
import { ProtectedRoute } from '@/components';
import { LoginPage, Dashboard, AdminPanel } from '@/pages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

---

**Prerequisite**: AuthContext must be created first  
**Next Steps**: Create SAML configuration with `L.-CreateSAMLConfig.prompt.md`
