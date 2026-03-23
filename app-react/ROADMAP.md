# Plan de Extensión Inmediata - App React Template

**Propósito**: Roadmap paso a paso para llevar el template a "Production Ready" para versión inicial

---

## 📋 Priorización por Tipo de Proyecto

### 1. SISTEMA CRUD / ADMIN DASHBOARD

**Prioridad**: Critical → Essential → Nice-to-have

```
CRÍTICO (Hacer PRIMERO):
□ 1. Input, Select, Textarea components    (1 hora)
□ 2. DataGrid component                     (2 horas)
□ 3. Create/Edit/Delete pages               (4 horas)
□ 4. Form validation real                   (2 horas)

ESSENTIAL (Después crítico):
□ 5. Error handling + toast notifications   (2 horas)
□ 6. Loading skeletons/spinners             (1 hora)
□ 7. Pagination hook                        (1 hora)
□ 8. Filtrado avanzado                      (3 horas)

NICE-TO-HAVE (Si tiempo):
□ 9. Bulk actions (select multiple)         (2 horas)
□ 10. Export CSV                            (1 hora)
□ 11. Search avanzada                       (2 horas)
□ 12. Audit log / activity history          (3 horas)

TIEMPO TOTAL: 2-3 semanas
```

### 2. SISTEMA CON AUTENTICACIÓN

**Prioridad**: Critical → Essential → Nice-to-have

```
CRÍTICO (Hacer PRIMERO):
□ 1. Create Auth context + useAuth hook     (3 horas)
□ 2. Login page component                   (2 horas)
□ 3. Protected routes wrapper               (1 hora)
□ 4. Logout functionality                   (1 hora)
□ 5. Session persistence                    (1 hora)

ESSENTIAL (Después crítico):
□ 6. Signup/Register page                   (2 horas)
□ 7. Forgot password flow                   (3 horas)
□ 8. Role-based access control (RBAC)       (3 horas)
□ 9. Permission checks in UI                (2 horas)

NICE-TO-HAVE (Si tiempo):
□ 10. Two-factor authentication             (4 horas)
□ 11. OAuth integration                     (4 horas)
□ 12. Session timeout warning               (1 hora)

TIEMPO TOTAL: 3-4 semanas
```

### 3. SISTEMA CON ANÁLISIS/REPORTES

**Prioridad**: Critical → Essential → Nice-to-have

```
CRÍTICO (Hacer PRIMERO):
□ 1. Charts/Gráficos library integration    (2 horas)
□ 2. DataGrid avanzada (sorting, grouping)  (3 horas)
□ 3. Date range selector component          (1 hora)
□ 4. Export reportes (PDF, Excel)           (3 horas)

ESSENTIAL (Después crítico):
□ 5. Filters + saved views                  (3 horas)
□ 6. Drill-down analytics                   (3 horas)
□ 7. Custom metrics/KPIs                    (2 horas)
□ 8. Dashboard configurable                 (2 horas)

NICE-TO-HAVE (Si tiempo):
□ 9. Real-time data updates                 (3 horas)
□ 10. Scheduled report emails               (4 horas)
□ 11. API data webhooks                     (3 horas)

TIEMPO TOTAL: 3-4 semanas
```

---

## 🛠️ PASO A PASO: LO PRIMERO A HACER

### Paso 0: Setup Inicial (1-2 horas)

```bash
# 1. Crear nuevo proyecto con Vite
npm create vite@latest my-app -- --template react
cd my-app

# 2. Instalar dependencias base
npm install axios zod react-router-dom react-hot-toast

# 3. Instalar dev dependencies
npm install -D typescript @types/react @types/node \
  tailwindcss postcss autoprefixer

# 4. Setup Tailwind
npx tailwindcss init -p

# 5. Copiar template
cp -r /path/to/bmlabs-template/app-react/src .
cp -r /path/to/bmlabs-template/app-react/.github .
cp /path/to/bmlabs-template/app-react/*.md .

# 6. Crear .env
echo 'VITE_API_BASE_URL=http://localhost:5000/api' > .env.local

# 7. Verificar build
npm run dev
```

