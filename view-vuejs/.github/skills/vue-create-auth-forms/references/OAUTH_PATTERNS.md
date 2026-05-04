# Referencia: Patrones OAuth BM (Google + Microsoft MSAL)

> **REGLA DE USO**: Estos patrones se generan **SOLO si el usuario lo solicita explícitamente** o si el Swagger/contrato indica un flujo OAuth.
> Para autenticación username/password estándar, ver `REAL_AUTH.md`.

---

## Preguntas a Hacer al Usuario Antes de Generar

### Si solicita Google OAuth
```
1. ¿Cuál es el endpoint del backend para validar el Google ID Token?
   (ej: POST /api/v1/Auth/google  o  POST /api/v1/Login/google)
2. ¿Qué devuelve el backend? ¿Un JWT propio o solo valida y crea sesión?
3. ¿Tienes el Google Client ID? (Google Cloud Console > APIs > Credenciales)
```

### Si solicita Microsoft SSO (MSAL)
```
1. ¿El frontend llama a una API propia después del redirect de Microsoft,
   o Microsoft es el único proveedor de identidad?
2. ¿Tienes estos datos de Azure Portal > Registros de aplicaciones?
   - Application (Client) ID
   - Directory (Tenant) ID
   - Redirect URI registrada (ej: http://localhost:5173/auth/callback)
   - API Scope (ej: api://[client-id]/access_as_user) — solo si hay API propia
3. ¿Es una app web únicamente o también mobile (Capacitor/React Native)?
```

### Si solicita SSO backend-delegado (redirect al backend)
```
1. ¿Cuál es la URL del endpoint de login del backend?
   (ej: https://api.dominio.com/api/v1/Auth/login — redirige a Microsoft)
2. ¿Cuál es la URL del endpoint de logout?
3. ¿Cuál es la URL del endpoint de perfil/sesión?
   (ej: GET /api/v1/Auth/profile — devuelve permisos, nombre, rol)
```

---

## Variables de Entorno

### Patrón A — JWT con Google OAuth adicional
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:5001

# Google Sign-In (opcional — solo si se usa Google OAuth)
# Obtener en: Google Cloud Console > APIs y servicios > Credenciales > ID de cliente (Aplicación web)
# DEBE coincidir con el ClientId configurado en el backend
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
```

### Patrón B — Microsoft MSAL directo (frontend maneja el token)
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:5001

# Azure AD — Obtener en: Portal de Azure > Azure Active Directory > Registros de aplicaciones > Tu App
VITE_AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000
VITE_AZURE_TENANT_ID=00000000-0000-0000-0000-000000000000

# Redirect URIs — deben coincidir EXACTAMENTE con las registradas en Azure App Registration
VITE_AZURE_REDIRECT_URI_WEB=http://localhost:5173/auth/callback
VITE_AZURE_POST_LOGOUT_REDIRECT_URI_WEB=http://localhost:5173/auth/login

# Scope de tu API (solo si hay API propia que consume el access_token de Azure)
# Formato: api://[VITE_AZURE_CLIENT_ID]/[nombre-del-scope]
VITE_AZURE_API_SCOPE=api://00000000-0000-0000-0000-000000000000/access_as_user
```

### Patrón C — SSO delegado al backend (backend redirige a Microsoft/AD)
```bash
# .env.local
# URL base de la API — el backend gestiona todo el flujo OAuth internamente
VITE_API_BASE_URL=http://localhost:5001/api/v1/
# El frontend solo llama a: GET /Auth/login (redirige), GET /Auth/profile, GET /Auth/logout
```

---

## Patrón B — Microsoft MSAL (Frontend gestiona el token directamente)

> Instalar: `pnpm add @azure/msal-browser`

