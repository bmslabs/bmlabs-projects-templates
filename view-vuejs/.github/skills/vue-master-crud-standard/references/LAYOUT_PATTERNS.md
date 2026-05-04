# Referencia: Patrones de Layout y Distribución (BM)

> Patrones extraídos de proyectos productivos BM (múltiples clientes).
> Todos los nombres de cliente han sido removidos. Usar como referencia genérica.

---

## Patrón 1 — Sidebar con Rail Collapse + Header Bar (Avanzado)

**Cuándo usar**: Backoffice con muchas secciones, búsqueda global, modo desktop/mobile.

### Distribución visual
```
┌─────────────── Header Bar (fixed, z-30) ────────────────────┐
│ [Logo] · · · · · · · · · [SearchBtn] [UserCard]             │
└──────────────────────────────────────────────────────────────┘
┌──Sidebar(fixed)──┐ ┌──────── Content (ml transition) ────────┐
│  [Toggle btn]    │ │                                          │
│  [Nav items]     │ │  <Breadcrumb />                          │
│  ──────────────  │ │  <RouterView />                          │
│  [Logout btn]    │ │                                          │
└──────────────────┘ └──────────────────────────────────────────┘
```

### DefaultLayout.vue
```vue
<template>
  <!-- AppSidebar emite estado al layout -->
  <AppSidebar @sidebar-state-change="handleSidebarStateChange" @open-search="openSearch" />

  <div
    :class="[
      'content transition-[margin-left] duration-700 ease-out pt-20 px-2 md:px-5 pb-4 bg-gray-50 dark:bg-gray-800 min-h-screen',
      contentOffsetClass,
    ]"
    style="overflow-x: hidden; position: relative"
  >
    <div class="mx-auto w-full" style="max-width: 100%">
      <AppBreadcrumb />
      <RouterView :key="route.fullPath" />
    </div>
  </div>

  <!-- FAB para búsqueda en mobile -->
  <button
    type="button"
    class="fixed bottom-5 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary,#2563eb)] text-white shadow-md md:hidden"
    aria-label="Abrir búsqueda"
    @click="openSearch"
  >
    <Search class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { useUIStore } from '@/stores'

const route = useRoute()
const uiStore = useUIStore()
const searchOpen = ref(false)

const contentOffsetClass = computed(() => {
  const s = uiStore.sidebarState
  if (!s.isDesktop) return 'ml-0'
  return s.isDesktopRailCollapsed ? 'ml-12' : 'ml-12 md:ml-60'
})

const handleSidebarStateChange = (state: {
  isDesktop: boolean; isOpen: boolean; isDesktopRailCollapsed: boolean
}) => {
  uiStore.setSidebarState(state)
}

const openSearch = () => { searchOpen.value = true }
</script>
```

### AppSidebar — emisión de estado al layout
```typescript
// Props / Emits del sidebar avanzado
const emit = defineEmits<{
  'sidebar-state-change': [state: {
    isDesktop: boolean
    isOpen: boolean
    isDesktopRailCollapsed: boolean
  }]
  'open-search': []
}>()
```

### Sidebar con `provide/inject` para flyout en rail mode
```typescript
// Dentro de AppSidebar.vue:
provide('sidebarIsRailMode', sidebarIsRailMode)        // readonly ComputedRef<boolean>
provide('openSidebarGroupFlyout', openSidebarGroupFlyout)
provide('closeSidebarGroupFlyout', closeSidebarGroupFlyout)

// En el componente hijo AppSidebarNav.vue:
const sidebarIsRailMode = inject<ComputedRef<boolean>>('sidebarIsRailMode', computed(() => false))
const openFlyout = inject<(item: NavigationItem, anchor: HTMLElement) => void>('openSidebarGroupFlyout')
```

---

## Patrón 2 — Sidebar con Emit Open + Content Margin Dinámico (Estándar)

**Cuándo usar**: Backoffice medio con sidebar colapsable, sin búsqueda global.

### Distribución visual
```
┌──Sidebar──┐ ┌──────────── Content ──────────────────────────┐
│ [Nav]     │ │  pt-20 px-5                                   │
│ [Logout]  │ │  <AppHeader />  (opcional, separado)          │
└───────────┘ │  <RouterView />                               │
              └───────────────────────────────────────────────┘
```

