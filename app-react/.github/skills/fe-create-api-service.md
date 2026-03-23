# Skill: Crear API Service

## Propósito
Generar servicios de API para comunicación con backend, siguiendo patrones CRUD y manejo de errores consistente.

## Invocación
```
@copilot /fe-create-api-service [ServiceName] [options]
```

## Argumentos

- `ServiceName` (requerido): Nombre del servicio en camelCase con sufijo 'Service'
- `entity` (requerido): Nombre de la entidad (Product, User, etc)
- `endpoints` (opcional): Endpoints adicionales custom
- `baseUrl` (opcional): URL base para el servicio

## Ejemplo de Invocación

```
@copilot /fe-create-api-service productService entity:Product endpoints:"search, getByCategory"
```

## Que Genera

1. **productService.ts**: Clase servicio con métodos CRUD
2. **product.types.ts**: Interfaces DTO y tipos
3. **productService.test.ts**: Tests básicos

## Estándares Aplicados

- Clase con métodos async
- Tipos TypeScript para requests/responses
- Manejo de errores con try-catch
- Logging de errores
- Caché opcional
- Validación de entrada

## Ejemplo de Salida

```typescript
// product.types.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  inStock?: boolean;
}

export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// productService.ts
import apiClient from './api';
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
} from './product.types';

/**
 * Servicio de API para productos
 * Maneja todas las operaciones CRUD y consultas relacionadas
 */
class ProductService {
  private baseUrl = '/products';

  /**
   * Obtiene todos los productos con filtros opcionales
   */
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(this.baseUrl, { params: filters });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  }

  /**
   * Obtiene un producto específico por ID
   */
  async getById(id: string): Promise<Product> {
    try {
      if (!id) throw new Error('ID is required');
      return await apiClient.get<Product>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error('No se pudo cargar el producto');
    }
  }

  /**
   * Crea un nuevo producto
   */
  async create(data: CreateProductDTO): Promise<Product> {
    try {
      if (!data?.name) throw new Error('Product name is required');
      return await apiClient.post<Product>(this.baseUrl, data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('No se pudo crear el producto');
    }
  }

  /**
   * Actualiza un producto existente
   */
  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    try {
      if (!id) throw new Error('ID is required');
      return await apiClient.put<Product>(`${this.baseUrl}/${id}`, data);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  /**
   * Elimina un producto
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) throw new Error('ID is required');
      await apiClient.delete<void>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error('No se pudo eliminar el producto');
    }
  }

  /**
   * Busca productos por término
   */
  async search(term: string): Promise<Product[]> {
    try {
      if (!term) return [];
      return await apiClient.get<Product[]>(`${this.baseUrl}/search`, {
        params: { term },
      });
    } catch (error) {
      console.error(`Error searching products for "${term}":`, error);
      throw new Error('No se pudieron buscar los productos');
    }
  }

  /**
   * Obtiene productos por categoría
   */
  async getByCategory(category: string): Promise<Product[]> {
    try {
      if (!category) throw new Error('Category is required');
      return await apiClient.get<Product[]>(
        `${this.baseUrl}/category/${category}`
      );
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw new Error(`No se pudieron cargar los productos de ${category}`);
    }
  }
}

export const productService = new ProductService();
export default productService;
```

## Uso en Hooks

```typescript
import { productService } from '@/services';

export const useProducts = () => {
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

  return { products, loading, error };
};
```

## Integraciones Comunes

Conectar con API backend:
```typescript
// Backend endpoint
GET /api/products
POST /api/products
GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id
```

Manejo de errores:
```typescript
try {
  await productService.create(newProduct);
} catch (error) {
  showNotification(error.message, 'error');
}
```

## Variantes Comunes

### Para usuarios
```
@copilot /fe-create-api-service userService entity:User endpoints:"getCurrentUser, updateProfile, changePassword"
```

### Para órdenes
```
@copilot /fe-create-api-service orderService entity:Order endpoints:"getMyOrders, cancelOrder, getOrderDetails"
```

## Checklist de Calidad

- [ ] Tipos DTO definidos
- [ ] Métodos CRUD completos
- [ ] Manejo de errores robusto
- [ ] Validación de entrada
- [ ] Documentación JSDoc
- [ ] Tests unitarios
- [ ] Caché implementado (si aplica)
- [ ] Logging apropiado
- [ ] Mensajes de error amigables
- [ ] Exportado en index.ts