### `src/composables/useMsal.ts`
```typescript
import { ref, computed } from 'vue'
import {
  PublicClientApplication,
  type AccountInfo,
} from '@azure/msal-browser'

// Configuración singleton — inicializado una sola vez
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID as string}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI_WEB as string,
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_POST_LOGOUT_REDIRECT_URI_WEB as string,
  },
  cache: {
    cacheLocation: 'localStorage' as const,
    storeAuthStateInCookie: false,
  },
}

const msalInstance = new PublicClientApplication(msalConfig)
const currentAccount = ref<AccountInfo | null>(null)
const isLoading = ref(false)
const authError = ref<string | null>(null)

export function useMsal() {
  const isAuthenticated = computed(() => currentAccount.value !== null)

  const initialize = async (): Promise<void> => {
    await msalInstance.initialize()

    // Procesar redirect si venimos del flujo de login
    const redirectResponse = await msalInstance.handleRedirectPromise()
    if (redirectResponse?.account) {
      currentAccount.value = redirectResponse.account
    } else {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        currentAccount.value = accounts[0]
      }
    }
  }

  const login = async (): Promise<void> => {
    isLoading.value = true
    authError.value = null
    try {
      await msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'email', 'User.Read'],
        prompt: 'select_account',
      })
      // loginRedirect no retorna — la página se recarga en el callback
    } catch (error) {
      authError.value = 'Error al iniciar sesión con Microsoft'
      isLoading.value = false
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    currentAccount.value = null
    await msalInstance.logoutRedirect()
  }

  const getAccessToken = async (
    scopes: string[] = [import.meta.env.VITE_AZURE_API_SCOPE as string],
  ): Promise<string> => {
    if (!currentAccount.value) throw new Error('Usuario no autenticado')
    const response = await msalInstance.acquireTokenSilent({
      scopes,
      account: currentAccount.value,
    })
    return response.accessToken
  }

  const getCurrentUserEmail = (): string | null =>
    currentAccount.value?.username ?? null

  return {
    isAuthenticated,
    isLoading,
    authError,
    currentAccount,
    initialize,
    login,
    logout,
    getAccessToken,
    getCurrentUserEmail,
  }
}
```

### `src/views/auth/LoginView.vue` (MSAL)
```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
    <main class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center gap-6">
      <img src="@/assets/logo/logo.svg" alt="Logo" class="h-14 w-auto" />
      <div class="text-center">
        <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Iniciar sesión</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Use su cuenta de Microsoft para acceder al sistema</p>
      </div>

      <div v-if="errorMessage" class="w-full rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
        <strong>Error:</strong> {{ errorMessage }}
      </div>

      <button
        id="btn-microsoft-login"
        type="button"
        class="w-full flex items-center justify-center gap-3 rounded-xl py-3.5 text-sm font-bold bg-[var(--color-primary,#2563eb)] text-white hover:opacity-90 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
        :disabled="isLoggingIn"
        @click="handleLogin"
      >
        <span v-if="isLoggingIn" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
        <!-- Microsoft Logo -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#f25022" d="M13 13h10v10H13z"/>
          <path fill="#00a4ef" d="M13 25h10v10H13z"/>
          <path fill="#7fba00" d="M25 13h10v10H25z"/>
          <path fill="#ffb900" d="M25 25h10v10H25z"/>
        </svg>
        {{ isLoggingIn ? 'Redirigiendo...' : 'Continuar con Microsoft' }}
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMsal } from '@/composables/useMsal'

const route = useRoute()
const { login, initialize } = useMsal()
const isLoggingIn = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await initialize()
  // Propagar errores desde query params del redirect
  if (route.query.error) {
    const msgs: Record<string, string> = {
      user_not_found: 'Tu cuenta de Microsoft no está registrada en el sistema.',
      access_forbidden: 'Tu cuenta no tiene permisos para acceder.',
      callback_failed: 'Error procesando la autenticación. Intenta nuevamente.',
    }
    errorMessage.value = msgs[route.query.error as string] ?? (route.query.message as string) ?? 'Error de autenticación'
  }
})

const handleLogin = async () => {
  isLoggingIn.value = true
  errorMessage.value = ''
  try {
    await login()
    // loginRedirect redirige — no continúa aquí
  } catch {
    errorMessage.value = 'Error al iniciar sesión con Microsoft.'
    isLoggingIn.value = false
  }
}
</script>
```

