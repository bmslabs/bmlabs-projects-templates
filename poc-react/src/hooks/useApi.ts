/**
 * useApi Hook (Prompt D - CreateCustomHook)
 * Custom hook for fetching data from API endpoints
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

/**
 * useApi - Hook for data fetching
 * @example
 * const { data, loading, error, refetch } = useApi('/api/products');
 */
export const useApi = <T = unknown>(
  url: string,
  options?: RequestInit
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = (await response.json()) as T;
      setState({
        data,
        loading: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch
  };
};

export default useApi;
