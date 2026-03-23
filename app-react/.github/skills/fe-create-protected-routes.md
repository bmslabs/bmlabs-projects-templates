# Skill: Protección de Rutas y Control de Acceso

## Propósito
Implementar control granular de acceso basado en autenticación, roles y permisos usando ProtectedRoute.

## ProtectedRoute Component

El componente ProtectedRoute ya existe en `src/components/auth/ProtectedRoute.tsx`:

```typescript
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string | string[];
  fallback?: React.ReactNode;
}
```

## Patrones de Uso

### 1. Protección Básica (Solo Autenticado)
```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```
- Redirige a `/login` si NO está autenticado
- Muestra Loading mientras se verifica auth

### 2. Protección por Rol
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```
- Solo usuarios con rol "admin" pueden acceder
- Otros ven página de "Access Denied"

### 3. Protección por Múltiples Roles
```typescript
<ProtectedRoute requiredRole={["admin", "moderator"]}>
  <ContentModeration />
</ProtectedRoute>
```
- Usuario necesita AL MENOS uno de los roles

### 4. Protección por Permisos
```typescript
<ProtectedRoute requiredPermission="write:articles">
  <ArticleEditor />
</ProtectedRoute>
```
- Solo permitir si user.permissions incluye "write:articles"

### 5. Protección Combinada
```typescript
<ProtectedRoute requiredRole="admin" requiredPermission="manage:users">
  <UserManager />
</ProtectedRoute>
```
- Requiere ROL + PERMISO simultáneamente

## Estructura de Roles y Permisos

### Formato de Roles
```typescript
interface User {
  roles: [
    "admin",      // Acceso total
    "moderator",  // Gestionar contenido/usuarios
    "editor",     // Crear/editar contenido
    "user"        // Usuario estándar
  ];
}
```

### Formato de Permisos
```typescript
interface User {
  permissions: [
    // Usuarios
    "read:users",
    "write:users",
    "delete:users",
    
    // Contenido
    "read:articles",
    "write:articles",
    "publish:articles",
    "delete:articles",
    
    // Configuración
    "manage:settings",
    "manage:roles",
    "view:analytics"
  ];
}
```

## Configuración Recomendada por Rol

```typescript
const ROLE_PERMISSIONS = {
  admin: [
    "read:users", "write:users", "delete:users",
    "read:articles", "write:articles", "publish:articles", "delete:articles",
    "manage:settings", "manage:roles", "view:analytics"
  ],
  
  moderator: [
    "read:users", "write:users",
    "read:articles", "write:articles", "publish:articles",
    "view:analytics"
  ],
  
  editor: [
    "read:articles", "write:articles", "publish:articles"
  ],
  
  user: [
    "read:articles"
  ]
};
```

## Uso en Rutas (App.tsx)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          
          {/* Auth required */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          
          {/* Role: editor+ */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute requiredRole={["editor", "admin"]}>
                <ArticleEditor />
              </ProtectedRoute>
            }
          />
          
          {/* Role: moderator+ */}
          <Route
            path="/moderate"
            element={
              <ProtectedRoute requiredRole={["moderator", "admin"]}>
                <ModerationPanel />
              </ProtectedRoute>
            }
          />
          
          {/* Role: admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          
          {/* Permission-based */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission="write:users">
                <UserManager />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

## Nested Protected Routes

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminLayout>
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredPermission="write:users">
            <UserManager />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredPermission="manage:settings">
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  </AdminLayout>
</ProtectedRoute>
```

## Uso de useAuth en Componentes

### Mostrar/Ocultar Contenido Condicionalmente

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <nav>
      {/* Visible para todos */}
      <Link to="/">Home</Link>
      
      {/* Solo si NOT autenticado */}
      {!isAuthenticated && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
      
      {/* Solo si autenticado */}
      {isAuthenticated && (
        <>
          <Link to="/profile">Mi Perfil</Link>
          <Link to="/dashboard">Dashboard</Link>
        </>
      )}
      
      {/* Solo si es admin */}
      {user?.roles.includes('admin') && (
        <Link to="/admin">Admin Panel</Link>
      )}
      
      {/* Solo si tiene permiso específico */}
      {user?.permissions.includes('write:articles') && (
        <Link to="/editor">Crear Artículo</Link>
      )}
    </nav>
  );
}
```

### Validación Inline en Componentes

```typescript
export function ArticleCard({ article }) {
  const { hasRole, hasPermission } = useAuth();
  
  return (
    <div>
      <h3>{article.title}</h3>
      
      {/* Edit button solo si tiene permiso */}
      {hasPermission('write:articles') && (
        <button onClick={() => editArticle(article.id)}>
          Editar
        </button>
      )}
      
      {/* Delete button solo si es admin */}
      {hasRole('admin') && (
        <button onClick={() => deleteArticle(article.id)} className="delete">
          Eliminar
        </button>
      )}
    </div>
  );
}
```

## Manejo de Access Denied

El componente ProtectedRoute muestra automáticamente una página "Access Denied" cuando:
1. Usuario NO tiene el rol requerido
2. Usuario NO tiene el permiso requerido

Puedes customizar el mensaje:

```typescript
// En ProtectedRoute component (si necesitas editar)
const getDeniedMessage = (requiredRole, requiredPermission) => {
  if (requiredRole && requiredPermission) {
    return `Se requiere rol "${requiredRole}" y permiso "${requiredPermission}"`;
  }
  if (requiredRole) {
    return `Se requiere rol "${requiredRole}"`;
  }
  if (requiredPermission) {
    return `Se requiere permiso "${requiredPermission}"`;
  }
  return 'No tiene permiso para acceder';
};
```

## Testing de Rutas Protegidas

```typescript
describe('ProtectedRoute', () => {
  it('redirige a /login si no está autenticado', () => {
    // Renderizar sin AuthProvider
    expect(screen.getByText('Redirigiendo...')).toBeInTheDocument();
  });
  
  it('permite acceso si está autenticado', () => {
    // Renderizar dentro de AuthProvider con usuario
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });
  
  it('muestra Access Denied si rol insuficiente', () => {
    // Renderizar con usuario sin rol requerido
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});
```

## Seguridad - Importante

⚠️ **Control de Acceso es SOLO Frontend**

```
Frontend (ProtectedRoute) ← Control UX/Experiencia
            ↓
Backend API ← ⭐⭐⭐ Control de Seguridad Real ⭐⭐⭐
```

- ProtectedRoute solo protege la UI
- **SIEMPRE** validar roles/permisos en backend
- No confíes en roles del cliente en decisiones sensibles
- Backend debe verificar autenticación en CADA request

```typescript
// ✅ CORRECTO - Backend verifica
POST /api/admin/users
  Headers: { Authorization: "Bearer token" }
  Backend: verify token → check roles → allow/deny

// ❌ INCORRECTO - Confiar en cliente
const isAdmin = localStorage.getItem('user_role') === 'admin';
if (isAdmin) {
  // Enviar request admin
}
```

## Migración de Rutas Existentes

Si tienes rutas no protegidas que debería estar protegidas:

```typescript
// Antes
<Route path="/dashboard" element={<Dashboard />} />

// Después
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Referencias

- [React Router v6 Docs](https://reactrouter.com/docs/en/v6)
- [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
