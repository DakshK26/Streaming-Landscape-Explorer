import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFetchOptions {
    enabled?: boolean;
}

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useFetch<T>(
    url: string,
    options: UseFetchOptions = {}
): UseFetchResult<T> {
    const { enabled = true } = options;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (!signal?.aborted) {
                setData(result);
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            if (!signal?.aborted) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            }
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [url, enabled]);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        fetchData(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchData]);

    const refetch = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        fetchData(controller.signal);
    }, [fetchData]);

    return { data, loading, error, refetch };
}

// Debounce hook for filter changes
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
