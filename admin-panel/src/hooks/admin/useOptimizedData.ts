import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  enabled?: boolean;
  refetchOnMount?: boolean;
  staleTime?: number; // в миллисекундах
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
  staleTime = 5 * 60 * 1000 // 5 минут по умолчанию
}: UseOptimizedDataOptions<T>): UseOptimizedDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [isStale, setIsStale] = useState(false);
  
  const mountedRef = useRef(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setLastFetch(Date.now());
        setIsStale(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, enabled]);

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

  // Автоматическая перезагрузка при изменении зависимостей
  useEffect(() => {
    if (!enabled) return;
    
    // Очищаем предыдущий таймаут
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Дебаунс для избежания частых запросов
    fetchTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        fetchData();
      }
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [...dependencies, enabled, fetchData]);

  // Первоначальная загрузка
  useEffect(() => {
    if (enabled && refetchOnMount && !data) {
      fetchData();
    }
  }, [enabled, refetchOnMount, data, fetchData]);

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
