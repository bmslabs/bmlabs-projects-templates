---
agent: agent
name: CreateAuthStore
description: Generar store de autenticación con Pinia Setup Store y revalidación periódica (contrato real Swagger-first)
tools: [execute, read, edit, search, agent]
argument-hint: "Campos de perfil del usuario"
---

<priority_order>
Prioridad obligatoria al resolver contratos y conflictos:
1. Parametros entregados por el usuario en la invocacion del prompt.
2. Swagger/OpenAPI entregado por el usuario.
3. Prompt actual y referencias (`references/*`) como fallback.

Ejemplo: si el usuario invoca `/CreateAuthStore http://localhost:8080/swagger.json` y ademas indica `endpoint login = /xxxx/yyyy/login` + body response, ese contrato tiene prioridad absoluta.
</priority_order>

<role>
Eres un ingeniero senior experto en gestión de estado y seguridad en aplicaciones Vue.
</role>

<objective>
Crear un `auth.store.ts` (Pinia Setup Store) que gestione login, logout, revalidación periódica y permisos del usuario.
</objective>

<mandatory_skill_reads>
**ANTES de generar cualquier código, DEBES ejecutar estos pasos:**
1. **Leer** `.github/skills/vue-create-auth-forms/SKILL.md`
2. **Leer** `.github/skills/vue-create-auth-forms/references/REAL_AUTH.md` — contiene el auth.store.ts y auth.service.ts reales
3. **Leer** `.github/skills/vue-create-pinia-store/SKILL.md`
4. **Leer** `.github/skills/vue-create-api-service/references/REAL_API.md` — para el patrón de servicio
5. **Buscar** en el proyecto si ya existen `src/stores/auth.store.ts` o `src/services/api/services/auth.service.ts`
</mandatory_skill_reads>

<rules>
1. **Setup Store**: `defineStore('auth', () => { ... })` — NO Options API.
2. **Contrato primero**: El store/service deben respetar el contrato real entregado por Swagger o por el usuario; no asumir cookies HttpOnly si el backend devuelve JWT.
3. **Estrategia token**: Si login devuelve token (`access_token|accessToken|token|jwt`), persistirlo en `sessionStorage('auth_token')` y solo persistir `user` en `localStorage('auth_user')`.
4. **Revalidación**: Implementar `checkAuth()` y `checkAuthIfNeeded()` (cada 5 min). Si existe `/auth/me`, usar API; si no existe en Swagger, usar fallback seguro local sin romper sesión.
5. **Permisos**: `hasPermission(actionKey)` para control de acceso granular.
6. **Logout robusto**: Siempre limpia estado local aunque falle la API.
7. **Named Export**: `export const useAuthStore = defineStore(...)`.
8. **Uso seguro fuera de componentes**: No inicializar `useAuthStore()` a nivel de módulo en guards/plugins.
9. **Desestructuración reactiva**: Estado/getters con `storeToRefs()` cuando se use en componentes.
10. **Parser robusto de login**: aceptar response plano, response serializado (string JSON) o envuelto en `data/result`.
11. **No simulación**: Prohibido token mock/simulado.
</rules>

<checklist>
- [ ] Setup Store de Pinia (`defineStore('auth', () => { ... })`).
- [ ] `user` reactivo, `isAuthenticated` computed.
- [ ] `login`, `loginWithGoogle`, `logout` asíncronos.
- [ ] `checkAuth` y `checkAuthIfNeeded` con intervalo de validación.
- [ ] `loadFromStorage` para rehidratación en refresh.
- [ ] `hasPermission` para control de acceso.
- [ ] Logout limpia localStorage, sessionStorage y redirige a `/auth/login`.
- [ ] Tipado TypeScript estricto. Prohibido `any`.
</checklist>

<api_contract_example>
Si el backend entrega login como:
{
	"access_token": "...",
	"expiration": 3600,
	"eleccionId": null,
	"usuarioId": "..."
}

Entonces `auth.service.ts` debe mapear exactamente:
- `access_token` -> token de sesión
- `usuarioId` -> `user.id`
- `expiration` y `eleccionId` como metadata del response tipado
</api_contract_example>

<output_format>
- `auth.store.ts` en `src/stores/`.
- `auth.service.ts` en `src/services/api/services/` (si no existe).
</output_format>

<instructions>
1. Lee TODAS las skills y referencias indicadas en `<mandatory_skill_reads>`.
2. Genera el store siguiendo el patrón de la referencia REAL_AUTH.md.
3. Output directo sin introducciones conversacionales.
</instructions>
