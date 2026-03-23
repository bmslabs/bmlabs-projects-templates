# Instrucciones GitHub Copilot - App React

Este archivo contiene instrucciones técnicas específicas para el desarrollo de código frontend con React usando GitHub Copilot. Copilot lee automáticamente este archivo para seguir las convenciones y mejores prácticas del proyecto.

## Estándares Generales

### TypeScript Requerido

- Todos los archivos `.ts` y `.tsx` deben usar TypeScript estricto
- Todas las variables, parámetros y valores de retorno deben estar tipadas
- No usar `any`, usar `unknown` o tipos específicos
- Importar tipos con `import type { Type }`

### Estructura de Componentes

```typescript
// Interfaces de props al inicio
interface ProductFormProps {
  productId?: string;
  onSuccess?: (product: Product) => void;
  onError?: (error: Error) => void;
}

// Componente funcional con typed props
export const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSuccess,
  onError,
}) => {
  // Implementación
};

export default ProductForm;
```

### Imports

- Imports de React al inicio
- Imports de librerías externas
- Imports de componentes locales
- `import type { Type }` para tipos
- Usar barrel exports cuando sea apropiado (index.ts)

### Componentes Funcionales

- Usar arrow functions o function declarations
- Props siempre tipadas con interfaces
- Usar React.FC<Props> o signature explícita
- Mantener componentes puros y sin efectos secundarios innecesarios
- Exportar como named export + default

## Hooks Personalizados

### Estructura Base de Custom Hook

```typescript
interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  };

  return { products, loading, error, refetch };
};
```

### Hook useCrud Genérico

Cuando se necesite CRUD básico, usar el patrón:

```typescript
interface UseCrudResult<T> {
  items: T[];
  item: T | null;
  loading: boolean;
  error: Error | null;
  create: (data: T) => Promise<void>;
  read: (id: string) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  reset: () => void;
}

export const useCrud = <T extends { id: string }>(
  service: CrudService<T>
): UseCrudResult<T> => {
  // Implementación
};
```

## Servicios de API

### Cliente HTTP Base

```typescript
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de request para auth
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor de error
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Manejar logout
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string) {
    return this.instance.get<T>(url);
  }

  post<T>(url: string, data: unknown) {
    return this.instance.post<T>(url, data);
  }

  put<T>(url: string, data: unknown) {
    return this.instance.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.instance.delete<T>(url);
  }
}

const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);
export default apiClient;
```

### Servicio de Entidad CRUD

```typescript
import apiClient from './api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
}

class ProductService {
  private baseUrl = '/products';

  async getAll(params?: Record<string, unknown>) {
    return apiClient.get<Product[]>(this.baseUrl, { params });
  }

  async getById(id: string) {
    return apiClient.get<Product>(`${this.baseUrl}/${id}`);
  }

  async create(data: Omit<Product, 'id' | 'createdAt'>) {
    return apiClient.post<Product>(this.baseUrl, data);
  }

  async update(id: string, data: Partial<Product>) {
    return apiClient.put<Product>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string) {
    return apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const productService = new ProductService();
```

## Validación con Zod

### Esquemas de Validación

```typescript
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  category: z.enum(['ELECTRONICS', 'CLOTHING', 'FOOD']),
  inStock: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// Parser con mensajes personalizados
export const parseProduct = (data: unknown): Product => {
  try {
    return ProductSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};
```

## Componentes Específicos

### DataGrid / Tabla de Datos

```typescript
interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
}

interface DataGridState<T> {
  sortBy: keyof T | null;
  sortOrder: 'asc' | 'desc';
  page: number;
  searchTerm: string;
}
```

### Forms

```typescript
interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  pattern?: string;
  validate?: (value: unknown) => boolean | string;
}

interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}
```

### Header/Navbar

```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  user?: { name: string; avatar?: string };
  onLogout?: () => void;
  theme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  navItems?: Array<{ label: string; href: string; icon?: React.ReactNode }>;
}
```

### Footer

```typescript
interface FooterProps {
  type: 'backoffice' | 'frontoffice';
  company?: {
    name: string;
    description?: string;
  };
  links?: Array<{ label: string; href: string }>;
  socials?: Array<{ name: string; url: string; icon: React.ReactNode }>;
  copyright?: string;
}
```

## Ejemplo de Flow Completo

### 1. Service (productService.ts)

