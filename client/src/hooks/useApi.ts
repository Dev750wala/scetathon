'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({ data: null, loading: false, error: null });

  const execute = useCallback(async (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    body?: unknown,
    params?: Record<string, unknown>
  ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api({ method, url, data: body, params });
      const data = response.data?.data ?? response.data;
      setState({ data, loading: false, error: null });
      return { data, success: true };
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Request failed';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return { data: null, success: false, error: message };
    }
  }, []);

  const get = useCallback((url: string, params?: Record<string, unknown>) => execute('get', url, undefined, params), [execute]);
  const post = useCallback((url: string, body?: unknown) => execute('post', url, body), [execute]);
  const patch = useCallback((url: string, body?: unknown) => execute('patch', url, body), [execute]);
  const del = useCallback((url: string) => execute('delete', url), [execute]);

  return { ...state, get, post, patch, del };
}