---

### Paso 1: Crear INPUT/SELECT/TEXTAREA (1-1.5 horas)

**Usar Prompt H** OR **Copilot directo**:

```bash
# Opción A: Usar prompt file
# Abrir: .github/prompts/H.-CreateForm.prompt.md
# En Copilot Chat: "Según este prompt, crea Input, Select, Textarea"

# Opción B: Comando directo
@copilot /fe-create-form Input type:ui props:"type,placeholder,value,onChange,error"
@copilot /fe-create-form Select type:ui props:"options,value,onChange,placeholder,error"
@copilot /fe-create-form Textarea type:ui props:"placeholder,value,onChange,rows,error"
```

**Estructura esperada**:

```typescript
// src/components/forms/Input.tsx
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  aria-label?: string;
}

export const Input: React.FC<InputProps> = ({ /* ... */ })

// src/components/forms/Select.tsx
export interface SelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ /* ... */ })

// src/components/forms/Textarea.tsx
export interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  disabled?: boolean;
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ /* ... */ })
```

**Checklist**:
- ✅ Propiedades tipadas
- ✅ ARIA labels
- ✅ Error message display
- ✅ Disabled state
- ✅ Tailwind styling
- ✅ Focus indicators
- ✅ Barrel export en components/index.ts

---

### Paso 2: Crear DATAGRID (2-2.5 horas)

**Usar Prompt C** OR **Copilot directo**:

```bash
@copilot /fe-create-datagrid DataGrid props:"columns,data,loading,onEdit,onDelete"
```

**Estructura esperada**:

```typescript
// src/components/tables/DataGrid.tsx
export interface Column<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
  render?: (value: unknown, record: T) => React.ReactNode;
  width?: string;
}

export interface DataGridProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (id: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  searchText?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string, order: 'asc' | 'desc') => void;
}

export const DataGrid: React.FC<DataGridProps> = ({ /* ... */ })
```

**Features**:
- ✅ Column definitions
- ✅ Sorting
- ✅ Paginación
- ✅ Loading state
- ✅ Row actions (edit, delete)
- ✅ Responsive horizontal scroll
- ✅ ARIA roles

---

### Paso 3: Setup Routing (30 minutos)

**Crear App.tsx**:

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages';
import { ProductList } from '@/pages';
import { Layout } from '@/components';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/products" element={<Layout><ProductList /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

**Crear main.tsx**:

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### Paso 4: Setup Error Handling (1.5 horas)

**A. Crear globales toast/notification**:

```bash
npm install sonner  # or react-hot-toast (ya en template)
```

**B. Crear ErrorBoundary**:

```bash
@copilot /fe-create-component ErrorBoundary type:feature
```

**C. Update servicios con notifications**:

```typescript
// En src/services/api.ts
import { toast } from 'sonner'; // or react-hot-toast

this.instance.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      toast.error('Sesión expirada. Por favor inicia sesión.');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else {
      toast.error('Error en la solicitud');
    }
    return Promise.reject(error);
  }
);
```

---

### Paso 5: Crear Páginas CRUD (3-4 horas)

**Para cada entidad (Products/Users/Orders):**

```typescript
// src/pages/Products/ProductList.tsx
export const ProductList: React.FC = () => {
  const { items, loading, delete: deleteProduct, readAll } = useCrud(productService);

  useEffect(() => {
    readAll();
  }, [readAll]);

  return (
    <div>
      <h1>Products</h1>
      <Button onClick={() => navigate('/productos/crear')} label="New Product" />
      <DataGrid
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Price', accessor: 'price' },
          { header: 'Stock', accessor: 'stock' },
        ]}
        data={items}
        onEdit={(product) => navigate(`/products/${product.id}/edit`)}
        onDelete={(id) => deleteProduct(id)}
      />
    </div>
  );
};

// src/pages/Products/ProductForm.tsx
export const ProductForm: React.FC = () => {
  const { id } = useParams();
  const { values, errors, handleSubmit } = useForm(
    { name: '', price: 0, stock: 0 },
    validate
  );

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        error={errors.name}
      />
      {/* Más campos */}
    </form>
  );
};
```