### DefaultLayout.vue
```vue
<template>
  <div class="relative min-h-screen">
    <AppSidebar @update:open="updateSidebarState" />

    <!-- Header separado (opcional) -->
    <div
      class="transition-[margin-left] ease-in-out duration-500"
      :class="{ 'md:ml-[48px]': !isSidebarOpenOnDesktop, 'md:ml-60': isSidebarOpenOnDesktop }"
    >
      <AppHeader />  <!-- Opcional: solo si existe en el proyecto -->
    </div>

    <main
      class="content relative z-0 transition-[margin-left] ease-in-out duration-500 pt-5 px-2 md:px-5 pb-4"
      :class="{ 'md:ml-[48px]': !isSidebarOpenOnDesktop, 'md:ml-60': isSidebarOpenOnDesktop }"
    >
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sidebarOpenState = ref(false)
const isDesktop = ref(window.innerWidth >= 768)

const updateSidebarState = (isOpen: boolean) => { sidebarOpenState.value = isOpen }

const isSidebarOpenOnDesktop = computed(() => sidebarOpenState.value && isDesktop.value)

const handleResize = () => { isDesktop.value = window.innerWidth >= 768 }

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>
```

### AppSidebar — solo emite boolean
```typescript
// Patrón simplificado: emite solo isOpen
const emit = defineEmits<{ 'update:open': [isOpen: boolean] }>()
```

---

## Patrón 3 — Sidebar Fijo + Content con Margen Estático (Minimal)

**Cuándo usar**: Apps móviles/tablet, interfaces simples, sidebar siempre visible.

```vue
<template>
  <AppSidebar />
  <div class="content ease-in-out duration-500 pt-20 ml-12 px-2 md:px-5 pb-4">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
</script>
```

---

## Patrón 4 — Sidebar como Props (Más Modular)

**Cuándo usar**: Cuando el layout controla toda la lógica de navegación; sidebar es "tonto".

```vue
<template>
  <!-- Mobile header con hamburger -->
  <header class="fixed inset-x-0 top-0 z-[80] flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/50 px-3 py-3 backdrop-blur md:hidden">
    <button type="button" @click="sidebarOpen = !sidebarOpen" aria-label="Abrir menú">
      <Menu class="h-5 w-5" />
    </button>
    <AppLogo :size="48" />
    <button type="button" @click="openSearch" aria-label="Buscar">
      <Search class="h-4 w-4" />
    </button>
  </header>

  <!-- Sidebar recibe todo por props -->
  <AppSidebar
    :navigation-items="navigationItems"
    :user-name="userName"
    :is-open="sidebarOpen"
    @sidebar-state-change="handleSidebarStateChange"
    @navigate="navigateTo"
    @logout="handleLogout"
    @open-search="openSearch"
  />

  <div :class="['content transition-[margin-left] duration-700 ease-out pt-20 px-2 md:px-5 pb-4 bg-gray-50 dark:bg-gray-800 min-h-screen', contentOffsetClass]">
    <RouterView :key="route.fullPath" />
  </div>
</template>
```

### AppSidebar props-driven interface
```typescript
interface Props {
  navigationItems: NavigationItem[]
  userName?: string
  isOpen?: boolean
}

const emit = defineEmits<{
  'sidebar-state-change': [{ isDesktop: boolean; isOpen: boolean; isDesktopRailCollapsed: boolean }]
  'navigate': [path: string]
  'logout': []
  'open-search': []
}>()
```

---

## Resumen: Cuándo Usar Cada Patrón

| Patrón | Complejidad | Sidebar | Header | GlobalSearch |
|--------|-------------|---------|--------|--------------|
| 1 — Rail Collapse | Alta | Autónomo con provide/inject | En el propio sidebar | ✅ Sí |
| 2 — Emit Open | Media | Emite boolean | Componente separado opcional | ❌ No |
| 3 — Margin Estático | Baja | Completamente autónomo | No | ❌ No |
| 4 — Props-driven | Media-Alta | Sin lógica propia | En header mobile | Inline en layout |

## Reglas Comunes a Todos los Patrones

- `content` SIEMPRE tiene `pt-20` (para el header/navbar fijo de 80px)
- Margen de contenido en desktop: `ml-12` (rail) o `ml-60` (expandido)
- Sidebar siempre `fixed`, `z-50`, `h-screen`
- Transiciones en `content`: `transition-[margin-left] duration-500` o `duration-700`
- Dark mode obligatorio: `bg-gray-50 dark:bg-gray-800` en content
- Mobile: sidebar como drawer (`-translate-x-full` → `translate-x-0`)
