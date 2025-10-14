import { Page, PageFormData, PageFilters, PaginatedResponse, PageTemplate, ApiResponse } from '@/types/admin';
import { apiService } from './api';
import { mockPages, mockPageTemplates } from '@/data/mockData';

export const pagesService = {
  getPages: async (filters: PageFilters = {}, pagination: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Page>> => {
    try {
      const params = new URLSearchParams();
      
      // Поддерживаемые параметры согласно PageQueryDto
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.template) params.append('template', filters.template);
      if (filters.dateFrom) params.append('publishedAtFrom', filters.dateFrom);
      if (filters.dateTo) params.append('publishedAtTo', filters.dateTo);
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.limit) params.append('limit', pagination.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiService.get(`/pages?${params.toString()}`) as ApiResponse<Page[]> & { pagination?: any };
      console.log('Pages service response:', response); // Debug log
      
      // Ensure we always return a valid response
      if (!response || !response.success) {
        return {
          data: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
        };
      }
      
      // Backend returns { success: true, data: [...], pagination: {...} }
      // Transform _id to id for frontend compatibility
      const transformedData = (response.data || []).map((page: any) => ({
        ...page,
        id: page._id || page.id
      }));
      
      return {
        data: transformedData,
        pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
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
      const response = await apiService.get(`/pages/${id}`) as ApiResponse<Page>;
      if (!response.success || !response.data) {
        throw new Error('Страница не найдена');
      }
      // Transform _id to id for frontend compatibility
      return {
        ...response.data,
        id: (response.data as any)._id || response.data.id
      };
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

  // Alias for getPageById for convenience
  getPage: async (id: string): Promise<Page> => {
    return pagesService.getPageById(id);
  },

  createPage: async (data: PageFormData): Promise<Page> => {
    try {
      // Преобразуем данные формы в формат, ожидаемый backend
      const createData = {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords ? data.seoKeywords.split(',').map(k => k.trim()) : [],
        template: data.template,
        metadata: data.customFields || {},
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined
      };

      const response = await apiService.post('/pages', createData) as ApiResponse<Page>;
      if (!response.success || !response.data) {
        throw new Error('Ошибка создания страницы');
      }
      // Transform _id to id for frontend compatibility
      return {
        ...response.data,
        id: (response.data as any)._id || response.data.id
      };
    } catch (error: any) {
      console.error('Error creating page:', error);
      throw new Error('Ошибка создания страницы');
    }
  },

  updatePage: async (id: string, data: Partial<PageFormData>): Promise<Page> => {
    try {
      // Преобразуем данные формы в формат, ожидаемый backend
      const updateData: any = {};
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
      if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
      if (data.seoKeywords !== undefined) {
        updateData.seoKeywords = data.seoKeywords ? data.seoKeywords.split(',').map(k => k.trim()) : [];
      }
      if (data.template !== undefined) updateData.template = data.template;
      if (data.customFields !== undefined) updateData.metadata = data.customFields;
      if (data.publishedAt !== undefined) {
        updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : undefined;
      }

      const response = await apiService.patch(`/pages/${id}`, updateData) as ApiResponse<Page>;
      if (!response.success || !response.data) {
        throw new Error('Ошибка обновления страницы');
      }
      // Transform _id to id for frontend compatibility
      return {
        ...response.data,
        id: (response.data as any)._id || response.data.id
      };
    } catch (error: any) {
      console.error('Error updating page:', error);
      throw new Error('Ошибка обновления страницы');
    }
  },

  deletePage: async (id: string): Promise<void> => {
    try {
      const response = await apiService.delete(`/pages/${id}`) as ApiResponse<void>;
      if (!response.success) {
        throw new Error('Ошибка удаления страницы');
      }
    } catch (error: any) {
      console.error('Error deleting page:', error);
      throw new Error('Ошибка удаления страницы');
    }
  },

  updatePageStatus: async (id: string, status: 'draft' | 'published' | 'archived'): Promise<Page> => {
    try {
      const response = await apiService.patch(`/pages/${id}`, { status }) as ApiResponse<Page>;
      if (!response.success || !response.data) {
        throw new Error('Ошибка обновления статуса страницы');
      }
      // Transform _id to id for frontend compatibility
      return {
        ...response.data,
        id: (response.data as any)._id || response.data.id
      };
    } catch (error: any) {
      console.error('Error updating page status:', error);
      throw new Error('Ошибка обновления статуса страницы');
    }
  },

  bulkDeletePages: async (ids: string[]): Promise<void> => {
    try {
      // Backend не поддерживает массовое удаление, удаляем по одной
      const deletePromises = ids.map(id => pagesService.deletePage(id));
      await Promise.all(deletePromises);
    } catch (error: any) {
      console.error('Error bulk deleting pages:', error);
      throw new Error('Ошибка массового удаления страниц');
    }
  },

  bulkUpdateStatus: async (ids: string[], status: 'draft' | 'published' | 'archived'): Promise<void> => {
    try {
      // Backend не поддерживает массовое обновление, обновляем по одной
      const updatePromises = ids.map(id => pagesService.updatePageStatus(id, status));
      await Promise.all(updatePromises);
    } catch (error: any) {
      console.error('Error bulk updating page status:', error);
      throw new Error('Ошибка массового обновления статуса страниц');
    }
  },

  getPageTemplates: async (): Promise<PageTemplate[]> => {
    try {
      // Backend не имеет эндпоинта для шаблонов, возвращаем статический список
      return Object.values(PageTemplate);
    } catch (error: any) {
      console.error('Error fetching page templates:', error);
      if (error.name === 'API_UNAVAILABLE' || error.message === 'API_UNAVAILABLE') {
        console.info('Using mock data for page templates');
        return mockPageTemplates;
      }
      throw new Error('Ошибка загрузки шаблонов страниц');
    }
  },

  getPageStatistics: async (): Promise<any> => {
    try {
      const response = await apiService.get('/pages/statistics') as ApiResponse<any>;
      if (!response.success || !response.data) {
        throw new Error('Ошибка загрузки статистики страниц');
      }
      return response.data;
    } catch (error: any) {
      console.error('Error fetching page statistics:', error);
      throw new Error('Ошибка загрузки статистики страниц');
    }
  }
};