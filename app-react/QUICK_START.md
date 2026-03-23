# Guía de Inicio Rápido

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar en desarrollo
npm run dev
```

## Estructura del Proyecto

- **src/components/** - Componentes reutilizables (Header, Footer, Forms, etc)
- **src/pages/** - Páginas/Vistas de la aplicación
- **src/services/** - Servicios de API
- **src/hooks/** - Custom hooks (useCrud, useForm, useApi)
- **src/utils/** - Utilidades (validators, formatters, constants)
- **.github/skills/** - Skills de Copilot para generación de código
- **.github/prompts/** - Prompts para usar con Copilot

## Usando Copilot para Generar Código

### 4 Opciones para Usar Prompts

El template incluye **8 prompts especializados** disponibles en múltiples formatos:

#### 🔥 Opción 1: Archivos Prompts (.md) - Recomendado

Archivos Markdown con YAML frontmatter (consistente con api-dotnet):

```
.github/prompts/
├── A.-CreateComponent.prompt.md      # Crear componentes
├── B.-CreateApiService.prompt.md     # Crear servicios API
├── C.-CreateDataGrid.prompt.md       # Crear tablas avanzadas
├── D.-CreateCustomHook.prompt.md     # Crear custom hooks
├── E.-CreateLayout.prompt.md         # Crear layouts
├── F.-CreatePage.prompt.md           # Crear páginas completas
├── G.-CreateValidator.prompt.md      # Crear validadores Zod
└── H.-CreateForm.prompt.md           # Crear formularios
```

**Cómo usarlos:**
1. Abre uno de los archivos `.prompt.md`
2. Lee el **Role**, **Goal** y requisitos
3. Copia el contenido y pégalo en Copilot Chat
4. Especifica qué necesitas generar

**Ejemplo:**
```
Abre: .github/prompts/A.-CreateComponent.prompt.md
Dile a Copilot: "Según este prompt, crea un componente Button con 
variantes primary, secondary y danger, size sm/md/lg"
```

#### 🎯 Opción 2: Menú Interactivo - Para Exploración

Para una experiencia de navegación interactiva:

```bash
node .github/prompts/prompts.js
```

Características:
- Menú categorizado por tipo
- Ver descripción de cada prompt
- Copiar prompts al portapapeles
- Explorar flujos completos

#### 🚀 Opción 3: Skills en Copilot Chat - Para Expertos

Si tienes Copilot Chat abierto, usa comandos directos:

```
@copilot /fe-create-component Button type:ui props:"label, onClick, disabled"
@copilot /fe-create-api-service productService entity:Product
@copilot /fe-create-datagrid ProductGrid entity:Product columns:"name,price,stock"
@copilot /fe-create-hooks useProduct type:crud entity:Product
@copilot /fe-create-layout BackofficeLayout
@copilot /fe-create-page ProductList
@copilot /fe-create-validator ProductValidator
@copilot /fe-create-form ProductForm
```

#### 📚 Opción 4: Skills Documentation - Para Referencia

Guías completas con patrones, ejemplos y mejores prácticas:

| Skill | Documentación |
|-------|--------------|
| Component | `.github/skills/fe-create-component.md` |
| API Service | `.github/skills/fe-create-api-service.md` |
| DataGrid | `.github/skills/fe-create-datagrid.md` |
| Custom Hook | `.github/skills/fe-create-hooks.md` |

---

## Flujo de Trabajo Recomendado: CRUD Completo

### Escenario: Crear CRUD de Productos

#### Paso 1: Crear Servicio de API

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/B.-CreateApiService.prompt.md
# Leer Role y Goal
# En Copilot Chat: "Según este prompt, crea un servicio ProductService 
# para la entidad Product con métodos CRUD y búsqueda"
```

**Opción B (Menú):**
```bash
node .github/prompts/prompts.js
# → Seleccionar Services
# → B.-CreateApiService
# → Copiar
```

**Opción C (Skill directo):**
```
@copilot /fe-create-api-service productService entity:Product endpoints:"search,getByCategory"
```

