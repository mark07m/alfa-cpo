import { Page, PageFormData, PageFilters, PaginatedResponse, PageTemplate } from '@/types/admin';
import { apiService } from './api';

export const pagesService = {
  getPages: async (filters: PageFilters = {}, pagination: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Page>> => {
    try {
      const response = await apiService.getPaginated<Page>('/pages', {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        search: filters.search,
        filters: {
          status: filters.status,
          template: filters.template,
          isHomePage: filters.isHomePage,
          showInMenu: filters.showInMenu,
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      // Fallback to empty result if API is unavailable
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  getPageById: async (id: string): Promise<Page> => {
    try {
      const response = await apiService.get<Page>(`/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw new Error('Страница не найдена');
    }
  },

  createPage: async (data: PageFormData): Promise<Page> => {
    try {
      const response = await apiService.post<Page>('/pages', data);
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw new Error('Ошибка создания страницы');
    }
  },

  updatePage: async (id: string, data: Partial<PageFormData>): Promise<Page> => {
    try {
      const response = await apiService.patch<Page>(`/pages/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating page:', error);
      throw new Error('Ошибка обновления страницы');
    }
  },

  deletePage: async (id: string): Promise<void> => {
    try {
      await apiService.delete(`/pages/${id}`);
    } catch (error) {
      console.error('Error deleting page:', error);
      throw new Error('Ошибка удаления страницы');
    }
  },

  updatePageStatus: async (id: string, status: 'draft' | 'published' | 'archived'): Promise<Page> => {
    try {
      const response = await apiService.patch<Page>(`/pages/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating page status:', error);
      throw new Error('Ошибка обновления статуса страницы');
    }
  },

  bulkDeletePages: async (ids: string[]): Promise<void> => {
    try {
      await apiService.batchDelete('/pages', ids);
    } catch (error) {
      console.error('Error bulk deleting pages:', error);
      throw new Error('Ошибка массового удаления страниц');
    }
  },

  bulkUpdateStatus: async (ids: string[], status: 'draft' | 'published' | 'archived'): Promise<void> => {
    try {
      const updates = ids.map(id => ({ id, data: { status } }));
      await apiService.batchUpdate('/pages', updates);
    } catch (error) {
      console.error('Error bulk updating page status:', error);
      throw new Error('Ошибка массового обновления статуса страниц');
    }
  }
};