---

## 🔐 IMPLEMENTAR AUTENTICACIÓN (TODO JUNTO)

Si requieres autenticación, hacer en este orden:

### 1. Crear Auth Context + Hook (2 horas)

```bash
@copilot /fe-create-hook useAuth type:context
```

**Estructura**:

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: Error | null;
}

export const useAuth = (): AuthContextType => {
  // Implementation
};

// src/providers/AuthProvider.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Crear Login Page (1 hora)

```bash
@copilot /fe-create-page LoginPage
```

### 3. Crear Protected Routes (30 min)

```typescript
// src/components/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

### 4. Update App.tsx con rutas protegidas

```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Layout><Home /></Layout>
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## ✅ TESTING BÁSICO (OPCIONAL pero RECOMENDADO)

Si vas a producción:

```bash
└── # Setup Vitest + React Testing Library (3-4 horas)

npm install -D vitest @testing-library/react @testing-library/jest-dom

# Crear vitest.config.ts
# Crear tests para:
#   - useApi hook
#   - Button component
#   - Input component
#   - ProductService
```

---

## 📊 GANTT CHART: TIMELINE

```
Semana 1:
│ Day 1-2: Setup + Paso 0-1 ████░░░░░
│ Day 3-4: Paso 2-3 (DataGrid, Routing) ████░░░░░
│ Day 5:   Paso 4-5 (Error handling, CRUD) ████░░░░░

Semana 2:
│ Day 6-7: Complete CRUD pages ████░░░░░
│ Day 8-9: Testing + Refinement ████░░░░░
│ Day 10:  Buffer + Fixes ███░░░░░░

IF WITH AUTH (Add 1 week):
│ Day 11-12: Auth context + Login ████░░░░░
│ Day 13-14: Protected routes + Signup ████░░░░░
│ Day 15:    Testing + Integration ███░░░░░░

Timeline: 2-3 weeks MVP
```

---

## 🎯 CHECKLIST FINAL ANTES DE "PRODUCTION"

### Code Quality
- ✅ TypeScript estricto (no `any`)
- ✅ Todos los componentes tipados
- ✅ Error handling en todas las operaciones
- ✅ Validación de inputs
- ✅ Loading states
- ✅ JSDoc comments en funciones públicas

### Accesibilidad
- ✅ ARIA labels en inputs
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Color contrast
- ✅ Focus indicators
- ✅ Form labels associated

### Performance
- ✅ React.memo en componentes puros
- ✅ useCallback para funciones
- ✅ useMemo para datos pesados
- ✅ Lazy loading de páginas
- ✅ Image optimization

### Security
- ✅ No secrets en código
- ✅ HTTPS only en prod
- ✅ Token en httpOnly cookie (idealmente)
- ✅ CSRF protection
- ✅ Input validation + sanitization
- ✅ XSS prevention (React default)

### Testing
- ✅ Unit tests hooks
- ✅ Component tests UI critical
- ✅ Integration tests flujos
- ✅ E2E tests si crítico

### Documentation
- ✅ README.md actualizado
- ✅ .env.example
- ✅ CONTRIBUTING.md
- ✅ API documentation
- ✅ Component storybook (opcional)

---

## 🚀 SCRIPTS ÚTILES

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 📚 RECURSOS

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/docs/intro)
- [React Router Docs](https://reactrouter.com)
- [Zod Docs](https://zod.dev)

---

*Este roadmap es un guía flexible. Ajusta según complejidad real de tu proyecto.*
