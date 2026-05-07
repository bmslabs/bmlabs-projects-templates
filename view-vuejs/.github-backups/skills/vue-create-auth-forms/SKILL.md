---
name: vue-create-auth-forms
description: Genera vistas de autenticación con validación Zod, AppButton, token Bearer en sessionStorage y FormInput corporativo.
license: Proprietary
compatibility: Vue 3, Pinia, Vue Router, Zod
metadata:
  author: Ricardo B.T.
  version: 3.1.0
  standard: BM Auth Standard
---

# Skill: Crear Vistas de Autenticación (Auth Flows)

## Propósito
Implementar interfaces de acceso seguras usando `useAuthStore` (Pinia Setup Store), validación Zod, y componentes compartidos reales.

## Invocación
```bash
/J # Genera LoginView.vue
```

## Instrucciones / Estándares Aplicados

### 0. Fuente Visual Obligatoria (Login)
- La vista de login debe replicar la jerarquía visual corporativa usando la referencia local `references/LOGIN_VISUAL_REFERENCE.vue`.
- No se permite generar un login "genérico" o sin identidad visual (sin logo, sin card, sin contraste de tema).
- Si existe conflicto entre visual y componentes corporativos, se mantiene la visual y se mapean controles a componentes compartidos (`FormInput`, `AppButton`).

### 1. Validación con Zod
- Importar schema desde `@/validators/auth.validator` (NO definir inline en la vista).
- Usar `z.object({...}).safeParse(form)` para validar antes de enviar.
- Mensajes de error en español.
- NO usar VeeValidate. Validación manual con `reactive()`.

### 2. Integración con Auth Store
- `useAuthStore` para acciones de `login` y `logout`.
- Tokens Bearer en `sessionStorage('auth_token')`. El `httpClient` los inyecta automáticamente.
- El store persiste solo la info del `user` en `localStorage('auth_user')`.
- El store expone `setSession` / `clearSession` para gestionar la sesión.
- `isAuthenticated` verifica `!!sessionStorage.getItem('auth_token')`.

### 3. Feedback Visual
- `<AppButton>` con `:is-loading` vinculado al estado de la petición.
- Error global de API como texto rojo (`<p>` o `<span>`) debajo del formulario.
- Errores de campo individuales vía `:error-message` de `FormInput`.

### 4. Componentes de UI
- Usar `FormInput` (NO `<input>` nativo) con props `:error` y `:error-message`.
- `AppBreadcrumb` obligatorio al inicio del template.
- `AppButton` con `type="submit"` y `:full-width="true"`.

### 4.1 Contrato Visual del Login (Obligatorio)
- Contenedor principal centrado con `min-h-screen`, fondo claro/oscuro y padding responsive.
- Card principal (`max-w-md`) con borde, sombra y esquinas redondeadas.
- Bloque de marca superior: logo + título + subtítulo.
- Formulario con separación vertical consistente (`space-y-*`) y estado loading visible.
- Enlace de recuperación de contraseña debajo del botón principal.
- Pie de contexto del sistema en la parte inferior.
- Soporte dark mode en todos los bloques visibles (fondo, card, texto, bordes).

### 5. Navegación Post-Autenticación
- **Prioridad de redirect**: `route.query.redirect` → ruta especificada por el usuario → `/home` (fallback por defecto).
- NO usar `/dashboard` como fallback por defecto a menos que el usuario lo especifique explícitamente.
- Ruta de login: `/auth/login` (NO `/login`).
- Usar `DEFAULT_AFTER_LOGIN_ROUTE` de `@/constants/auth.constants` en lugar de hardcodear la ruta.

## Checklist de Calidad

- [ ] ¿Validación con Zod (importado desde `@/validators/`)?
- [ ] ¿Usa `AppButton` con `:is-loading` y `:full-width`?
- [ ] ¿Inyecta `useAuthStore` para la comunicación?
- [ ] ¿Error global y errores de campo individuales?
- [ ] ¿Responsive y dark mode?
- [ ] ¿`<script setup lang="ts">`?
- [ ] ¿Redirect usa `DEFAULT_AFTER_LOGIN_ROUTE` (no ruta hardcodeada)?
- [ ] ¿SSO (Google/Microsoft) solo si fue solicitado explícitamente?

## Qué Genera
- `LoginView.vue` + opcionalmente `ForgotPasswordView.vue`, `ResetPasswordView.vue`, `AuthCallbackView.vue`.

## Selección de Patrón

**REGLA CRÍTICA**: Los patrones B (Microsoft SSO) y C (Google OAuth) **SOLO se generan si el usuario los solicita explícitamente**. Si el usuario no menciona SSO/OAuth/Microsoft/Google, usar siempre el Patrón A.

Antes de generar, determinar el patrón según esta prioridad:
1. **Parámetros explícitos del usuario** (endpoint, payload, response body dados en el prompt)
2. **Swagger/OpenAPI** (si se proporciona)
3. **Fallback**: Patrón A — Username/Password + JWT

| Señal en el contrato | Patrón | Vistas a generar |
|---------------------|--------|------------------|
| Endpoint con `email`/`username` + `password` en request | **A — JWT** (DEFAULT) | `LoginView`, `ForgotPassword*` (solo si hay endpoint) |
| Usuario solicita "Microsoft" / "MSAL" + el frontend gestiona el token de Azure | **B — MSAL directo** | `LoginView` (solo botón), `AuthCallbackView`, `useMsal` composable. Instalar `@azure/msal-browser`. |
| Usuario solicita "Google" / "Google OAuth" (complemento o único) | **A+Google** | `LoginView` + `useGoogleLogin` composable. Sin npm extra. |
| SSO via backend (backend redirige a Microsoft/AD, cookie de sesión) | **C — SSO delegado** | `LoginView` (solo botón), `AuthCallbackView` (verifica `/profile`). Sin MSAL npm. |
| Sin token en response (cookie session, sin OAuth) | **D — Cookie** | `LoginView` simple, sin sessionStorage |

## Referencias y Código Reutilizable
**DEBES leer estas referencias antes de generar código:**
- [VER CÓDIGO FUENTE REAL ORIGEN](./references/REAL_AUTH.md) — Patrón A (JWT) con código completo
- [OAUTH PATTERNS REF](./references/OAUTH_PATTERNS.md) — Patrones B/C/D: MSAL directo, SSO delegado al backend, Google OAuth
  - Incluye: preguntas a hacer al usuario, variables `.env`, composables, `AuthCallbackView`, checklist por patrón

