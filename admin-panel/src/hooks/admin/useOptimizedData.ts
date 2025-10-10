import { useState, useEffect, useCallback, useRef } from 'react';

// Simple in-memory cache shared across hook instances
const globalCache = new Map<string, { data: any; lastFetch: number }>();

interface UseOptimizedDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  enabled?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number; // в миллисекундах
  cacheKey?: string; // unique key to enable cross-mount caching
  requestTimeoutMs?: number; // hard timeout fence for fetchFn
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export function useOptimizedData<T>({
  fetchFn,
  dependencies = [],
  enabled = true,
  refetchOnMount = true,
  staleTime = 5 * 60 * 1000, // 5 минут по умолчанию
  cacheKey,
  requestTimeoutMs
}: UseOptimizedDataOptions<T>): UseOptimizedDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isStale, setIsStale] = useState(false);
  
  const mountedRef = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const inFlightRef = useRef<Promise<T> | null>(null);
  const lastErrorAtRef = useRef<number>(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    // Dedupe concurrent requests
    if (inFlightRef.current) {
      try {
        await inFlightRef.current;
      } catch (_) {
        // ignore, state was set by the original call
      }
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Apply hard timeout if requested
      const runFetch = async () => await fetchFn();
      const p = (requestTimeoutMs
        ? Promise.race<never | T>([
            runFetch(),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), requestTimeoutMs))
          ])
        : runFetch());
      inFlightRef.current = p as Promise<T>;
      const result = await p;
      if (mountedRef.current) {
        setData(result);
        setLastFetch(Date.now());
        setIsStale(false);
        if (cacheKey) {
          globalCache.set(cacheKey, { data: result, lastFetch: Date.now() });
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        lastErrorAtRef.current = Date.now();
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      inFlightRef.current = null;
    }
  }, [fetchFn, enabled, requestTimeoutMs, cacheKey]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Проверка на устаревание данных
  useEffect(() => {
    if (lastFetch === 0) return;

    const checkStale = () => {
      const now = Date.now();
      const isDataStale = now - lastFetch > staleTime;
      setIsStale(isDataStale);
    };

    checkStale();
    
    // Проверяем каждую минуту
    const interval = setInterval(checkStale, 60000);
    
    return () => clearInterval(interval);
  }, [lastFetch, staleTime]);

  // Автоматическая перезагрузка при изменении зависимостей (только если данные устарели)
  useEffect(() => {
    if (!enabled) return;
    
    // Очищаем предыдущий таймаут
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Дебаунс для избежания частых запросов
    fetchTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      const now = Date.now();
      const shouldRefetch = lastFetch === 0 || now - lastFetch > staleTime;
      if (shouldRefetch) fetchData();
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [...dependencies, enabled, fetchData, lastFetch, staleTime]);

  // Первоначальная загрузка + чтение из кэша
  useEffect(() => {
    if (!enabled) return;

    // If cache is enabled and present, hydrate from it immediately
    if (cacheKey && globalCache.has(cacheKey)) {
      const cached = globalCache.get(cacheKey)!;
      setData(cached.data as T);
      setLastFetch(cached.lastFetch);
      setIsStale(Date.now() - cached.lastFetch > staleTime);
    }

    if (refetchOnMount) {
      const now = Date.now();
      const needFetch = !cacheKey || !globalCache.has(cacheKey) || now - (globalCache.get(cacheKey)!.lastFetch) > staleTime;
      if (needFetch && !loading) {
        fetchData();
      }
    }
  }, [enabled, refetchOnMount, cacheKey, staleTime, fetchData]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale
  };
}

// Хук для мемоизации дорогих вычислений
export function useMemoizedValue<T>(value: T, dependencies: any[]): T {
  const [memoizedValue, setMemoizedValue] = useState<T>(value);
  const prevDepsRef = useRef<any[]>([]);

  useEffect(() => {
    const depsChanged = dependencies.some((dep, index) => dep !== prevDepsRef.current[index]);
    
    if (depsChanged) {
      setMemoizedValue(value);
      prevDepsRef.current = dependencies;
    }
  }, [value, ...dependencies]);

  return memoizedValue;
}

// Хук для дебаунса
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

// Хук для throttle
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    
    if (now >= lastExecuted.current + delay) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, lastExecuted.current + delay - now);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}
