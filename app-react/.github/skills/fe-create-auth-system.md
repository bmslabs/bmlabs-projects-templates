# Skill: Implementar Autenticación Completa

## Propósito
Establecer un sistema de autenticación robusto con login, signup, perfiles de usuario, protección de rutas, y soporte para SAML/SSO empresarial.

## Componentes Clave

### 1. AuthContext + useAuth Hook
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, signup, logout } = useAuth();
```

**Responsabilidades**:
- Gestionar estado de autenticación global
- Persistir token en localStorage
- Auto-logout al expirar token
- Manejo de errores centralizado

### 2. AuthService
```typescript
import { authService } from '@/services';

await authService.login(email, password);
await authService.signup({ email, password, name });
await authService.validateSAML(samlResponse);
```

**Responsabilidades**:
- Llamadas a API de autenticación
- Manejo de tokens y refresh
- SAML validation
- Password reset flows

### 3. Páginas de Autenticación
```
src/pages/auth/
├── LoginPage.tsx      # Email + password login
├── SignupPage.tsx     # Nueva cuenta + términos
├── ProfilePage.tsx    # Editar perfil + logout
└── ForgotPasswordPage.tsx # (Opcional)
```

### 4. ProtectedRoute Component
```typescript
import { ProtectedRoute } from '@/components';

<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

## Integración con App.tsx

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute, LoginPage, Dashboard } from '@/components';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
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
    </AuthProvider>
  );
}
```

## Patrón de Validación

Use validators de utils:
```typescript
import { validators } from '@/utils';

// Email validation
if (!validators.email(email)) {
  setError('Invalid email format');
}

// Password strength (8+ chars)
if (!validators.minLength(password, 8)) {
  setError('Password must be 8+ characters');
}
```

## Gestión de Rol y Permisos

```typescript
// En User interface
interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];      // ['admin', 'user']
  permissions: string[]; // ['read:users', 'write:users']
}

// En componentes
const { user } = useAuth();
if (user?.roles.includes('admin')) {
  // Mostrar contenido admin
}

// O usar hasRole/hasPermission
const { hasRole, hasPermission } = useAuth();
if (hasRole('admin') && hasPermission('write:users')) {
  // Mostrar editor
}
```

## Flujo de Token con Refresh

```
1. Usuario hace login
   ↓ recibe access_token + refresh_token
   
2. access_token guardado en localStorage
   ↓ auto-inyectado en cada request vía apiClient interceptor
   
3. Si recibe 401 (token expirado)
   ↓ apiClient interceptor llama refreshToken()
   ↓ intercambia refresh_token por nuevo access_token
   ↓ reintenta request original
   
4. Si refresh_token inválido
   ↓ user es deslogueado
   ↓ redirige a /login
```

## Implementación Backend Requerida

Tu backend debe implementar estos endpoints:

```
POST /api/auth/login
  Request: { email, password }
  Response: { user, token, refreshToken, expiresIn }

POST /api/auth/signup
  Request: { email, password, name }
  Response: { user, token, refreshToken, expiresIn }

POST /api/auth/logout
  Request: {}
  Response: {}

POST /api/auth/refresh
  Request: { refreshToken }
  Response: { token, expiresIn }

GET /api/auth/me
  Request: (Bearer token en header)
  Response: { user }

PUT /api/auth/profile
  Request: { name, bio, avatar }
  Response: { user }

POST /api/auth/change-password
  Request: { currentPassword, newPassword }
  Response: {}

POST /api/auth/forgot-password
  Request: { email }
  Response: { message }

POST /api/auth/reset-password
  Request: { token, password }
  Response: { message }

POST /api/auth/saml/login
  Request: { samlResponse }
  Response: { user, token, refreshToken }

POST /api/auth/2fa/enable
  Request: {}
  Response: { secret, qrCode }

POST /api/auth/2fa/verify
  Request: { code }
  Response: { message }
```

## Seguridad - Checklist

- ✅ Tokens NO en localStorage (idealmente httpOnly cookies)
- ✅ HTTPS obligatorio para endpoints de auth
- ✅ Validación de email en backend
- ✅ Passwords hasheados con bcrypt/argon2
- ✅ Tokens con expiration corta (15 min)
- ✅ Refresh tokens más largos (7 días)
- ✅ Rate limiting en login/signup endpoints
- ✅ CSRF protection en endpoints POST
- ✅ Logging de intentos de login fallidos
- ✅ 2FA opcional en cuentas importantes

## SAML/SSO Enterprise

Si necesitas SSO corporativo:

1. Solicitar al IdP (Azure AD, Okta, etc):
   - SSO URL
   - Certificate
   - Entity ID

2. Proporcionar al IdP:
   - Service Provider metadata
   - ACS URL (Assertion Consumer Service)
   - Logout URL

3. Mapear atributos SAML a usuario local:
   ```
   urn:oid:0.9.2342.19200300.100.1.3 → email
   urn:oid:2.5.4.3 → name
   urn:oid:1.3.6.1.4.20037.1 → roles
   ```

## Invocación para Generar Componentes

```bash
# Generar Auth Context completo
@copilot /fe-create-auth-context

# Generar Login/Signup pages
@copilot /fe-create-login-signup

# Generar ProtectedRoute
@copilot /fe-create-protected-route

# Configurar SAML
@copilot /fe-create-saml-config
```

## Ejemplo de Flujo Completo

```typescript
// 1. Usuario hace login
const LoginForm = () => {
  const { login } = useAuth();
  const handleSubmit = async (email, password) => {
    try {
      await login(email, password); // AuthContext maneja todo
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };
};

// 2. ProtectedRoute verifica autenticación
<ProtectedRoute>
  <Dashboard /> {/* Solo si isAuthenticated === true */}
</ProtectedRoute>

// 3. En cualquier componente, acceder al usuario
const MyComponent = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <p>Bienvenido, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Próximos Pasos Opcionales

1. **2FA Setup**: useAuth().enable2FA() y verify2FA()
2. **Session Timeout**: Logout automático después de X minutos
3. **Password Reset**: ForgotPasswordPage + email verification
4. **OAuth/OAuth2**: Google, GitHub login (alternativa a SAML)
5. **Biometric Auth**: Face ID, Fingerprint (React Native)
6. **Audit Logging**: Registrar todos los intentos de login

---

**Referencias**:
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [SAML 2.0 Spec](https://docs.oasis-open.org/security/saml/v2.0/)
