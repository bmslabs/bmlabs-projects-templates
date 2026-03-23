# Guía del Proyecto - App React

## Cómo usar esta guía

- Este archivo define las reglas globales del repositorio para desarrollo frontend con React.
- Este repositorio se utiliza para construir aplicaciones frontend modernas con React 18+, TypeScript y Tailwind CSS.
- Cada carpeta principal puede contener sus propios archivos `AGENTS.md` con instrucciones más específicas.
- Si existe conflicto entre este archivo y uno ubicado en una carpeta más específica, prevalece el archivo más cercano al código que se está editando.
- Siempre prioriza el `AGENTS.md` más cercano dentro del árbol de directorios.
- Usa los archivos `SKILL.md` como guía práctica de implementación cuando una carpeta tenga una receta, convención o estilo específico.

## Propósito del repositorio

Este repositorio está orientado a la construcción de aplicaciones frontend modernas, escalables, accesibles y mantenibles usando React. Sirve como template base para acelerar desarrollo manteniendo estándares altos de calidad.

Las carpetas principales del proyecto son:
- `src/components` - Componentes reutilizables
- `src/pages` - Páginas/Vistas de la aplicación
- `src/services` - Servicios de API y lógica de negocio
- `src/hooks` - Custom hooks personalizados
- `src/utils` - Utilidades y helpers
- `src/styles` - Estilos globales

## Visión general de la arquitectura

Este proyecto sigue una arquitectura por capas con separación clara de responsabilidades:

```
┌─────────────────────────────────────┐
│      PAGES / VISTAS                 │  Punto de entrada de rutas
├─────────────────────────────────────┤
│    COMPONENTS / LAYOUTS             │  UI reutilizable y layouts
├─────────────────────────────────────┤
│    HOOKS / STATE MANAGEMENT         │  Lógica stateful
├─────────────────────────────────────┤
│    SERVICES / API                   │  Comunicación backend
├─────────────────────────────────────┤
│    UTILS / HELPERS                  │  Funciones de utilidad
└─────────────────────────────────────┘
```

### Responsabilidades por capa

