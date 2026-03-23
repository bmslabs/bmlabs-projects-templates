# Skill: Crear Hook Personalizado useCrud

## Propósito
Generar hooks personalizados para operaciones CRUD, gestión de estado y lógica compartida entre componentes.

## Invocación
```
@copilot /fe-create-hooks [HookName] [options]
```

## Argumentos

- `HookName` (requerido): Nombre en camelCase con prefijo 'use'
- `type` (opcional): 'crud', 'form', 'api', 'state' (default: 'crud')
- `entity` (opcional): Entidad a manejar
- `service` (opcional): Servicio a usar

## Ejemplo de Invocación

```
@copilot /fe-create-hooks useProduct type:crud entity:Product service:productService
```

## Que Genera

1. **hook.ts**: Hook funcional completo
2. **hook.types.ts**: Interfaces y tipos
3. **hook.test.ts**: Tests unitarios

## Hook useCrud

Patrón para CRUD genérico:

```typescript
// useProduct.ts
import { useState, useCallback } from 'react';
import { productService } from '@/services';
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/services';

export interface UseProductResult {
  items: Product[];
  item: Product | null;
  loading: boolean;
  error: Error | null;
  create: (data: CreateProductDTO) => Promise<void>;
  read: (id: string) => Promise<void>;
  readAll: (filters?: unknown) => Promise<void>;
  update: (id: string, data: UpdateProductDTO) => Promise<void>;
  delete: (id: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Hook para gestionar productos
 * Proporciona métodos CRUD y estado
 */
export const useProduct = (): UseProductResult => {
  const [items, setItems] = useState<Product[]>([]);
  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown, context: string) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido';
    console.error(`Error in ${context}:`, errorMessage);
    setError(new Error(errorMessage));
  }, []);

  const create = useCallback(async (data: CreateProductDTO) => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await productService.create(data);
      setItems((prev) => [...prev, newProduct]);
      setItem(newProduct);
    } catch (err) {
      handleError(err, 'useProduct.create');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const read = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const product = await productService.getById(id);
      setItem(product);
    } catch (err) {
      handleError(err, 'useProduct.read');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const readAll = useCallback(async (filters?: unknown) => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getAll(filters);
      setItems(products);
    } catch (err) {
      handleError(err, 'useProduct.readAll');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const update = useCallback(
    async (id: string, data: UpdateProductDTO) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await productService.update(id, data);
        setItems((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
        setItem(updated);
      } catch (err) {
        handleError(err, 'useProduct.update');
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await productService.delete(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
      if (item?.id === id) {
        setItem(null);
      }
    } catch (err) {
      handleError(err, 'useProduct.delete');
    } finally {
      setLoading(false);
    }
  }, [handleError, item?.id]);

  const reset = useCallback(() => {
    setItems([]);
    setItem(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    items,
    item,
    loading,
    error,
    create,
    read,
    readAll,
    update,
    delete: deleteItem,
    reset,
    clearError,
  };
};

export default useProduct;
```

## Hook useForm

Para gestión de formularios:

```typescript
// useForm.ts
import { useState, useCallback } from 'react';

export interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  setFieldValue: (field: keyof T, value: unknown) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormResult<T> => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (validate) {
      const newErrors = validate({ ...values, [field]: value });
      setErrors((prev) => ({
        ...prev,
        [field]: newErrors[field],
      }));
    }
  }, [validate, values]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFieldValue(name as keyof T, fieldValue);
  }, [setFieldValue]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate) {
          const newErrors = validate(values);
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) {
            return;
          }
        }

        try {
          setIsSubmitting(true);
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleSubmit,
    reset,
  };
};
```

## Hook useApi

Para peticiones HTTP genéricas:

```typescript
// useApi.ts
import { useState, useEffect, useCallback } from 'react';

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useApi = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseApiResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};
```

## Uso en Componentes

```typescript
import { useProduct } from '@/hooks';
import { ProductDataGrid } from '@/components';

export const ProductList: React.FC = () => {
  const { items, loading, error, readAll, delete: deleteProduct } = useProduct();

  useEffect(() => {
    readAll();
  }, [readAll]);

  if (error) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  return (
    <ProductDataGrid
      data={items}
      loading={loading}
      onDelete={deleteProduct}
    />
  );
};
```

## Variantes Comunes

### Hook para autenticación
```
@copilot /fe-create-hooks useAuth type:state service:authService
```

### Hook para filtros
```
@copilot /fe-create-hooks useFilters type:state
```

### Hook para paginación
```
@copilot /fe-create-hooks usePagination type:state
```

## Checklist de Calidad

- [ ] Hook con nombres claros
- [ ] Tipos bien definidos
- [ ] Manejo de errores robusto
- [ ] Dependencies array correcto
- [ ] Memory leaks evitados
- [ ] useCallback para optimización
- [ ] Documentación JSDoc
- [ ] Tests unitarios
- [ ] Reutilizable y genérico
- [ ] Exportado en index.ts
