# App React Template

## Descripción

Este es un template para la construcción de aplicaciones frontend modernas, escalables y accesibles usando React. El proyecto está diseñado como una guía y base para futuros proyectos, implementando mejores prácticas de arquitectura, UX/UI, rendimiento y mantenibilidad.

## Finalidad

- **Template base**: Punto de partida para nuevos proyectos de aplicaciones React
- **Guía de arquitectura**: Implementa patrones y principios consolidados para frontend
- **Rapidez de desarrollo**: Componentes preconfigurados y skills de Copilot que aceleran desarrollo
- **Mantenibilidad**: Código organizado, componentes reutilizables y separación clara de responsabilidades
- **Escalabilidad**: Arquitectura preparada para crecer con el proyecto
- **Accesibilidad**: Componentes y prácticas que cumplen con estándares WCAG 2.1

## Características Principales

### 🎨 Componentes Reutilizables
- **DataGrid**: Tabla de datos con paginación, búsqueda, ordenamiento y acciones
- **Header**: Navbar con navegación, autenticación y responsividad
- **Footer**: Pie de página configurable para backoffice y frontoffice
- **Forms**: Componentes de formularios con validación
- **Modales**: Diálogos reutilizables
- **Layouts**: BackofficeLayout y FrontofficeLayout

### 🔗 Integración API
- **Servicio API**: Cliente HTTP configurado para conectar con APIs backend
- **CRUD Hooks**: Hooks personalizados para operaciones CRUD
- **Manejo de estados**: Gestión de datos y errores
- **Interceptadores**: Manejo automático de tokens y reintentos

### 🎯 Mejores Prácticas
- TypeScript para seguridad de tipos
- Arquitectura por capas (componentes, páginas, servicios)
- Validación de formularios con Zod
- Sistema de temas (light/dark mode)
- Responsive design con Tailwind CSS
- Accesibilidad WCAG 2.1
- Lazy loading y code splitting

---

## Desarrollo Asistido con GitHub Copilot

### 📋 Archivos de Configuración

#### **AGENTS.md**
- **Ubicación**: `/AGENTS.md` (raíz del proyecto)
- **Propósito**: Define reglas globales y arquitectura del proyecto para Copilot
- **Contenido**: Principios, estructura de capas, responsabilidades y restricciones
- **Uso**: Copilot automáticamente lee estas reglas al generar código

#### **copilot-instructions.md** 
- **Ubicación**: `/.github/copilot-instructions.md`
- **Propósito**: Instrucciones técnicas específicas para generación de componentes
- **Contenido**: Estándares React, patrones de componentes, convenciones de código
- **Enfoque**: Accesibilidad, rendimiento, mantenibilidad y estándares UX/UI

### 🤖 Prompts - 4 Formas de Usarlos

El template incluye **8 prompts especializados** en múltiples formatos:

#### 🔥 Opción 1: Archivos Prompts (.md) - Recomendado
Archivos Markdown con YAML frontmatter (consistente con api-dotnet):

```
.github/prompts/
├── A.-CreateComponent.prompt.md      # Crear componentes React
├── B.-CreateApiService.prompt.md     # Crear servicios API CRUD
├── C.-CreateDataGrid.prompt.md       # Crear tablas avanzadas
├── D.-CreateCustomHook.prompt.md     # Crear custom hooks
├── E.-CreateLayout.prompt.md         # Crear layouts completos
├── F.-CreatePage.prompt.md           # Crear páginas integradas
├── G.-CreateValidator.prompt.md      # Crear validadores Zod
└── H.-CreateForm.prompt.md           # Crear formularios
```

**Cómo usarlos:**
1. Abre el archivo `.prompt.md` correspondiente
2. Lee el Role, Goal y requisitos
3. Copia el contenido y pégalo en Copilot Chat
4. Especifica qué necesitas generar

#### 🎯 Opción 2: Menú Interactivo
Para exploración interactiva:

```bash
node .github/prompts/prompts.js
```

Características:
- Menú categorizado
- Ver detalles de prompts
- Copiar a portapapeles
- Flujos completos

#### 🚀 Opción 3: Skills en Chat
Comandos directos en Copilot Chat:

```
@copilot /fe-create-component Button type:ui props:"label, onClick"
@copilot /fe-create-api-service productService entity:Product
@copilot /fe-create-datagrid ProductGrid entity:Product
@copilot /fe-create-hooks useProduct type:crud
@copilot /fe-create-layout BackofficeLayout
@copilot /fe-create-page ProductList
@copilot /fe-create-validator ProductValidator
@copilot /fe-create-form ProductForm
```

#### 📚 Opción 4: Skills Documentation
Guías con patrones y ejemplos:

| Recurso | Descripción |
|---------|-------------|
| `.github/skills/fe-create-component.md` | Componentes React |
| `.github/skills/fe-create-api-service.md` | Servicios API |
| `.github/skills/fe-create-datagrid.md` | Tablas avanzadas |
| `.github/skills/fe-create-hooks.md` | Custom hooks |

### Skills Disponibles

