/**
 * useCrud Hook (Prompt D - CreateCustomHook)
 * Custom hook for CRUD operations on any entity
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseCrudState<T> {
  items: T[];
  item: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseCrudReturn<T, C = Partial<T>, U = Partial<T>>
  extends UseCrudState<T> {
  readAll: () => Promise<void>;
  read: (id: string) => Promise<void>;
  create: (data: C) => Promise<T>;
  update: (id: string, data: U) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

/**
 * useCrud - Hook for CRUD operations
 * @example
 * const { items, create, update, delete, loading } = useCrud(ProductService);
 */
export const useCrud = <T extends { id: string }, C = T, U = Partial<T>>(
  service: {
    getAll: () => Promise<T[]>;
    getById: (id: string) => Promise<T>;
    create: (data: C) => Promise<T>;
    update: (id: string, data: U) => Promise<T>;
    delete: (id: string) => Promise<{ success: boolean }>;
  }
): UseCrudReturn<T, C, U> => {
  const [state, setState] = useState<UseCrudState<T>>({
    items: [],
    item: null,
    loading: false,
    error: null
  });

  const readAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const items = await service.getAll();
      setState({
        items,
        item: null,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        items: [],
        item: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  }, [service]);

  const read = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const item = await service.getById(id);
        setState({
          items: state.items,
          item,
          loading: false,
          error: null
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error')
        }));
      }
    },
    [service, state.items]
  );

  const create = useCallback(
    async (data: C) => {
      try {
        const newItem = await service.create(data);
        setState((prev) => ({
          ...prev,
          items: [...prev.items, newItem]
        }));
        return newItem;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Unknown error');
      }
    },
    [service]
  );

  const update = useCallback(
    async (id: string, data: U) => {
      try {
        const updatedItem = await service.update(id, data);
        setState((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === id ? updatedItem : item
          ),
          item: prev.item?.id === id ? updatedItem : prev.item
        }));
        return updatedItem;
      } catch (error) {
        throw error instanceof Error ? error : new Error('Unknown error');
      }
    },
    [service]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await service.delete(id);
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== id),
          item: prev.item?.id === id ? null : prev.item
        }));
      } catch (error) {
        throw error instanceof Error ? error : new Error('Unknown error');
      }
    },
    [service]
  );

  // Load all items on mount
  useEffect(() => {
    readAll();
  }, [readAll]);

  return {
    ...state,
    readAll,
    read,
    create,
    update,
    delete: deleteItem
  };
};

export default useCrud;
