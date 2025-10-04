import { useState, useEffect, useCallback } from 'react';
import { arbitratorsService, ArbitratorFormData } from '@/services/admin/arbitrators';
import { Arbitrator, ArbitratorFilters, ArbitratorStats } from '@/types/admin';

export function useArbitrators(initialFilters: ArbitratorFilters = {}) {
  const [arbitrators, setArbitrators] = useState<Arbitrator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArbitratorFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchArbitrators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching arbitrators with filters:', filters);
      const response = await arbitratorsService.getArbitrators(filters);
      console.log('API response:', response);
      setArbitrators(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch (err) {
      console.error('Error fetching arbitrators:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      });
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchArbitrators();
  }, [fetchArbitrators]);

  const updateFilters = useCallback((newFilters: Partial<ArbitratorFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const createArbitrator = useCallback(async (data: ArbitratorFormData) => {
    try {
      setLoading(true);
      setError(null);
      const newArbitrator = await arbitratorsService.createArbitrator(data);
      setArbitrators(prev => [newArbitrator, ...(prev || [])]);
      return newArbitrator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания арбитражного управляющего';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateArbitrator = useCallback(async (id: string, data: Partial<ArbitratorFormData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedArbitrator = await arbitratorsService.updateArbitrator(id, data);
      setArbitrators(prev => 
        (prev || []).map(arbitrator => 
          arbitrator.id === id ? updatedArbitrator : arbitrator
        )
      );
      return updatedArbitrator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обновления арбитражного управляющего';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteArbitrator = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await arbitratorsService.deleteArbitrator(id);
      setArbitrators(prev => (prev || []).filter(arbitrator => arbitrator.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка удаления арбитражного управляющего';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: 'active' | 'excluded' | 'suspended') => {
    try {
      setLoading(true);
      setError(null);
      await arbitratorsService.bulkUpdateStatus(ids, status);
      setArbitrators(prev => 
        (prev || []).map(arbitrator => 
          ids.includes(arbitrator.id) ? { ...arbitrator, status } : arbitrator
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка массового обновления статуса';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await arbitratorsService.bulkDelete(ids);
      setArbitrators(prev => (prev || []).filter(arbitrator => !ids.includes(arbitrator.id)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка массового удаления';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportArbitrators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await arbitratorsService.exportArbitrators(filters);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arbitrators-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка экспорта данных';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const importArbitrators = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const result = await arbitratorsService.importArbitrators(file);
      await fetchArbitrators(); // Обновляем список
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка импорта данных';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchArbitrators]);

  return {
    arbitrators,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    resetFilters,
    createArbitrator,
    updateArbitrator,
    deleteArbitrator,
    bulkUpdateStatus,
    bulkDelete,
    exportArbitrators,
    importArbitrators,
    refetch: fetchArbitrators,
  };
}

export function useArbitratorStats() {
  const [stats, setStats] = useState<ArbitratorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await arbitratorsService.getArbitratorStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useArbitrator(id: string) {
  const [arbitrator, setArbitrator] = useState<Arbitrator | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArbitrator = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await arbitratorsService.getArbitrator(id);
      setArbitrator(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки арбитражного управляющего');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArbitrator();
  }, [fetchArbitrator]);

  return {
    arbitrator,
    loading,
    error,
    refetch: fetchArbitrator,
  };
}
