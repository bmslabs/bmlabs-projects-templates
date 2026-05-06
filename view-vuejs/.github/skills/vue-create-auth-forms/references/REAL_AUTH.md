# Referencia Real: Autenticación (Patrón BM)

> Patrones extraídos de proyectos productivos BM (múltiples clientes). DEBES replicar el patrón que corresponda según el contrato del backend.

## Regla Crítica (Contract-First)

- Nunca asumir un único modo de autenticación.
- Siempre priorizar el contrato real entregado por Swagger o por el usuario.
- Si el usuario entrega endpoint y response body, ese contrato manda por sobre ejemplos legacy.

### Modos soportados

| Patrón | Cuándo usar | Almacenamiento |
|--------|-------------|----------------|
| **A. Username/Password + JWT** | Backend custom con `/Login` propio | `sessionStorage('auth_token')` |
| **B. OAuth/Microsoft SSO** | Backend delegado a MSAL/Azure AD | Token manejado por MSAL, rol en store |
| **C. Google OAuth + JWT** | Backend con Google ID Token | `sessionStorage('auth_token')` |
| **D. Cookie HttpOnly** | Backend con sesión server-side | Cookie automática (no manual) |

---

## Perfil Registro JWT (obligatorio si el backend responde token)

### Login endpoint

- `POST /api/v1/Registro/Login`

### Request

```json
{
  "email": "admin@dominio.com",
  "password": "********"
}
```

### Response ejemplo

```json
{
  "access_token": "ey...",
  "expiration": 3600,
  "sessionContext": null,
  "usuarioId": "00000000-0000-0000-0000-000000000001"
}
```

### Mapeo mínimo requerido

- Guardar token en `sessionStorage('auth_token')`.
- Persistir solo `user` en `localStorage('auth_user')`.
- No bloquear login por ausencia de campos secundarios si hay token válido.
- Parser robusto: aceptar `access_token | accessToken | token | jwt` y payload envuelto en `data` o `result`.

---

## 1. Auth Service (`auth.service.ts`)

```typescript
// src/services/api/services/auth.service.ts
import httpClient from '../http-client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role?: string
  profileId?: string
  permissions?: {
    modules: string[]
    grantedActionKeys?: string[]
  }
}

export interface LoginResponse {
  accessToken: string
  expiration: number
  usuarioId: string
  metadata?: Record<string, unknown>
  user: AuthUser
}

export interface CheckAuthResponse {
  user: AuthUser | null
}

/**
 * Servicio de autenticación contract-first.
 * Si login devuelve token, el frontend lo persiste en sessionStorage('auth_token').
 */
export class AuthService {
  private static readonly BASE_URL = '/v1/Registro'

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<{
      access_token?: string
      accessToken?: string
      token?: string
      jwt?: string
      expiration?: number
      usuarioId?: string
      [key: string]: unknown
    }>(
      `${this.BASE_URL}/Login`, credentials, { skipErrorHandler: true },
    )
    const accessToken =
      response.data.access_token || response.data.accessToken || response.data.token || response.data.jwt
    if (!accessToken) throw new Error('La API no devolvió token de autenticación.')

    const usuarioId = response.data.usuarioId ?? credentials.email
    return {
      accessToken,
      expiration: response.data.expiration ?? 0,
      usuarioId,
      metadata: {
        sessionContext: response.data.sessionContext ?? null,
      },
      user: {
        id: usuarioId,
        name: credentials.email.split('@')[0] || 'Usuario',
        email: credentials.email,
      },
    }
  }

  static async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${this.BASE_URL}/google`, { idToken }, { skipErrorHandler: true },
    )
    return response.data
  }

  static async logout(): Promise<void> {
    await httpClient.post(`${this.BASE_URL}/logout`, null, { skipErrorHandler: true })
  }

  static async checkAuth(): Promise<CheckAuthResponse> {
    const response = await httpClient.get<CheckAuthResponse>('/auth/me')
    return response.data
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>(
      `/auth/forgot-password`, { email }, { skipErrorHandler: true },
    )
    return response.data
  }

  static async resetPassword(data: {
    token: string; newPassword: string; confirmPassword: string
  }): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>(
      `/auth/reset-password`, data, { skipErrorHandler: true },
    )
    return response.data
  }
}
```

---

## 2. Auth Store (`auth.store.ts`) — Setup Store con Pinia

```typescript
// src/stores/auth.store.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { AuthService } from '@/services/api/services/auth.service'
import type { AuthUser, LoginRequestDto } from '@/types/auth.types'

