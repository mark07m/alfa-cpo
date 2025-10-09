import { useState, useEffect, useCallback } from 'react';
import { compensationFundService } from '@/services/admin/compensationFund';
import { 
  CompensationFund, 
  CompensationFundStatistics, 
  CompensationFundFormData, 
  CompensationFundHistoryFormData 
} from '@/types/admin';

interface UseCompensationFundReturn {
  fundInfo: CompensationFund | null;
  statistics: CompensationFundStatistics | null;
  history: CompensationFund['history'];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchFundInfo: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  fetchHistory: (params?: {
    page?: number;
    limit?: number;
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => Promise<void>;
  updateFundInfo: (data: CompensationFundFormData) => Promise<void>;
  addHistoryEntry: (data: CompensationFundHistoryFormData) => Promise<void>;
  updateHistoryEntry: (id: string, data: CompensationFundHistoryFormData) => Promise<void>;
  deleteHistoryEntry: (id: string) => Promise<void>;
  exportHistory: (params?: {
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => Promise<Blob>;
  exportStatistics: () => Promise<Blob>;
}

export function useCompensationFund(): UseCompensationFundReturn {
  const [fundInfo, setFundInfo] = useState<CompensationFund | null>(null);
  const [statistics, setStatistics] = useState<CompensationFundStatistics | null>(null);
  const [history, setHistory] = useState<CompensationFund['history']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchFundInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await compensationFundService.getFundInfo();
      setFundInfo(data);
    } catch (err) {
      const message = (err as any)?.response?.status === 401
        ? 'Не авторизовано. Войдите в систему.'
        : (err as any)?.response?.status === 403
          ? 'Недостаточно прав для просмотра информации о фонде.'
          : (err instanceof Error ? err.message : 'Ошибка загрузки информации о фонде');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await compensationFundService.getFundStatistics();
      setStatistics(data);
    } catch (err) {
      const message = (err as any)?.response?.status === 401
        ? 'Не авторизовано. Войдите в систему.'
        : (err as any)?.response?.status === 403
          ? 'Недостаточно прав для просмотра статистики.'
          : (err instanceof Error ? err.message : 'Ошибка загрузки статистики');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (params?: {
    page?: number;
    limit?: number;
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await compensationFundService.getFundHistory(params);
      setHistory(data.data);
      setPagination(data.pagination);
    } catch (err) {
      const message = (err as any)?.response?.status === 401
        ? 'Не авторизовано. Войдите в систему.'
        : (err as any)?.response?.status === 403
          ? 'Недостаточно прав для просмотра истории.'
          : (err instanceof Error ? err.message : 'Ошибка загрузки истории');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFundInfo = useCallback(async (data: CompensationFundFormData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedFund = await compensationFundService.updateFundInfo(data);
      setFundInfo(updatedFund);
      // Обновляем статистику после изменения фонда
      await fetchStatistics();
    } catch (err) {
      const message = (err as any)?.response?.status === 401
        ? 'Не авторизовано. Войдите в систему.'
        : (err as any)?.response?.status === 403
          ? 'Недостаточно прав. Нужны права settings:update.'
          : (err instanceof Error ? err.message : 'Ошибка обновления информации о фонде');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStatistics]);

  const addHistoryEntry = useCallback(async (data: CompensationFundHistoryFormData) => {
    try {
      setLoading(true);
      setError(null);
      await compensationFundService.addHistoryEntry(data);
      // Обновляем историю и статистику
      await Promise.all([fetchHistory(), fetchStatistics()]);
    } catch (err) {
      const message = (err as any)?.response?.status === 401
        ? 'Не авторизовано. Войдите в систему.'
        : (err as any)?.response?.status === 403
          ? 'Недостаточно прав. Нужны права settings:update.'
          : (err instanceof Error ? err.message : 'Ошибка добавления записи в историю');
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, fetchStatistics]);

  const updateHistoryEntry = useCallback(async (id: string, data: CompensationFundHistoryFormData) => {
    try {
      setLoading(true);
      setError(null);
      await compensationFundService.updateHistoryEntry(id, data);
      // Обновляем историю и статистику
      await Promise.all([fetchHistory(), fetchStatistics()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления записи в истории');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, fetchStatistics]);

  const deleteHistoryEntry = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await compensationFundService.deleteHistoryEntry(id);
      // Обновляем историю и статистику
      await Promise.all([fetchHistory(), fetchStatistics()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления записи из истории');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchHistory, fetchStatistics]);

  const exportHistory = useCallback(async (params?: {
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setError(null);
      return await compensationFundService.exportHistory(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка экспорта истории');
      throw err;
    }
  }, []);

  const exportStatistics = useCallback(async () => {
    try {
      setError(null);
      return await compensationFundService.exportStatistics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка экспорта статистики');
      throw err;
    }
  }, []);

  // Загружаем данные при инициализации
  useEffect(() => {
    fetchFundInfo();
    fetchStatistics();
    fetchHistory();
  }, [fetchFundInfo, fetchStatistics, fetchHistory]);

  return {
    fundInfo,
    statistics,
    history,
    loading,
    error,
    pagination,
    fetchFundInfo,
    fetchStatistics,
    fetchHistory,
    updateFundInfo,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    exportHistory,
    exportStatistics
  };
}
