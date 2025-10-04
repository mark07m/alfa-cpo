'use client';

import { useState, useCallback } from 'react';
import { Page, PageFormData, PageFilters, PaginatedResponse } from '@/types/admin';
import { pagesService } from '@/services/admin/pages';
import { toast } from 'react-toastify';

interface UsePagesOptions {
  initialFilters?: PageFilters;
  initialPage?: number;
  initialLimit?: number;
}

export const usePages = (options?: UsePagesOptions) => {
  const [filters, setFilters] = useState<PageFilters>(options?.initialFilters || {});
  const [page, setPage] = useState(options?.initialPage || 1);
  const [limit, setLimit] = useState(options?.initialLimit || 10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PaginatedResponse<Page> | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await pagesService.getPages(filters, { page, limit });
      setData(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка загрузки страниц');
      setError(error);
      toast.error(`Ошибка загрузки страниц: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  const createPage = useCallback(async (formData: PageFormData) => {
    try {
      const newPage = await pagesService.createPage(formData);
      await fetchPages(); // Refresh the list
      toast.success('Страница успешно создана!');
      return newPage;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка создания страницы');
      toast.error(`Ошибка создания страницы: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const updatePage = useCallback(async (id: string, formData: Partial<PageFormData>) => {
    try {
      const updatedPage = await pagesService.updatePage(id, formData);
      await fetchPages(); // Refresh the list
      toast.success('Страница успешно обновлена!');
      return updatedPage;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка обновления страницы');
      toast.error(`Ошибка обновления страницы: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const deletePage = useCallback(async (id: string) => {
    try {
      await pagesService.deletePage(id);
      await fetchPages(); // Refresh the list
      toast.success('Страница успешно удалена!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка удаления страницы');
      toast.error(`Ошибка удаления страницы: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const updatePageStatus = useCallback(async (id: string, status: 'draft' | 'published' | 'archived') => {
    try {
      const updatedPage = await pagesService.updatePageStatus(id, status);
      await fetchPages(); // Refresh the list
      toast.success('Статус страницы обновлен!');
      return updatedPage;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка обновления статуса');
      toast.error(`Ошибка обновления статуса: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: 'draft' | 'published' | 'archived') => {
    try {
      await Promise.all(ids.map(id => pagesService.updatePageStatus(id, status)));
      await fetchPages(); // Refresh the list
      toast.success(`Статус ${ids.length} страниц обновлен!`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка массового обновления статуса');
      toast.error(`Ошибка массового обновления статуса: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const bulkDeletePages = useCallback(async (ids: string[]) => {
    try {
      await pagesService.bulkDeletePages(ids);
      await fetchPages(); // Refresh the list
      toast.success(`${ids.length} страниц успешно удалено!`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка массового удаления');
      toast.error(`Ошибка массового удаления: ${error.message}`);
      throw error;
    }
  }, [fetchPages]);

  const getPageById = useCallback(async (id: string) => {
    try {
      return await pagesService.getPageById(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка загрузки страницы');
      toast.error(`Ошибка загрузки страницы: ${error.message}`);
      throw error;
    }
  }, []);

  return {
    // Data
    pages: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    
    // Filters and pagination
    filters,
    setFilters,
    page,
    setPage,
    limit,
    setLimit,
    
    // Actions
    fetchPages,
    createPage,
    updatePage,
    deletePage,
    updatePageStatus,
    bulkUpdateStatus,
    bulkDeletePages,
    getPageById,
    
    // Computed
    totalPages: data?.pagination?.totalPages || 0,
    totalItems: data?.pagination?.total || 0,
    hasNextPage: data?.pagination ? data.pagination.page < data.pagination.totalPages : false,
    hasPrevPage: data?.pagination ? data.pagination.page > 1 : false,
  };
};