const USER_STORAGE_KEY = 'auth_user'
const TOKEN_STORAGE_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  // isAuthenticated verifica el token en sessionStorage (Bearer token)
  const isAuthenticated = computed(() => !!sessionStorage.getItem(TOKEN_STORAGE_KEY))

  const setSession = (payload: { user: AuthUser; accessToken: string }) => {
    user.value = payload.user
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(payload.user))
    sessionStorage.setItem(TOKEN_STORAGE_KEY, payload.accessToken)
  }

  const clearSession = () => {
    user.value = null
    localStorage.removeItem(USER_STORAGE_KEY)
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  const login = async (credentials: LoginRequestDto) => {
    const response = await AuthService.login(credentials)
    setSession({ user: response.user, accessToken: response.accessToken })
  }

  const loadFromStorage = () => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY)
    if (!savedUser) return
    try {
      user.value = JSON.parse(savedUser) as AuthUser
    } catch {
      clearSession()
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      clearSession()
      return false
    }
    try {
      const response = await AuthService.checkAuth()
      if (!response.user) {
        clearSession()
        return false
      }
      user.value = response.user
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user))
      return true
    } catch {
      clearSession()
      return false
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } finally {
      clearSession()
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    loadFromStorage,
    checkAuth,
  }
})
```

**Token Strategy**: Tokens Bearer almacenados en `sessionStorage('auth_token')`. Info del usuario en `localStorage('auth_user')`. El `httpClient` inyecta el token automáticamente. En 401 redirige directamente a `/auth/login`.

---

## 3. Login View con Zod y componentes corporativos

```vue
<!-- src/views/auth/LoginView.vue -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBreadcrumb from '@/components/shared/AppBreadcrumb.vue'
import AppButton from '@/components/shared/AppButton.vue'
import FormInput from '@/components/shared/FormInput.vue'
import { useAuthStore } from '@/stores/auth.store'
import { loginSchema, type LoginForm } from '@/validators/auth.validator'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive<LoginForm>({
  usernameOrEmail: '',
  password: '',
})

const errors = reactive<Partial<Record<keyof LoginForm, string>>>({})
const apiError = ref('')
const isLoading = ref(false)

const validate = () => {
  const result = loginSchema.safeParse(form)
  errors.usernameOrEmail = undefined
  errors.password = undefined

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof LoginForm
      if (!errors[field]) errors[field] = issue.message
    }
    return false
  }
  return true
}

