# Referencia: Componentes Reutilizables Observados en Proyectos Productivos

## Objetivo
Documentar componentes compartidos repetidos en proyectos productivos de BM para acelerar adopción en nuevos templates sin imponer dependencias inexistentes.

## Fuentes consideradas (anonimizadas)
- Proyecto backoffice tipo A (sidebar avanzado con rail + flyout + búsqueda global)
- Proyecto backoffice tipo B (sidebar con emit open, sin búsqueda)
- Proyecto móvil (sidebar estático, minimal)
- Template base BM (sidebar props-driven)

## Componentes detectados (candidatos)

### Core CRUD / Formularios
- `BackButton.vue`: navegación de retorno consistente.
- `FormActions.vue`: acciones de formulario (guardar/cancelar).
- `ListHeader.vue`: encabezado de listados con slots de acciones.
- `RequiredFieldsLegend.vue`: leyenda de campos obligatorios.

### Data / Tabla / Acciones
- `IconActions.vue`: acciones compactas por fila (editar/eliminar/ver/exportar).
- `ColumnSelectorModal.vue`: selección dinámica de columnas.
- `Filter.vue` y `Paginator.vue`: presentes en más de un proyecto.

### Modales y flujos auxiliares
- `BulkImportModal.vue`: importación masiva.
- `DocumentViewerModal.vue`: visualización de documentos.
- `ConfirmModal.vue`: confirmación de acciones críticas.
- `ToastNotification.vue`: feedback no bloqueante.

### Navegación y layout
- `TabNavigation.vue`: navegación por tabs dentro de vista.
- `PageHeader.vue`: encabezado de vistas.

---

## Patrones de Sidebar Observados

### Variante 1 — Sidebar Autónomo con Rail Collapse
El sidebar maneja su propio estado interno y emite `sidebar-state-change` al layout.
- Estado: `isOpen`, `isDesktopRailCollapsed`, `isDesktop` (interno)
- Emits: `sidebar-state-change`, `open-search`
- Usa `provide/inject` para comunicar rail mode a `AppSidebarNav`
- Tiene `SidebarNavFlyout` para grupos en rail mode (flyout posicionado por `getBoundingClientRect`)
- Estructura: `<div>` header bar (fixed) + `<aside>` sidebar (fixed)

### Variante 2 — Sidebar Emisor Simple
El sidebar solo emite si está abierto o cerrado. El layout calcula el margen.
- Emits: `update:open` (boolean)
- Sin lógica de rail; dos estados: cerrado (`ml-[48px]`) / abierto (`ml-60`)
- Más simple, sin flyout ni global search

### Variante 3 — Sidebar Props-Driven (template base estándar)
El layout pasa toda la configuración via props; el sidebar no tiene lógica propia.
- Props: `navigationItems`, `userName`, `isOpen`
- Emits: `sidebar-state-change`, `navigate`, `logout`, `open-search`
- Ideal para templates nuevos: máxima separación de responsabilidades

### `NavigationItem` — tipo compartido entre variantes
```typescript
interface NavigationItem {
  id: string       // kebab-case, usado para testing
  label: string    // texto visible
  path: string     // ruta con slash inicial
  icon: Component  // Lucide icon component
  children?: NavigationItem[]  // grupos con subitems
}
```

---

## Regla de adopción en el template
1. Si el componente ya existe en `src/components/shared/`, reutilizarlo.
2. Si no existe, tratarlo como **opcional** y no bloquear generación.
3. Si la funcionalidad es requerida por el módulo, generarlo vía prompt de componente (`A`) manteniendo contrato TS estricto y dark mode.
4. No marcar componentes opcionales como obligatorios en prompts base.

## Recomendación para prompts/skills
- Priorizar componentes base obligatorios del template.
- Referenciar esta lista para mejoras incrementales cuando el proyecto destino ya tenga esos componentes.
- Para layout: ver `vue-master-crud-standard/references/LAYOUT_PATTERNS.md` para los 4 patrones de distribución.
- Para auth: ver `vue-create-auth-forms/references/REAL_AUTH.md` para los 4 patrones de autenticación.