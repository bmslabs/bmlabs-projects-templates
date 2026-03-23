import { useState, useCallback } from 'react';

/**
 * Hook genérico para operaciones CRUD
 * Proporciona estado y métodos para Create, Read, Update, Delete
 */
export interface UseCrudResult<T extends { id: string }> {
  items: T[];
  item: T | null;
  loading: boolean;
  error: Error | null;
  create: (data: any) => Promise<T>;
  read: (id: string) => Promise<T>;
  readAll: (filters?: any) => Promise<T[]>;
  update: (id: string, data: any) => Promise<T>;
  delete: (id: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Hook reutilizable para CRUD genérico
 * Use con cualquier entidad que tenga un servicio
 */
export const useCrud = <T extends { id: string }, F = unknown>(
  service: {
    getAll?: (filters?: F) => Promise<T[]>;
    getById: (id: string) => Promise<T>;
    create: (data: any) => Promise<T>;
    update: (id: string, data: any) => Promise<T>;
    delete: (id: string) => Promise<void>;
  }
): UseCrudResult<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown, context: string) => {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido';
    console.error(`Error in ${context}:`, errorMessage);
    setError(new Error(errorMessage));
  }, []);

  const create = useCallback(
    async (data: Omit<T, 'id'>) => {
      try {
        setLoading(true);
        setError(null);
        const newItem = await service.create(data);
        setItems((prev) => [...prev, newItem]);
        return newItem;
      } catch (err) {
        handleError(err, 'useCrud.create');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, handleError]
  );

  const read = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await service.getById(id);
        setItem(result);
        return result;
      } catch (err) {
        handleError(err, 'useCrud.read');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, handleError]
  );

  const readAll = useCallback(
    async (filters?: F) => {
      try {
        setLoading(true);
        setError(null);
        const result = await service.getAll?.(filters);
        setItems(result || []);
        return result || [];
      } catch (err) {
        handleError(err, 'useCrud.readAll');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, handleError]
  );

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await service.update(id, data);
        setItems((prev) =>
          prev.map((i) => (i.id === id ? updated : i))
        );
        if (item?.id === id) {
          setItem(updated);
        }
        return updated;
      } catch (err) {
        handleError(err, 'useCrud.update');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, handleError, item?.id]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await service.delete(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (item?.id === id) {
          setItem(null);
        }
      } catch (err) {
        handleError(err, 'useCrud.delete');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, handleError, item?.id]
  );

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

export default useCrud;