### `src/views/auth/AuthCallbackView.vue` (MSAL)
```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-8 flex flex-col items-center gap-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Procesando inicio de sesión</h2>

      <div v-if="loading" class="flex flex-col items-center gap-3">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary,#2563eb)] border-t-transparent" />
        <p class="text-sm text-gray-500 dark:text-gray-400">Verificando información del usuario...</p>
      </div>

      <div v-if="alreadyAuthenticated" class="w-full rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center text-sm text-green-700 dark:text-green-400">
        Sesión activa. Redirigiendo...
      </div>

      <div v-if="error" class="w-full rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-center">
        <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ error }}</p>
        <p class="text-xs text-red-500 dark:text-red-500 mt-1">Redirigiendo al login en {{ errorCountdown }}s...</p>
      </div>

      <div v-if="!loading && !error && !alreadyAuthenticated && success"
        class="w-full rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center text-sm text-green-700 dark:text-green-400">
        ¡Autenticación exitosa! Redirigiendo en {{ countdown }}s...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMsal } from '@/composables/useMsal'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_AFTER_LOGIN_ROUTE } from '@/constants/auth.constants'

const router = useRouter()
const { initialize, isAuthenticated, getCurrentUserEmail, logout } = useMsal()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const success = ref(false)
const alreadyAuthenticated = ref(false)
const countdown = ref(3)
const errorCountdown = ref(10)

const startSuccessRedirect = () => {
  const iv = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) { clearInterval(iv); router.replace(DEFAULT_AFTER_LOGIN_ROUTE) }
  }, 1000)
}

const startErrorRedirect = (withLogout = false) => {
  const iv = setInterval(() => {
    errorCountdown.value--
    if (errorCountdown.value <= 0) {
      clearInterval(iv)
      if (withLogout) logout().finally(() => router.replace('/auth/login'))
      else router.replace('/auth/login')
    }
  }, 1000)
}

onMounted(async () => {
  try {
    await initialize()

    if (authStore.isAuthenticated) {
      alreadyAuthenticated.value = true
      loading.value = false
      await router.replace(DEFAULT_AFTER_LOGIN_ROUTE)
      return
    }

    const email = getCurrentUserEmail()
    if (!isAuthenticated.value || !email) {
      error.value = 'No se pudo verificar la autenticación de Microsoft.'
      loading.value = false
      startErrorRedirect()
      return
    }

    // TODO: llamar API propia para validar el usuario por email si se requiere
    // const userData = await UserService.validateByEmail(email)
    // authStore.setSession({ user: { id: userData.id, name: userData.name, email }, accessToken: await getAccessToken() })

    // Si no hay validación propia, solo marcar sesión activa
    authStore.setSession({
      user: { id: email, name: email.split('@')[0], email },
      accessToken: 'msal-managed', // MSAL maneja el token internamente
    })

    success.value = true
    loading.value = false
    startSuccessRedirect()
  } catch (err) {
    loading.value = false
    error.value = err instanceof Error ? err.message : 'Error en el proceso de autenticación'
    startErrorRedirect(true)
  }
})
</script>
```

### Router (rutas MSAL)
```typescript
// Agregar junto a la ruta de login:
{
  path: '/auth/callback',
  name: 'auth-callback',
  component: () => import('@/views/auth/AuthCallbackView.vue'),
  meta: { public: true },  // CRÍTICO: nunca requiresAuth
},
```

### Guard actualizado (MSAL — no llama checkAuthIfNeeded en rutas públicas)
```typescript
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.public) return  // login, callback, logout pasan siempre

  if (!authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

---

## Patrón C — SSO delegado al backend (backend redirige a Microsoft)

> El frontend **no instala MSAL**. Solo redirige al endpoint del backend y espera el callback.
> El backend maneja toda la negociación OAuth (cookie de sesión o JWT propio).

### `src/services/api/services/auth.service.ts` (SSO delegado)
```typescript
import { AUTH_API_ENDPOINTS } from '@/constants/api-endpoints.constants'

export class AuthService {
  /** Redirige al backend que inicia el flujo OAuth con Microsoft */
  static login(): void {
    const callbackUrl = `${window.location.origin}/auth/callback`
    window.location.href =
      `${AUTH_API_ENDPOINTS.BASE}${AUTH_API_ENDPOINTS.LOGIN}?returnUrl=${encodeURIComponent(callbackUrl)}`
  }

  /** Obtiene perfil/permisos del usuario (cookie de sesión) */
  static async getProfile(): Promise<ProfileResponse> {
    const response = await httpClient.get<ProfileResponse>(
      `${AUTH_API_ENDPOINTS.BASE}${AUTH_API_ENDPOINTS.PROFILE}`,
    )
    return response.data
  }