```typescript
// Estructura y métodos CRUD completos
class ProductService {
  async getAll(filters?: ProductFilters): Promise<Product[]> { }
  async getById(id: string): Promise<Product> { }
  async create(data: CreateProductDTO): Promise<Product> { }
  async update(id: string, data: UpdateProductDTO): Promise<Product> { }
  async delete(id: string): Promise<void> { }
}
```

### 2. Hook (useProducts.ts)

```typescript
// Lógica reutilizable del componente
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // ... métodos CRUD
};
```

### 3. Form Component (ProductForm.tsx)

```typescript
// Componente reutilizable de formulario
export const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { register, handleSubmit, errors } = useForm();
  // ...
};
```

### 4. DataGrid Component (ProductGrid.tsx)

```typescript
// Tabla reutilizable
export const ProductGrid: React.FC<ProductGridProps> = (props) => {
  // Render table with columns
};
```

### 5. Page (ProductList.tsx)

```typescript
// Integra form + grid + hooks + layout
export const ProductList: React.FC = () => {
  const { products, loading } = useProducts();
  return (
    <BackofficeLayout>
      <ProductGrid data={products} />
    </BackofficeLayout>
  );
};
```

## Accesibilidad (WCAG 2.1)

### Semantic HTML

```typescript
// ✅ Correcto
<button onClick={handleClick}>Guardar</button>
<nav><ul><li><a href="/">Home</a></li></ul></nav>
<main><h1>Título</h1></main>

// ❌ Incorrecto
<div onClick={handleClick}>Guardar</div>
<div><span><a href="/">Home</a></span></div>
```

### ARIA Labels

```typescript
// ✅ Usar aria-label para iconos sin texto
<button aria-label="Cerrar modal">
  <Icon name="close" />
</button>

// ✅ Usar aria-describedby para describir elementos
<input id="email" type="email" aria-describedby="email-help" />
<p id="email-help">Formato: ejemplo@dominio.com</p>

// ✅ Uso de role cuando necesario
<div role="alert" aria-live="polite">{errorMessage}</div>
```

### Keyboard Navigation

```typescript
// ✅ Todos los elementos interactivos accesibles
<button>Action</button>
<a href="#">Link</a>
<input type="text" />
<select><option>Select</option></select>

// ✅ tabIndex solo cuando sea necesario
<div tabIndex={0} role="button" onClick={}>Custom Button</div>
```

## Testing

### Pattern de Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ProductForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ProductForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'Product');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Product',
    }));
  });
});
```

## Performance

### Memoización

```typescript
// ✅ Usar React.memo para componentes puros
export const ProductCard = React.memo(({ product, onSelect }: Props) => {
  return <div onClick={() => onSelect(product)}>{product.name}</div>;
});

// ✅ useCallback para callbacks memoizados
const handleEdit = useCallback((id: string) => {
  editProduct(id);
}, [editProduct]);

// ✅ useMemo para cálculos costosos
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.name.localeCompare(b.name)),
  [products]
);
```

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const ProductList = lazy(() => import('./pages/ProductList'));

export const App = () => (
  <Suspense fallback={<Loading />}>
    <ProductList />
  </Suspense>
);
```

## Estilos con Tailwind

```typescript
// ✅ Usar clases Tailwind para estilos
<div className="bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-lg font-bold text-gray-900">Título</h2>
  <p className="text-gray-600 mt-2">Descripción</p>
</div>

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Item key={item.id} />)}
</div>

// ✅ Dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

## Variables de Entorno

```env
# API
VITE_API_BASE_URL=http://localhost:5000/api

# App
VITE_APP_NAME=Mi Aplicación
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

## Patrones No Permitidos

```typescript
// ❌ No usar any
const data: any = fetchData();

// ❌ No hardcodear secretos
fetch('https://api.example.com', {
  headers: { 'X-API-Key': 'sk_live_abc123' }
});

// ❌ No lógica en onChange sin validación
<input onChange={(e) => setState(e.target.value)} />

// ❌ No componentes de clase sin justificación
class ProductForm extends React.Component { }

// ❌ No directorio sin index.ts
// Usar barrel exports en cada directorio
```

## Checklist para Nuevo Código

- [ ] Todas las variables/parámetros tipados
- [ ] Props interfaces definidas
- [ ] Componentes pequeños y enfocados
- [ ] Lógica extraída a hooks/servicios
- [ ] Validación de datos implementada
- [ ] ARIA labels para accesibilidad
- [ ] Testing unitario incluido
- [ ] Sin hardcoding de valores
- [ ] Imports organizados
- [ ] Commits con Conventional Commits