#### Paso 2: Crear Custom Hook

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/D.-CreateCustomHook.prompt.md
# En Copilot: "Crea un hook useProduct type:crud entity:Product service:productService"
```

**Opción B (Menú):**
```bash
node .github/prompts/prompts.js
# → Seleccionar Hooks
# → D.-CreateCustomHook
```

**Opción C (Skill):**
```
@copilot /fe-create-hooks useProduct type:crud entity:Product
```

#### Paso 3: Crear Validadores

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/G.-CreateValidator.prompt.md
```

**Opción C (Skill):**
```
@copilot /fe-create-validator ProductValidator
```

#### Paso 4: Crear Formulario

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/H.-CreateForm.prompt.md
```

**Opción C (Skill):**
```
@copilot /fe-create-form ProductForm
```

#### Paso 5: Crear Tabla/DataGrid

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/C.-CreateDataGrid.prompt.md
```

**Opción C (Skill):**
```
@copilot /fe-create-datagrid ProductDataGrid entity:Product columns:"name,price,stock"
```

#### Paso 6: Crear Página

**Opción A (Archivo .md):**
```bash
# Abrir: .github/prompts/F.-CreatePage.prompt.md
```

**Opción C (Skill):**
```
@copilot /fe-create-page ProductList
```

## Estándares de Código

- **TypeScript** - Tipos explícitos requeridos
- **React Hooks** - Componentes funcionales siempre
- **Tailwind CSS** - Para estilos
- **WCAG 2.1** - Accesibilidad
- **Responsive Design** - Mobile first

## Componentes Base Incluidos

### Header
```tsx
import { Header } from '@/components';

<Header 
  logo="Logo"
  title="Mi App"
  user={{ name: 'Juan', avatar: '...' }}
  onLogout={() => logout()}
  navItems={[...]}
/>
```

### Footer
```tsx
import { Footer } from '@/components';

<Footer 
  type="frontoffice"
  company={{ name: 'Mi Empresa' }}
  links={[...]}
/>
```

### Button
```tsx
import { Button } from '@/components';

<Button 
  label="Guardar"
  onClick={handleSave}
  variant="primary"
  size="md"
/>
```

### Modal
```tsx
import { Modal } from '@/components';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar"
>
  Contenido...
</Modal>
```

## Hooks Personalizados

### useCrud
```tsx
const { items, loading, create, update, delete: deleteItem } = useCrud(service);
```

### useForm
```tsx
const { values, errors, handleSubmit } = useForm(initialValues, validate);
```

### useApi
```tsx
const { data, loading, error, refetch } = useApi(fetchFn, dependencies);
```

## Servicios

### Cliente HTTP
```tsx
import apiClient from '@/services/api';

const data = await apiClient.get('/endpoint');
const result = await apiClient.post('/endpoint', { data });
```

### Servicio Producto
```tsx
import { productService } from '@/services';

const products = await productService.getAll();
const product = await productService.create({ name: '...' });
```

## Utilidades

### Validadores
```tsx
import { validators } from '@/utils';

validators.email('test@example.com');
validators.required('value');
validators.minLength('value', 5);
```

### Formateadores
```tsx
import { formatters } from '@/utils';

formatters.currency(100);
formatters.date(new Date());
formatters.truncate('Texto largo', 50);
```

## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mi Aplicación
VITE_APP_VERSION=1.0.0
```

## Recursos Útiles

- [AGENTS.md](./AGENTS.md) - Guía de arquitectura
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Estándares
- [README.md](./README.md) - Documentación completa
- [.github/skills/](https://github.com) - Skills de Copilot

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Tests
npm run test

# Lint
npm run lint

# Format
npm run format

# Ejecutar prompts interactivos
node .github/prompts/prompts.js
```

## Tips

1. Lee AGENTS.md para entender la arquitectura
2. Revisa .github/copilot-instructions.md antes de empezar
3. Usa los skills de Copilot para acelerar desarrollo
4. Mantén los componentes pequeños y focalizados
5. Extrae lógica a hooks cuando sea necesario
6. Valida datos en servicios, no en componentes

¡Feliz codificación! 🚀