  /** Redirige al backend para cerrar sesión */
  static logout(): void {
    const redirectUrl = `${window.location.origin}/auth/login`
    window.location.href =
      `${AUTH_API_ENDPOINTS.BASE}${AUTH_API_ENDPOINTS.LOGOUT}?returnUrl=${encodeURIComponent(redirectUrl)}`
  }
}

export interface ProfileResponse {
  isAuthenticated: boolean
  userInfo: { name: string; email: string; role: string } | null
  permissions: string[]
  sessionInfo: { expiresAt: string } | null
}
```

### Constantes para SSO delegado
```typescript
// src/constants/api-endpoints.constants.ts
export const AUTH_API_ENDPOINTS = {
  BASE: '/api/v1/Auth',   // Ajustar según el backend
  LOGIN: '/login',        // GET — redirige a Microsoft
  LOGOUT: '/logout',      // GET — redirige a Microsoft para cerrar sesión
  PROFILE: '/profile',    // GET — devuelve sesión activa (cookie HttpOnly)
  ME: null,               // null = no hay endpoint /me separado
} as const
```

### `AuthCallbackView.vue` (SSO delegado — verifica sesión via API)
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_AFTER_LOGIN_ROUTE } from '@/constants/auth.constants'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const errorCountdown = ref(10)

const startErrorRedirect = () => {
  const iv = setInterval(() => {
    errorCountdown.value--
    if (errorCountdown.value <= 0) { clearInterval(iv); router.replace('/auth/login') }
  }, 1000)
}

onMounted(async () => {
  // Error propagado desde el backend via query param
  const urlParams = new URLSearchParams(window.location.search)
  const backendError = urlParams.get('error')
  if (backendError) {
    error.value = backendError === 'AADSTS900561'
      ? 'Inicio de sesión cancelado.'
      : `Error de autenticación: ${backendError}`
    loading.value = false
    startErrorRedirect()
    return
  }

  try {
    const profile = await AuthService.getProfile()

    if (!profile.isAuthenticated || !profile.userInfo) {
      error.value = 'No se pudo verificar la autenticación.'
      loading.value = false
      startErrorRedirect()
      return
    }

    authStore.setSession({
      user: {
        id: profile.userInfo.email,
        name: profile.userInfo.name,
        email: profile.userInfo.email,
        role: profile.userInfo.role,
        permissions: { modules: [], grantedActionKeys: profile.permissions },
      },
      accessToken: 'cookie-managed', // sesión via cookie HttpOnly
    })

    loading.value = false
    router.replace(DEFAULT_AFTER_LOGIN_ROUTE)
  } catch (err) {
    loading.value = false
    error.value = 'Error procesando la autenticación. Intenta nuevamente.'
    startErrorRedirect()
  }
})
</script>
```

---

## Patrón A/Google — Google OAuth adicional al login JWT

> Solo mostrar el botón de Google si `VITE_GOOGLE_CLIENT_ID` está definido.
> El botón carga el SDK de Google en runtime (no requiere npm).

### `src/composables/useGoogleLogin.ts`
```typescript
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_AFTER_LOGIN_ROUTE } from '@/constants/auth.constants'

// Tipo para el objeto global window.google
type GoogleAccounts = {
  id: {
    initialize(config: { client_id: string; callback: (r: { credential: string }) => void; auto_select?: boolean }): void
    renderButton(el: HTMLElement, opts: { theme?: string; size?: string; text?: string; width?: number }): void
  }
}

declare global {
  interface Window { google?: { accounts: GoogleAccounts } }
}

export function useGoogleLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  const googleButtonRef = ref<HTMLElement | null>(null)
  const isSubmittingGoogle = ref(false)
  const googleError = ref('')

  const handleCredentialResponse = (response: { credential: string }) => {
    if (!response?.credential) return
    isSubmittingGoogle.value = true
    googleError.value = ''

    authStore
      .loginWithGoogle(response.credential)  // POST backend con idToken
      .then(() => router.push(DEFAULT_AFTER_LOGIN_ROUTE))
      .catch(() => {
        googleError.value = 'Correo no autorizado en el sistema.'
      })
      .finally(() => { isSubmittingGoogle.value = false })
  }

  const initGoogleSignIn = () => {
    const g = window.google
    if (!g?.accounts?.id || !googleButtonRef.value) return

    g.accounts.id.initialize({
      client_id: googleClientId!,
      callback: handleCredentialResponse,
      auto_select: false,
    })

    g.accounts.id.renderButton(googleButtonRef.value, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 320,
    })
  }

  onMounted(() => {
    if (!googleClientId) return  // Sin VITE_GOOGLE_CLIENT_ID, no cargar nada

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
    if (existing) { initGoogleSignIn(); return }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => initGoogleSignIn()
    document.head.appendChild(script)
  })

  return { googleClientId, googleButtonRef, isSubmittingGoogle, googleError }
}
```

