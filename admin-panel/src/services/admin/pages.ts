import { Page, PageFormData, PageFilters, PaginatedResponse, PageTemplate } from '@/types/admin';
import { apiService } from './api';
import { mockPages, mockPageTemplates } from '@/data/mockData';

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
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      // Check if it's API unavailable error
      if (error.name === 'API_UNAVAILABLE' || error.message === 'API_UNAVAILABLE') {
        console.info('Using mock data for pages');
        // Filter mock data based on filters
        let filteredPages = mockPages;
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPages = filteredPages.filter(page => 
            page.title.toLowerCase().includes(searchLower) ||
            page.content.toLowerCase().includes(searchLower) ||
            page.excerpt?.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.status) {
          filteredPages = filteredPages.filter(page => page.status === filters.status);
        }
        
        if (filters.template) {
          filteredPages = filteredPages.filter(page => page.template === filters.template);
        }
        
        if (filters.isHomePage !== undefined) {
          filteredPages = filteredPages.filter(page => page.isHomePage === filters.isHomePage);
        }
        
        if (filters.showInMenu !== undefined) {
          filteredPages = filteredPages.filter(page => page.showInMenu === filters.showInMenu);
        }
        
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPages = filteredPages.slice(startIndex, endIndex);
        
        return {
          data: paginatedPages,
          pagination: {
            page,
            limit,
            total: filteredPages.length,
            totalPages: Math.ceil(filteredPages.length / limit)
          }
        };
      }
      
      // Fallback to empty result if other error
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
    } catch (error: any) {
      console.error('Error fetching page:', error);
      if (error.name === 'API_UNAVAILABLE' || error.message === 'API_UNAVAILABLE') {
        console.info('Using mock data for page');
        const page = mockPages.find(p => p.id === id);
        if (page) {
          return page;
        }
      }
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
  },

  getPageTemplates: async (): Promise<PageTemplate[]> => {
    try {
      const response = await apiService.get<PageTemplate[]>('/pages/templates');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching page templates:', error);
      if (error.name === 'API_UNAVAILABLE' || error.message === 'API_UNAVAILABLE') {
        console.info('Using mock data for page templates');
        return mockPageTemplates;
      }
      throw new Error('Ошибка загрузки шаблонов страниц');
    }
  }
};