| Prompt | Descripción |
|--------|-------------|
| `A.-CreateComponent` | Generar componentes React funcionales |
| `B.-CreateApiService` | Crear servicios API CRUD |
| `C.-CreateDataGrid` | Tablas con búsqueda y filtrado |
| `D.-CreateCustomHook` | Custom hooks reutilizables |
| `E.-CreateLayout` | Layouts para diferentes estructuras |
| `F.-CreatePage` | Páginas completas integradas |
| `G.-CreateValidator` | Validadores con Zod |
| `H.-CreateForm` | Formularios con validación |

---

## Estructura del Proyecto

```
app-react/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── common/          # Componentes genéricos (Header, Footer)
│   │   ├── layout/          # Layouts (Backoffice, Frontoffice)
│   │   ├── forms/           # Componentes de formularios
│   │   ├── tables/          # Componentes de tablas
│   │   └── ui/              # UI básicos (Button, Input, Modal)
│   ├── pages/               # Páginas/Vistas
│   │   ├── backoffice/      # Páginas de administración
│   │   ├── frontoffice/     # Páginas públicas
│   │   └── auth/            # Páginas de autenticación
│   ├── services/            # Servicios de API
│   │   ├── api.ts           # Cliente HTTP
│   │   └── [entity]Service.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useCrud.ts       # Hook para operaciones CRUD
│   │   ├── useForm.ts       # Hook para formularios
│   │   └── useApi.ts        # Hook para peticiones HTTP
│   ├── utils/               # Utilidades
│   │   ├── validators.ts    # Validadores
│   │   ├── formatters.ts    # Formateadores
│   │   └── constants.ts     # Constantes
│   └── styles/              # Estilos globales
├── .github/
│   ├── copilot-instructions.md
│   ├── prompts/             # Archivos prompts .md
│   │   ├── A.-CreateComponent.prompt.md
│   │   ├── B.-CreateApiService.prompt.md
│   │   ├── ... (6 más)
│   │   └── prompts.js       # Menú interactivo
│   └── skills/              # Documentación de skills
│       ├── fe-create-component.md
│       ├── fe-create-api-service.md
│       ├── fe-create-datagrid.md
│       └── fe-create-hooks.md
├── AGENTS.md               # Guía de proyecto
├── QUICK_START.md          # Inicio rápido
└── README.md               # Este archivo
```

## Componentes Base Incluidos

### DataGrid (Tabla de Datos)
Características completas de tabla de datos para backoffice:
- Paginación configurable
- Búsqueda en tiempo real
- Ordenamiento por columnas
- Selección múltiple de filas
- Acciones (editar, eliminar, detalle)
- Exportación a CSV/Excel
- Responsive y accesible

### Header (Navbar)
Componente de navegación superior con:
- Logo y branding
- Menú de navegación responsive
- Notificaciones
- Perfil de usuario
- Cambio de tema (light/dark)

### Footer (Pie de Página)
Pie de página configurable con:
- Información de la empresa
- Enlaces útiles
- Redes sociales
- Copyright
- Información de contacto

## Instalación

```bash
# Clonar o descargar el template
cd app-react

# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env.local

# Iniciar desarrollo
npm run dev

# Build producción
npm run build
```

## Dependencias Principales

- **React 18+**: Librería UI
- **TypeScript**: Seguridad de tipos
- **Vite**: Build tool moderno
- **Tailwind CSS**: Utilidades de estilos
- **React Router**: Enrutamiento
- **Zod**: Validación de esquemas
- **Axios**: Cliente HTTP
- **React Hot Toast**: Notificaciones

## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mi Aplicación
VITE_APP_VERSION=1.0.0
```

## Estándares de Código

- **Componentes funcionales** con hooks
- **TypeScript** para todos los archivos
- **Props tipadas** con interfaces
- **Naming**: camelCase para variables/funciones, PascalCase para componentes
- **Accesibilidad**: ARIA labels, semantic HTML, keyboard navigation
- **SoC**: Separación de preocupaciones

## Testing

```bash
# Tests unitarios con Vitest
npm run test

# Coverage
npm run test:coverage

# E2E con Playwright
npm run test:e2e
```

## Performance

- Code splitting automático con React.lazy
- Lazy loading de imágenes
- Optimización de renders con React.memo
- Virtual scrolling para listas grandes

## Accesibilidad

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels y roles
- Keyboard navigation
- Screen reader support

## Próximos Pasos

1. Lee [AGENTS.md](./AGENTS.md) para entender la arquitectura
2. Revisa [QUICK_START.md](./QUICK_START.md) para inicio rápido
3. Explora `.github/prompts/` para ver todos los prompts
4. Lee `.github/copilot-instructions.md` para estándares
5. Ejecuta `node .github/prompts/prompts.js` para ver el menú
6. Usa los prompts con Copilot para generar código

## Contribución

Seguir [CONTRIBUTIONS.md](../CONTRIBUTIONS.md) para crear pull requests y contribuir mejoras.

## Licencia

BMS Labs - Projectos Templates