import { apiService } from './api'
import { News, NewsCategory, NewsFilters, PaginationParams, ApiResponse, UserRole } from '@/types/admin'

export interface NewsService {
  getNews(filters?: NewsFilters & PaginationParams): Promise<ApiResponse<{ news: News[]; pagination: any }>>
  getNewsItem(id: string): Promise<ApiResponse<News>>
  createNews(newsData: Partial<News>): Promise<ApiResponse<News>>
  updateNews(id: string, newsData: Partial<News>): Promise<ApiResponse<News>>
  deleteNews(id: string): Promise<ApiResponse<void>>
  bulkDeleteNews(ids: string[]): Promise<ApiResponse<void>>
  updateNewsStatus(id: string, status: News['status']): Promise<ApiResponse<News>>
  getNewsCategories(): Promise<ApiResponse<NewsCategory[]>>
  createNewsCategory(categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>>
  updateNewsCategory(id: string, categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>>
  deleteNewsCategory(id: string): Promise<ApiResponse<void>>
  getPublicNews(category?: string): Promise<ApiResponse<News[]>>
  searchNews(query: string): Promise<ApiResponse<News[]>>
  getNewsByCategory(category: string): Promise<ApiResponse<News[]>>
}

class NewsServiceImpl implements NewsService {
  async getNews(filters: NewsFilters & PaginationParams = { page: 1, limit: 10 }): Promise<ApiResponse<{ news: News[]; pagination: any }>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await apiService.get(`/news?${params.toString()}`) as ApiResponse<{ data: News[]; pagination: any }>
      console.log('News service response:', response) // Debug log
      
      // Ensure we always return a valid response
      if (!response || !response.data) {
        return {
          success: false,
          data: { news: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
          message: 'API unavailable'
        }
      }
      
      // Backend now returns data directly, not wrapped in news property
      return {
        success: response.success,
        data: { 
          news: response.data.data, 
          pagination: response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
        },
        message: response.message
      }
    } catch (error: any) {
      console.error('Failed to fetch news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      // Check if it's API unavailable error
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: { news: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
        message: 'API unavailable'
      }
    }
  }

  async getNewsItem(id: string): Promise<ApiResponse<News>> {
    try {
      const response = await apiService.get(`/news/${id}`) as ApiResponse<News>
      return response
    } catch (error: any) {
      console.error('Failed to fetch news item:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async createNews(newsData: Partial<News>): Promise<ApiResponse<News>> {
    try {
      const response = await apiService.post('/news', newsData) as ApiResponse<News>
      return response
    } catch (error: any) {
      console.error('Failed to create news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async updateNews(id: string, newsData: Partial<News>): Promise<ApiResponse<News>> {
    try {
      const response = await apiService.put(`/news/${id}`, newsData) as ApiResponse<News>
      return response
    } catch (error: any) {
      console.error('Failed to update news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async deleteNews(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/news/${id}`) as ApiResponse<void>
      return response
    } catch (error: any) {
      console.error('Failed to delete news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: undefined as any,
        message: 'API unavailable'
      }
    }
  }

  async bulkDeleteNews(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete('/news/bulk', { data: { ids } }) as ApiResponse<void>
      return response
    } catch (error: any) {
      console.error('Failed to bulk delete news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: undefined as any,
        message: 'API unavailable'
      }
    }
  }

  async updateNewsStatus(id: string, status: News['status']): Promise<ApiResponse<News>> {
    try {
      const response = await apiService.patch(`/news/${id}/status`, { status }) as ApiResponse<News>
      return response
    } catch (error: any) {
      console.error('Failed to update news status:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async getNewsCategories(): Promise<ApiResponse<NewsCategory[]>> {
    try {
      const response = await apiService.get('/news/categories') as ApiResponse<NewsCategory[]>
      return response
    } catch (error: any) {
      console.error('Failed to fetch news categories:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }

  async createNewsCategory(categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> {
    try {
      const response = await apiService.post('/news/categories', categoryData) as ApiResponse<NewsCategory>
      return response
    } catch (error: any) {
      console.error('Failed to create news category:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async updateNewsCategory(id: string, categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> {
    try {
      const response = await apiService.put(`/news/categories/${id}`, categoryData) as ApiResponse<NewsCategory>
      return response
    } catch (error: any) {
      console.error('Failed to update news category:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: null as any,
        message: 'API unavailable'
      }
    }
  }

  async deleteNewsCategory(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/news/categories/${id}`) as ApiResponse<void>
      return response
    } catch (error: any) {
      console.error('Failed to delete news category:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: undefined as any,
        message: 'API unavailable'
      }
    }
  }

  async getPublicNews(category?: string): Promise<ApiResponse<News[]>> {
    try {
      const params = category ? `?category=${category}` : ''
      const response = await apiService.get(`/news/public${params}`) as ApiResponse<News[]>
      return response
    } catch (error: any) {
      console.error('Failed to fetch public news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }

  async searchNews(query: string): Promise<ApiResponse<News[]>> {
    try {
      const response = await apiService.get(`/news/search?q=${encodeURIComponent(query)}`) as ApiResponse<News[]>
      return response
    } catch (error: any) {
      console.error('Failed to search news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }

  async getNewsByCategory(category: string): Promise<ApiResponse<News[]>> {
    try {
      const response = await apiService.get(`/news/category/${category}`) as ApiResponse<News[]>
      return response
    } catch (error: any) {
      console.error('Failed to fetch news by category:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }
}

// Моковые данные для демонстрации
const mockNews: News[] = [
  {
    id: '1',
    title: 'Новые требования к арбитражным управляющим в 2024 году',
    content: 'Полный текст новости о новых требованиях...',
    excerpt: 'С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим...',
    category: {
      id: '1',
      name: 'Законодательство',
      slug: 'legislation',
      color: '#3B82F6',
      icon: 'document-text',
      sortOrder: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'published',
    publishedAt: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    author: {
      id: '1',
      email: 'admin@sro-au.ru',
      name: 'Администратор СРО',
      role: UserRole.SUPER_ADMIN,
      permissions: ['*'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    imageUrl: '/images/news-1.jpg',
    seoTitle: 'Новые требования к арбитражным управляющим 2024',
    seoDescription: 'Обзор новых требований к арбитражным управляющим с 1 января 2024 года',
    seoKeywords: 'арбитражные управляющие, требования, 2024, СРО'
  },
  {
    id: '2',
    title: 'Семинар по повышению квалификации',
    content: 'Полный текст новости о семинаре...',
    excerpt: 'Приглашаем всех членов СРО на семинар по повышению квалификации...',
    category: {
      id: '2',
      name: 'Мероприятия',
      slug: 'events',
      color: '#10B981',
      icon: 'calendar',
      sortOrder: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'published',
    publishedAt: '2024-01-20T14:00:00Z',
    createdAt: '2024-01-20T13:00:00Z',
    updatedAt: '2024-01-20T13:00:00Z',
    author: {
      id: '1',
      email: 'admin@sro-au.ru',
      name: 'Администратор СРО',
      role: UserRole.SUPER_ADMIN,
      permissions: ['*'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    imageUrl: '/images/news-2.jpg'
  },
  {
    id: '3',
    title: 'Изменения в реестре арбитражных управляющих',
    content: 'Полный текст новости об изменениях в реестре...',
    excerpt: 'В реестр арбитражных управляющих внесены изменения...',
    category: {
      id: '3',
      name: 'Реестр',
      slug: 'registry',
      color: '#F59E0B',
      icon: 'users',
      sortOrder: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    status: 'draft',
    publishedAt: null,
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-01-25T11:00:00Z',
    author: {
      id: '1',
      email: 'admin@sro-au.ru',
      name: 'Администратор СРО',
      role: UserRole.SUPER_ADMIN,
      permissions: ['*'],
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  }
]

const mockNewsCategories: NewsCategory[] = [
  {
    id: '1',
    name: 'Законодательство',
    slug: 'legislation',
    color: '#3B82F6',
    icon: 'document-text',
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Мероприятия',
    slug: 'events',
    color: '#10B981',
    icon: 'calendar',
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Реестр',
    slug: 'registry',
    color: '#F59E0B',
    icon: 'users',
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Объявления',
    slug: 'announcements',
    color: '#EF4444',
    icon: 'megaphone',
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Создаем экземпляр сервиса с fallback на моковые данные
class NewsServiceWithFallback implements NewsService {
  private impl = new NewsServiceImpl()

  async getNews(filters?: NewsFilters & PaginationParams): Promise<ApiResponse<{ news: News[]; pagination: any }>> {
    try {
      return await this.impl.getNews(filters)
    } catch (error) {
      console.warn('API call failed, using mock data for getNews:', error)
      return {
        success: true,
        data: {
          news: mockNews,
          pagination: {
            page: 1,
            limit: 10,
            total: mockNews.length,
            totalPages: 1
          }
        }
      }
    }
  }

  async getNewsItem(id: string): Promise<ApiResponse<News>> {
    try {
      return await this.impl.getNewsItem(id)
    } catch (error) {
      console.warn('API call failed, using mock data for getNewsItem:', error)
      const newsItem = mockNews.find(n => n.id === id)
      return {
        success: true,
        data: newsItem || mockNews[0]
      }
    }
  }

  async createNews(newsData: Partial<News>): Promise<ApiResponse<News>> {
    try {
      return await this.impl.createNews(newsData)
    } catch (error) {
      console.warn('API call failed, using mock data for createNews:', error)
      return {
        success: true,
        data: null as any
      }
    }
  }

  async updateNews(id: string, newsData: Partial<News>): Promise<ApiResponse<News>> {
    try {
      return await this.impl.updateNews(id, newsData)
    } catch (error) {
      console.warn('API call failed, using mock data for updateNews:', error)
      return {
        success: true,
        data: null as any
      }
    }
  }

  async deleteNews(id: string): Promise<ApiResponse<void>> {
    try {
      return await this.impl.deleteNews(id)
    } catch (error) {
      console.warn('API call failed, using mock data for deleteNews:', error)
      return {
        success: true,
        data: undefined as any
      }
    }
  }

  async bulkDeleteNews(ids: string[]): Promise<ApiResponse<void>> {
    try {
      return await this.impl.bulkDeleteNews(ids)
    } catch (error) {
      console.warn('API call failed, using mock data for bulkDeleteNews:', error)
      return {
        success: true,
        data: undefined as any
      }
    }
  }

  async updateNewsStatus(id: string, status: News['status']): Promise<ApiResponse<News>> {
    try {
      return await this.impl.updateNewsStatus(id, status)
    } catch (error) {
      console.warn('API call failed, using mock data for updateNewsStatus:', error)
      return {
        success: true,
        data: null as any
      }
    }
  }

  async getNewsCategories(): Promise<ApiResponse<NewsCategory[]>> {
    try {
      return await this.impl.getNewsCategories()
    } catch (error) {
      console.warn('API call failed, using mock data for getNewsCategories:', error)
      return {
        success: true,
        data: mockNewsCategories
      }
    }
  }

  async createNewsCategory(categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> {
    try {
      return await this.impl.createNewsCategory(categoryData)
    } catch (error) {
      console.warn('API call failed, using mock data for createNewsCategory:', error)
      return {
        success: true,
        data: null as any
      }
    }
  }

  async updateNewsCategory(id: string, categoryData: Partial<NewsCategory>): Promise<ApiResponse<NewsCategory>> {
    try {
      return await this.impl.updateNewsCategory(id, categoryData)
    } catch (error) {
      console.warn('API call failed, using mock data for updateNewsCategory:', error)
      return {
        success: true,
        data: null as any
      }
    }
  }

  async deleteNewsCategory(id: string): Promise<ApiResponse<void>> {
    try {
      return await this.impl.deleteNewsCategory(id)
    } catch (error) {
      console.warn('API call failed, using mock data for deleteNewsCategory:', error)
      return {
        success: true,
        data: undefined as any
      }
    }
  }

  async getPublicNews(category?: string): Promise<ApiResponse<News[]>> {
    try {
      return await this.impl.getPublicNews(category)
    } catch (error) {
      console.warn('API call failed, using mock data for getPublicNews:', error)
      return {
        success: true,
        data: mockNews.filter(n => n.status === 'published')
      }
    }
  }

  async searchNews(query: string): Promise<ApiResponse<News[]>> {
    try {
      return await this.impl.searchNews(query)
    } catch (error) {
      console.warn('API call failed, using mock data for searchNews:', error)
      const searchResults = mockNews.filter(n => 
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        n.content?.toLowerCase().includes(query.toLowerCase())
      )
      return {
        success: true,
        data: searchResults
      }
    }
  }

  async getNewsByCategory(category: string): Promise<ApiResponse<News[]>> {
    try {
      return await this.impl.getNewsByCategory(category)
    } catch (error) {
      console.warn('API call failed, using mock data for getNewsByCategory:', error)
      const categoryResults = mockNews.filter(n => n.category.slug === category)
      return {
        success: true,
        data: categoryResults
      }
    }
  }
}

export const newsService = new NewsServiceWithFallback()