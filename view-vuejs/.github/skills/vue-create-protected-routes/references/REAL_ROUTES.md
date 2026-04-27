# Referencia Real: Router y Navigation Guards (Patrón BM)

> Patrón consolidado desde proyectos productivos de BM. Anonimizado.
> DEBES replicar este patrón al configurar el router en nuevos módulos.

---

## Reglas de Protección por Defecto

> **REGLA FUNDAMENTAL**: El default es que **TODAS las rutas están protegidas** (requiresAuth: true).
> Solo se marca `meta: { public: true }` cuando se declare explícitamente que una ruta es pública.

| Situación | Valor de `meta` |
|-----------|----------------|
| Nueva ruta sin indicación especial | `meta: { requiresAuth: true }` |
| Ruta de login/auth | `meta: { public: true }` |
| Ruta explícitamente pública (p.ej. landing, docs) | `meta: { public: true }` |
| Ruta solo para rol específico | `meta: { requiresAuth: true, role: 'admin' }` |

**Rol/permiso**: Solo agregar `meta.role` o `meta.permission` si el usuario lo solicita. Sin esa indicación, estar autenticado es suficiente para ver cualquier ruta.

---

## 1. Estructura del Router (`src/router/index.ts`)

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { APP_ROUTES, DEFAULT_AFTER_LOGIN_ROUTE } from '@/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rutas públicas (fuera del layout)
    {
      path: APP_ROUTES.LOGIN,
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },

    // Layout wrapper — todas las rutas hijas son privadas por defecto
    {
      path: '/',
      component: () => import('@/layout/DefaultLayout.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'home' },
        },
        {
          path: APP_ROUTES.HOME.slice(1),
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: true },  // ← privada por defecto
        },
        {
          path: APP_ROUTES.DASHBOARD.slice(1),
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { requiresAuth: true },
        },
        // ↓ Toda ruta nueva es requiresAuth: true salvo indicación contraria
        // {
        //   path: 'entities',
        //   name: 'entities',
        //   component: () => import('@/views/entities/EntitiesView.vue'),
        //   meta: { requiresAuth: true },
        // },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: DEFAULT_AFTER_LOGIN_ROUTE,  // /home por defecto
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.checkAuthIfNeeded()

  // Rutas públicas: pasar siempre
  if (to.meta.public) return

  // Ruta requiere auth y no hay sesión → login con redirect de retorno
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Rol/permiso específico (solo si se declaró meta.role o meta.permission)
  if (to.meta.role && !authStore.hasRole(to.meta.role as string)) {
    return DEFAULT_AFTER_LOGIN_ROUTE
  }
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
    return DEFAULT_AFTER_LOGIN_ROUTE
  }

  // Usuario ya autenticado intenta ir al login → redirigir al home
  if (to.name === 'login' && authStore.isAuthenticated) {
    return DEFAULT_AFTER_LOGIN_ROUTE
  }
})

export default router
```

**Nota sobre `DEFAULT_AFTER_LOGIN_ROUTE`**: Definida en `src/constants/auth.constants.ts` como `/home` por defecto. Si el usuario especifica otra ruta post-login, cambiar solo esa constante.

```typescript
// src/constants/auth.constants.ts
export const DEFAULT_AFTER_LOGIN_ROUTE = APP_ROUTES.HOME  // '/home' — cambiar si el usuario especifica otra
```

---

## 2. Patrón OAuth/Microsoft SSO (rutas adicionales)

> **Solo generar si el usuario solicita explícitamente Microsoft/Azure AD/MSAL.**
> El callback es una ruta pública.

```typescript
// Rutas adicionales para flujo OAuth
{
  path: '/auth/login',
  name: 'login',
  component: () => import('@/views/auth/LoginView.vue'),
  meta: { public: true },
},
{
  path: '/auth/callback',    // URL registrada en Azure App Registration
  name: 'auth-callback',
  component: () => import('@/views/auth/AuthCallbackView.vue'),
  meta: { public: true },   // NUNCA requiresAuth: true — ruta de procesamiento OAuth
},
{
  path: '/auth/logout',
  name: 'logout',
  component: () => import('@/views/auth/LogoutView.vue'),
  meta: { public: true },
},
```

**Guard para OAuth** — simplificado, sin `checkAuthIfNeeded` (MSAL maneja expiración):
```typescript
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.public) return  // permitir login, callback, logout sin verificación

  if (!authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

---

## 3. Reglas Críticas

| Regla | Detalle |
|---|---|
| Default de rutas | **`requiresAuth: true`** en toda ruta nueva. Solo `meta: { public: true }` si se declara explícitamente. |
| Ruta de login | `/auth/login` (nombre `'login'`). NO `/login`. |
| Ruta de callback OAuth | `/auth/callback` con `meta: { public: true }` |
| Redirect post-login | `route.query.redirect` → ruta especificada por usuario → `DEFAULT_AFTER_LOGIN_ROUTE` (`/home`). NUNCA `/dashboard` hardcodeado. |
| Guard | Usa `useAuthStore()` dentro de `beforeEach` + `await authStore.checkAuthIfNeeded()` |
| Patrón de guard | Retornar objetos/rutas, evitando `next()` |
| Fallback 404 | `/:pathMatch(.*)* → redirect DEFAULT_AFTER_LOGIN_ROUTE` |
| Lazy loading | SIEMPRE `() => import('@/views/...')` para code splitting |
| Roles/permisos | Solo agregar `meta.role` o `meta.permission` si el usuario los solicita. Sin esa indicación, estar autenticado es suficiente. |
| SSO (Microsoft/Google) | Solo agregar rutas OAuth si el usuario lo solicita explícitamente. |

---

## 4. Variantes Productivas Observadas

- En repos productivos antiguos aparece `next()` en guards; en el template estándar se usa retorno (`return { name: 'x' }`) para Vue Router 4.
- En algunos repos la ruta de login es `/login`; en el estándar actual se unifica como `/auth/login` mediante constantes (`APP_ROUTES.LOGIN`).
- Existen validaciones avanzadas de sesión (rehidratación, cooldown post-logout, validación backend); cuando existan en store/composables deben integrarse dentro de `beforeEach` sin romper tipado estricto.
- En flujo OAuth, el guard NO debe llamar a `checkAuthIfNeeded()` en rutas públicas para no interrumpir el callback.

---

## 5. Cómo Agregar una Nueva Ruta

```typescript
// Dentro del array children del layout wrapper:
{
  path: 'module/entities',
  name: 'entities-list',
  component: () => import('@/views/module/EntitiesListView.vue'),
  meta: { requiresAuth: true },
},
```