### Uso en LoginView (Google como complemento al formulario JWT)
```vue
<!-- Dentro del <form>, después del AppButton principal -->
<template>
  <!-- ... formulario JWT ... -->

  <!-- Separador + Google (solo si VITE_GOOGLE_CLIENT_ID está definido) -->
  <template v-if="googleClientId">
    <div class="relative flex items-center py-2">
      <div class="flex-grow border-t border-gray-200 dark:border-gray-600" />
      <span class="mx-3 text-xs text-gray-400">o</span>
      <div class="flex-grow border-t border-gray-200 dark:border-gray-600" />
    </div>
    <div ref="googleButtonRef" class="flex justify-center min-h-[48px]" aria-label="Iniciar sesión con Google" />
    <p v-if="googleError" class="text-sm text-red-600 dark:text-red-400 text-center">{{ googleError }}</p>
  </template>
</template>

<script setup lang="ts">
// Agregar a los imports del LoginView existente:
import { useGoogleLogin } from '@/composables/useGoogleLogin'
const { googleClientId, googleButtonRef, googleError } = useGoogleLogin()
</script>
```

### Auth Store — `loginWithGoogle` (método requerido)
```typescript
// Agregar en useAuthStore() si se usa Google OAuth:
const loginWithGoogle = async (idToken: string) => {
  // El backend recibe el Google ID Token y devuelve un JWT propio
  const response = await AuthService.loginWithGoogle(idToken)
  setSession({ user: response.user, accessToken: response.accessToken })
}
// Exponer en el return del store: loginWithGoogle
```

### Auth Service — `loginWithGoogle` (método requerido)
```typescript
// Agregar en AuthService si se usa Google OAuth:
static async loginWithGoogle(idToken: string): Promise<LoginResponse> {
  // Ajustar el endpoint según el contrato del backend
  const response = await httpClient.post<LoginResponse>(
    `${this.BASE_URL}/google`,
    { idToken },
    { skipErrorHandler: true },
  )
  return response.data
}
```

---

## Checklist por Patrón

### MSAL directo (Patrón B)
- [ ] `pnpm add @azure/msal-browser` ejecutado
- [ ] `.env.local` con `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`, `VITE_AZURE_REDIRECT_URI_WEB`
- [ ] Redirect URI registrada en Azure Portal > App Registration > Authentication
- [ ] Ruta `/auth/callback` con `meta: { public: true }` en router
- [ ] Guard no llama `checkAuthIfNeeded()` en rutas `meta.public`
- [ ] `AuthCallbackView` inicializa MSAL y setea sesión en authStore

### SSO delegado al backend (Patrón C)
- [ ] `.env.local` con `VITE_API_BASE_URL` apuntando al backend
- [ ] `AuthService.login()` redirige al backend (no instala MSAL)
- [ ] `AuthService.getProfile()` llama al endpoint de perfil post-redirect
- [ ] `AuthCallbackView` llama `getProfile()` y setea sesión en authStore
- [ ] Backend debe tener el frontend URL como `returnUrl` válido en su CORS/allowedOrigins

### Google OAuth (Patrón A complementario)
- [ ] `VITE_GOOGLE_CLIENT_ID` en `.env.local` (si no está, el botón no aparece)
- [ ] Google Client ID configurado con la URL del frontend en Google Cloud Console
- [ ] Backend tiene endpoint para validar Google ID Token (preguntar endpoint al usuario)
- [ ] `loginWithGoogle(idToken)` en AuthService y AuthStore implementados
- [ ] El botón Google se renderiza en un `ref` de HTMLElement (no en teleport)