- **pages/**: Conglomeran varias capas para formar una vista completa. Manejan routing params y state global.
- **components/**: Presentación visual pura. Reciben datos vía props. Son reutilizables y testeables.
- **hooks/**: Lógica compartida, state management local, efectos secundarios controlados.
- **services/**: Comunicación con APIs backend, transformación de datos, caché.
- **utils/**: Funciones puras, validadores, formateadores, constantes.

## Principios Base

### Componentes

1. **Componentes funcionales siempre**: Usar función arrow functions o function declarations.
2. **Props bien tipadas**: Definir interfaces TypeScript para todas las props.
3. **Componentes pequeños y enfocados**: Un componente = una responsabilidad.
4. **Sin lógica de negocio en componentes**: Delegar a hooks y servicios.
5. **Props drilling mínimo**: Usar hooks y context cuando sea necesario.
6. **Accesibilidad desde el inicio**: ARIA labels, semantic HTML, keyboard navigation.

### Hooks

1. **Custom hooks para lógica compartida**: Extraer lógica de componentes a hooks.
2. **useEffect limpio**: Siempre limpiar subscripciones y timers.
3. **Dependencias explícitas**: Especificar todas las dependencias en arrays.
4. **No hooks condicionales**: Siempre llamar hooks en el mismo orden.
5. **Nombres descriptivos**: Prefijo `use` obligatorio (useForm, useApi, etc).

### Servicios

1. **API centralizado**: Usar un único cliente HTTP configurado.
2. **DTOs para contrato API**: Types/interfaces que siguen el contrato del backend.
3. **Manejo de errores**: Try-catch con messages amigables al usuario.
4. **Sin transformación en componentes**: Transformar datos en servicios.
5. **Caching cuando sea apropiado**: React Query, SWR, o custom caching.

### Estado Global

1. **Minimal global state**: Usar context/zustand solo cuando sea necesario.
2. **Estado local por defecto**: useState para estado local del componente.
3. **Separación por dominio**: Cada feature su propio context/store.
4. **DevTools enabled**: Redux DevTools o similar en desarrollo.

### Estilos

1. **Tailwind CSS preferentemente**: Usar utilidades de Tailwind.
2. **CSS Modules para estilos complejos**: Si Tailwind no es suficiente.
3. **Variables CSS en globals**: Colores, espaciados, tipografías.
4. **Sistema de temas**: Light/dark mode configurable.
5. **Sin inline styles**: Excepto en casos dinámicos justificados.

### TypeScript

1. **Strict mode habilitado**: `"strict": true` en tsconfig.json.
2. **Tipos explícitos**: No usar `any`, preferir `unknown` o tipos específicos.
3. **Interfaces para componentes**: Usar `interface Props` para props.
4. **Enums para opciones**: Preferir enums a strings literales para opciones.
5. **Tipos genéricos cuando corresponda**: Para hooks y utilidades reutilizables.

### Rendimiento

1. **React.memo para componentes puros**: Evitar re-renders innecesarios.
2. **useCallback para callbacks**: Pasar a React.memo de forma segura.
3. **useMemo para cálculos pesados**: Memoizar resultados costosos.
4. **Lazy loading de componentes**: React.lazy() + Suspense para code splitting.
5. **Virtual scrolling para listas largas**: Si lista > 100 items.

### Testing

1. **Componentes testeables**: Sin lógica compleja, bien separados.
2. **Testing funcionalidad, no implementación**: userEvent vs fireEvent.
3. **Tests de integración primero**: Antes de tests unitarios puros.
4. **Cobertura mínima 80%**: En código crítico.
5. **Fixtures y factories para datos**: No hardcodear datos de prueba.

### Seguridad

1. **No hardcodear secretos**: Usar .env y variables de entorno.
2. **Sanitizar entrada**: Validación en formularios y servicios.
3. **HTTPS en producción**: Siempre.
4. **Tokens en localStorage con cuidado**: Considerar httpOnly cookies.
5. **CORS configurado correctamente**: En backend.

### Accesibilidad (WCAG 2.1 AA)

1. **Semantic HTML**: `<button>` vs `<div>` en onClick.
2. **ARIA labels**: Para elementos sin texto visible.
3. **Color contrast**: Mínimo 4.5:1 para texto.
4. **Keyboard navigation**: Todos los elementos interactivos con Tab.
5. **Screen readers**: Estructura y anuncios apropiados.

## Estructura de Carpetas Recomendada

```
src/
├── components/
│   ├── common/              # Componentes genéricos (Header, Footer)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Header.module.css
│   ├── layout/              # Layouts principales
│   │   ├── BackofficeLayout.tsx
│   │   ├── FrontofficeLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── forms/               # Componentes de formularios
│   │   ├── ProductForm.tsx
│   │   └── ProductForm.types.ts
│   ├── tables/              # Componentes de tablas
│   │   ├── DataGrid.tsx
│   │   └── DataGrid.types.ts
│   ├── ui/                  # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Notification.tsx
│   └── index.ts             # Barrel export
├── pages/
│   ├── backoffice/
│   │   ├── products/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCreate.tsx
│   │   │   ├── ProductEdit.tsx
│   │   │   └── ProductDetail.tsx
│   │   └── index.ts
│   ├── frontoffice/
│   │   ├── Home.tsx
│   │   └── index.ts
│   └── auth/
│       ├── Login.tsx
│       └── index.ts
├── services/
│   ├── api.ts               # Cliente HTTP configurado
│   ├── productService.ts    # Servicios para productos
│   ├── userService.ts
│   └── index.ts
├── hooks/
│   ├── useCrud.ts           # Hook para CRUD
│   ├── useForm.ts           # Hook para formularios
│   ├── useApi.ts            # Hook para peticiones
│   ├── useProducts.ts       # Hook específico para productos
│   └── index.ts
├── utils/
│   ├── validators.ts        # Validadores con Zod
│   ├── formatters.ts        # Formateadores de datos
│   ├── constants.ts         # Constantes de la app
│   └── index.ts
├── styles/
│   ├── globals.css          # Estilos globales
│   ├── variables.css        # Variables CSS (colores, espacios)
│   └── tailwind.config.js
├── App.tsx                  # Componente raíz
└── main.tsx                 # Entry point
```

## Naming Conventions

### Archivos

- **Componentes**: `PascalCase` con `.tsx` (ProductForm.tsx)
- **Hooks**: `camelCase` con prefijo `use` (useProduct.ts)
- **Servicios**: `camelCase` con sufijo `Service` (productService.ts)
- **Utils**: `camelCase` (validators.ts, formatters.ts)
- **Types/Interfaces**: `PascalCase` con `.types.ts` o inline (ProductForm.types.ts)

### Variables y Funciones

- **Constantes**: `UPPER_SNAKE_CASE` (MAX_ITEMS = 10)
- **Variables**: `camelCase` (firstName, userData)
- **Funciones**: `camelCase` (handleClick, validateForm)
- **Booleanos**: Prefijo `is`, `has`, `can` (isLoading, hasError, canDelete)

### Git y Commits

1. **Branch naming**: feature/nombre-feature, fix/descripcion-bug, refactor/descripcion
2. **Commit messages**: Usar Conventional Commits
   ```
   feat(components): agregar DataGrid component
   fix(hooks): corregir memory leak en useApi
   docs(README): actualizar instrucciones de inicio
   refactor(services): simplificar productService
   ```

## Archivos Especiales

### .env.example
Plantilla de variables de entorno que debe commitearse.

### .github/copilot-instructions.md
Instrucciones técnicas específicas para Copilot (prompts, estándares, ejemplos).

### .github/skills/
Skills reutilizables para Copilot (crear componentes, páginas, services, etc).

### .github/prompts/
Prompts ejecutables para generar diferentes tipos de contenido.

## Flujo de Desarrollo Típico

1. **Requerimiento**: Definir qué se necesita crear
2. **API Service**: Crear servicio para comunicación con backend
3. **Custom Hook**: Extraer lógica (si aplica)
4. **Validadores**: Implementar validación (si aplica)
5. **Componentes**: Crear UI reutilizable
6. **Page**: Integrar componentes en página
7. **Testing**: Verificar funcionamiento
8. **Commit**: Realizar commit con mensaje descriptivo

## Autenticación y Control de Acceso

### Arquitectura de Autenticación

El proyecto incluye un sistema de autenticación completo basado en:

```
┌─────────────┐
│  Auth Pages │  Login, Signup, Profile
│  (src/)     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  ProtectedRoute │  Envuelve rutas protegidas
│  (components/)  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  AuthContext    │  Estado global
│  + useAuth      │
│  (contexts/)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  AuthService    │  API methods
│  (services/)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   Backend API   │  /api/auth/*
│   (login, etc)  │
└─────────────────┘
```

### Componentes del Sistema de Autenticación

#### 1. AuthContext + useAuth Hook
**Ubicación**: `src/contexts/AuthContext.tsx`

Gestiona:
- Estado del usuario (User | null)
- Token de acceso (localStorage)
- Métodos: login(), signup(), logout(), refreshToken()
- Helpers: hasRole(), hasPermission(), isAuthenticated

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

#### 2. AuthService
**Ubicación**: `src/services/authService.ts`

Métodos disponibles:
- `login(email, password)` - Autenticación básica
- `signup(name, email, password)` - Crear nueva cuenta
- `logout()` - Terminar sesión
- `refreshToken(token)` - Renovar token de acceso
- `getProfile()` - Obtener perfil del usuario
- `updateProfile(data)` - Actualizar datos del usuario
- `changePassword(current, new)` - Cambiar contraseña
- `validateSAML(response)` - Validar aserción SAML
- `getSAMLMetadata()` - Obtener metadatos SAML
- `enable2FA()`, `verify2FA()` - Autenticación de dos factores

#### 3. Páginas de Autenticación
**Ubicación**: `src/pages/auth/`

- `LoginPage.tsx` - Email + password con SAML fallback
- `SignupPage.tsx` - Registro con términos obligatorios
- `ProfilePage.tsx` - Editar perfil + logout + eliminación

#### 4. ProtectedRoute Component
**Ubicación**: `src/components/auth/ProtectedRoute.tsx`

Protege rutas según:
- **Autenticación**: Redirige no autenticados a /login
- **Rol**: Requiere rol específico (admin, editor, etc)
- **Permiso**: Requiere permiso específico (write:articles, etc)

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Flujo de Autenticación

#### Login
1. Usuario ingresa email + password
2. Validación client-side
3. AuthService → POST /api/auth/login
4. Backend retorna user + accessToken + refreshToken
5. Tokens guardados en localStorage
6. AuthContext actualiza estado
7. Redirige a /dashboard

#### Signup
1. Usuario completa: name, email, password, términos
2. Validación client-side (password match, términos aceptados)
3. AuthService → POST /api/auth/signup
4. Backend crea usuario, retorna auth response
5. Usuario auto-logueado
6. Redirige a /dashboard

#### Token Refresh
1. API retorna 401 (token expirado)
2. apiClient interceptor detecta 401
3. Llama AuthService.refreshToken(refreshToken)
4. Backend valida refreshToken, retorna nuevo accessToken
5. Reintenta request original con nuevo token

#### Logout
1. Usuario hace click en logout
2. AuthService → POST /api/auth/logout
3. Backend invalida tokens
4. AuthContext limpia estado
5. Redirige a /login

### Roles y Permisos

#### Estructura de Usuario
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: string[];           // ["admin", "user"]
  permissions: string[];     // ["read:articles", "write:articles"]
  createdAt: string;
  updatedAt: string;
}
```

#### Roles Estándar
- `admin` - Acceso total (read/write/delete todo)
- `moderator` - Gestiona usuarios y contenido
- `editor` - Crea y edita contenido
- `user` - Solo lectura y su propio perfil

#### Permisos Estándar
```
read:users, write:users, delete:users
read:articles, write:articles, publish:articles, delete:articles
manage:settings, manage:roles, view:analytics
```

### Validación de Autenticación en Backend

⚠️ **IMPORTANTE**: ProtectedRoute es solo UI. El backend DEBE verificar:

```typescript
// Backend: Verificar en CADA endpoint protegido
POST /api/admin/users
  Headers: { Authorization: "Bearer {accessToken}" }
  Backend:
    1. Verificar token válido
    2. Extraer user id
    3. Verificar user.roles includes "admin"
    4. Retornar datos o 403 Forbidden
```

### SAML/SSO Empresarial

Si necesitas SSO corporativo (Azure AD, Okta, Google Workspace):

1. Backend configura SAML 2.0 con proveedor IdP
2. AuthService expone `validateSAML(samlResponse)`
3. LoginPage muestra botón "Sign in with SSO"
4. Usuario redirigido a IdP para autenticación
5. IdP retorna SAML assertion
6. Backend valida y crea/mapea usuario
7. Retorna user + tokens como login normal

#### Mapeo de Atributos SAML
```
urn:oid:0.9.2342.19200300.100.1.3 → email
urn:oid:2.5.4.3 → name
urn:oid:1.3.6.1.4.20037.1 → roles
```

### Seguridad

✅ **Implementado**:
- Tokens en localStorage (persistencia entre sesiones)
- Bearer token en Authorization header
- Token expiration (15 min access, 7 días refresh)
- Validación de contraseña (8+ chars, letras + números)
- Sanitización de entrada (validators)

⚠️ **Recomendado en Backend**:
- Passwords hasheados con bcrypt/argon2
- HTTPS obligatorio (http-only cookies mejor que localStorage)
- Rate limiting en /login, /signup, /refresh
- CSRF protection
- Logging de intentos fallidos

### Componentes UI para Formularios

Necesarios para auth forms:
- ✅ `Input.tsx` - Campos text, email, password
- ✅ `Checkbox.tsx` - Para términos y condiciones
- ✅ `Button.tsx` - Ya existe

### Prompts para Generar Componentes

```bash
# Auth context completo
@copilot /I.-CreateAuthContext

# Login, signup, profile pages
@copilot /J.-CreateLoginSignupPages

# Protected route component
@copilot /K.-CreateProtectedRoute

# SAML backend configuration
@copilot /L.-CreateSAMLConfig
```

### Skills Documentados

Ver archivos en `.github/skills/`:
- `fe-create-auth-system.md` - Visión general del sistema
- `fe-create-auth-forms.md` - Formularios con validación
- `fe-create-protected-routes.md` - Control de acceso

### Testing de Autenticación

```typescript
describe('Authentication', () => {
  // Mock authService
  // Test login success/failure
  // Test token refresh
  // Test role-based access
  // Test logout
  // Test protected routes redirect
});
```

## Herramientas Recomendadas

- **IDE**: VS Code con extensiones (ESLint, Prettier, Tailwind CSS IntelliSense)
- **Linter**: ESLint con configuración React/TypeScript
- **Formatter**: Prettier
- **Testing**: Vitest + React Testing Library
- **E2E**: Playwright o Cypress
- **DevTools**: React DevTools, Redux DevTools

## Recursos Útiles

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility by Google](https://www.udacity.com/course/web-accessibility--ud891)