const handleSubmit = async () => {
  apiError.value = ''
  if (!validate()) return

  isLoading.value = true
  try {
    await authStore.login(form)
    // Prioridad: 1) ?redirect= en query  2) ruta especificada por usuario  3) DEFAULT_AFTER_LOGIN_ROUTE (/home)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : DEFAULT_AFTER_LOGIN_ROUTE
    await router.push(redirect)
  } catch {
    apiError.value = 'Credenciales inválidas. Verifica tus datos e intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 px-4 py-10 dark:bg-gray-950">
    <div class="mx-auto w-full max-w-md">
      <AppBreadcrumb />

      <section
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <header class="mb-6 space-y-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Iniciar sesión</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Accede al panel administrativo.
          </p>
        </header>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <FormInput
            id="login-username"
            v-model="form.usernameOrEmail"
            label="Usuario o correo"
            autocomplete="username"
            :error="!!errors.usernameOrEmail"
            :error-message="errors.usernameOrEmail"
          />

          <FormInput
            id="login-password"
            v-model="form.password"
            type="password"
            label="Contraseña"
            autocomplete="current-password"
            :show-password-toggle="true"
            :error="!!errors.password"
            :error-message="errors.password"
          />

          <p v-if="apiError" class="text-sm font-medium text-red-600 dark:text-red-400">{{ apiError }}</p>

          <AppButton id="btn-login" type="submit" full-width :is-loading="isLoading">
            Entrar al sistema
          </AppButton>
        </form>
      </section>
    </div>
  </div>
</template>
```

**Reglas clave**:
- Importar schema Zod desde `@/validators/auth.validator` (no inline)
- Usar `FormInput` (no `<input>` nativo) con props `:error` y `:error-message`
- Usar `AppButton` con `:is-loading` para feedback visual
- `AppBreadcrumb` obligatorio al inicio del template
- Redirect post-login: `route.query.redirect` → ruta especificada por usuario → `DEFAULT_AFTER_LOGIN_ROUTE` (`/home` por defecto)
- NUNCA hardcodear `/dashboard` como fallback; usar la constante `DEFAULT_AFTER_LOGIN_ROUTE`
- Ruta de login: `/auth/login` (no `/login`)

---

## Patrón B — Microsoft SSO (MSAL / OAuth redirect)

> Usar cuando el backend delega autenticación a Azure AD. No hay form de usuario/clave.
> Requiere una `AuthCallbackView` para procesar el redirect.

### LoginView (solo botón SSO)

```vue
<!-- src/views/auth/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div class="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center space-y-10 border border-gray-200 dark:border-gray-700">
      <div class="p-4 bg-[var(--color-primary)] rounded-xl shadow-md border-2 border-white/20">
        <img :src="logoSrc" alt="Logo" class="w-48 h-auto filter brightness-0 invert" />
      </div>

      <div class="w-full space-y-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">Iniciar Sesión</h2>
          <p class="text-gray-500 dark:text-gray-300 text-sm">Use su cuenta de Microsoft para acceder al sistema</p>
        </div>

        <div v-if="errorMessage" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong>Error:</strong> {{ errorMessage }}
        </div>

        <button
          id="btn-microsoft-login"
          type="button"
          class="w-full py-3.5 rounded-xl text-sm font-bold bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="isLoggingIn"
          @click="handleLogin"
        >
          <span v-if="isLoggingIn" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          <!-- Microsoft logo SVG (4 colored squares) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#f25022" d="M13 13h10v10H13z" />
            <path fill="#00a4ef" d="M13 25h10v10H13z" />
            <path fill="#7fba00" d="M25 13h10v10H25z" />
            <path fill="#ffb900" d="M25 25h10v10H25z" />
          </svg>
          {{ isLoggingIn ? 'Redirigiendo...' : 'Continuar con Microsoft' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import logoSrc from '@/assets/logo/logo.png'

const route = useRoute()
const isLoggingIn = ref(false)
const errorMessage = ref('')

onMounted(() => {
  // Propagar errores desde query params del redirect
  if (route.query.error) {
    const errorType = route.query.error as string
    const errorMsg = route.query.message as string
    errorMessage.value = errorMsg || errorType
  }
})

const handleLogin = async () => {
  isLoggingIn.value = true
  errorMessage.value = ''
  try {
    await AuthService.login() // Redirige a Microsoft; no retorna
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error durante el inicio de sesión'
    isLoggingIn.value = false
  }
}
</script>
```

### AuthCallbackView (procesar redirect OAuth)

```vue
<!-- src/views/auth/AuthCallbackView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div class="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center space-y-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-100">Procesando Inicio de Sesión</h2>

      <div v-if="loading" class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
        <p class="text-gray-500 dark:text-gray-400 text-sm text-center">Verificando información del usuario...</p>
      </div>

      <div v-if="alreadyAuthenticated" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center text-green-700 dark:text-green-400">
        Sesión activa. {{ redirectMessage }}
      </div>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <p class="text-red-700 dark:text-red-400 font-semibold mb-1">Error de autenticación</p>
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <p class="text-xs text-red-500 mt-2">Redirigiendo en {{ errorCountdown }}s...</p>
      </div>

      <div v-if="!loading && !error && !alreadyAuthenticated && success"
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center text-green-700 dark:text-green-400">
        ¡Autenticación exitosa! Redirigiendo en {{ countdown }}s...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { DEFAULT_AFTER_LOGIN_ROUTE } from '@/constants/auth.constants'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const success = ref(false)
const alreadyAuthenticated = ref(false)
const redirectMessage = ref('')
const countdown = ref(3)
const errorCountdown = ref(10)

onMounted(async () => {
  try {
    if (authStore.isAuthenticated) {
      alreadyAuthenticated.value = true
      redirectMessage.value = 'Redirigiendo...'
      loading.value = false
      await router.replace(DEFAULT_AFTER_LOGIN_ROUTE)
      return
    }

    // Procesar token/code del redirect OAuth
    await authStore.handleOAuthCallback()
    success.value = true
    loading.value = false

    const interval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(interval)
        router.replace(DEFAULT_AFTER_LOGIN_ROUTE)
      }
    }, 1000)
  } catch (err) {
    loading.value = false
    error.value = err instanceof Error ? err.message : 'Error en el proceso de autenticación'

    const interval = setInterval(() => {
      errorCountdown.value--
      if (errorCountdown.value <= 0) {
        clearInterval(interval)
        router.replace('/auth/login?error=callback_failed')
      }
    }, 1000)
  }
})
</script>
```

**Reglas OAuth callback**:
- Siempre verificar `authStore.isAuthenticated` al inicio; si ya hay sesión, redirigir
- Mostrar spinner mientras procesa
- Auto-redirect con countdown en error (10s) y éxito (3s)
- Ruta callback registrada como pública (`meta: { public: true }`) en el router

---

## Patrón A — ForgotPassword + ResetPassword (solo si el backend lo soporta)

> Solo generar si el usuario confirma que existe endpoint `/auth/forgot-password` y `/auth/reset-password`.

### ForgotPasswordView

```vue
<!-- src/views/auth/ForgotPasswordView.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
    <main class="w-full max-w-md flex flex-col items-center rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">¿Olvidaste tu contraseña?</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Ingresa tu correo y te enviaremos un enlace de recuperación.
      </p>

      <!-- Estado: formulario -->
      <form v-if="!emailSent" class="w-full space-y-5" @submit.prevent="handleSubmit">
        <FormInput
          id="forgot-password-email"
          v-model="email"
          label="Correo electrónico"
          type="email"
          autocomplete="email"
          :error="!!errors.email"
          :error-message="errors.email"
          @blur="validateField('email')"
        />
        <AppButton id="btn-send-reset" type="submit" :full-width="true" :is-loading="isSubmitting">
          Enviar enlace de recuperación
        </AppButton>
        <p class="text-center">
          <router-link to="/auth/login" class="text-sm text-gray-500 hover:text-[var(--color-primary)] hover:underline">
            Volver al inicio de sesión
          </router-link>
        </p>
      </form>

      <!-- Estado: email enviado -->
      <div v-else class="w-full text-center space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p class="text-sm text-green-700 dark:text-green-400">
            Si el correo <strong>{{ email }}</strong> está registrado, recibirás el enlace.
            <br /><span class="text-xs text-green-600">Revisa spam. El enlace expira en 60 minutos.</span>
          </p>
        </div>
        <button type="button" class="w-full rounded-lg border border-gray-300 py-2.5 text-sm" @click="resetForm">
          Enviar a otro correo
        </button>
        <router-link to="/auth/login" class="block text-sm text-gray-500 hover:underline">Volver al login</router-link>
      </div>
    </main>
  </div>
</template>
```

### ResetPasswordView

```vue
<!-- src/views/auth/ResetPasswordView.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
    <main class="w-full max-w-md flex flex-col items-center rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Restablecer contraseña</h1>

      <!-- Token inválido -->
      <div v-if="tokenError" class="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-sm text-red-700 dark:text-red-400 font-semibold">Enlace inválido o expirado</p>
        <router-link to="/auth/forgot-password" class="mt-2 block text-sm text-center text-red-600 underline">
          Solicitar nuevo enlace
        </router-link>
      </div>

      <!-- Formulario -->
      <form v-else-if="!passwordReset" class="w-full space-y-5" @submit.prevent="handleSubmit">
        <FormInput
          id="reset-new-password"
          v-model="newPassword"
          label="Nueva contraseña"
          type="password"
          show-password-toggle
          autocomplete="new-password"
          :error="!!errors.newPassword"
          :error-message="errors.newPassword"
          @blur="validateField('newPassword')"
        />
        <FormInput
          id="reset-confirm-password"
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          show-password-toggle
          autocomplete="new-password"
          :error="!!errors.confirmPassword"
          :error-message="errors.confirmPassword"
          @blur="validateField('confirmPassword')"
        />
        <AppButton id="btn-reset-password" type="submit" :full-width="true" :is-loading="isSubmitting">
          Restablecer contraseña
        </AppButton>
      </form>

      <!-- Éxito -->
      <div v-else class="w-full text-center space-y-4">
        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-700 dark:text-green-400">¡Contraseña restablecida exitosamente!</p>
        </div>
        <router-link to="/auth/login" class="w-full inline-block rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white text-center">
          Ir al inicio de sesión
        </router-link>
      </div>
    </main>
  </div>
</template>
```

**Reglas ForgotPassword/ResetPassword**:
- Solo generar si el contrato tiene esos endpoints (no asumir)
- ForgotPassword: dos estados (`!emailSent` / `emailSent`) en template con `v-if`
- ResetPassword: tres estados (`tokenError` / form / `passwordReset`)
- Token leído desde `route.query.token` en `onMounted`
- IDs kebab-case para testing

---

## Checklist de Calidad

- [ ] ¿Patrón correcto seleccionado según contrato (A/B/C/D)?
- [ ] ¿`AuthService` es clase estática con `skipErrorHandler: true`?
- [ ] ¿Auth store usa `defineStore('auth', () => { ... })` (setup store)?
- [ ] ¿Auth store usa `setSession` / `clearSession` para gestionar el token?
- [ ] ¿`isAuthenticated` verifica `sessionStorage('auth_token')`?
- [ ] ¿Login valida con Zod (desde `@/validators/`) antes de enviar? (solo patrón A)
- [ ] ¿Se usa `FormInput` en lugar de `<input>` nativo? (solo patrón A)
- [ ] ¿Se usa `AppButton` con `:is-loading` en el botón de submit?
- [ ] ¿Si OAuth: hay `AuthCallbackView` con countdown en error y en éxito?
- [ ] ¿`DEFAULT_AFTER_LOGIN_ROUTE` en lugar de ruta hardcodeada?

