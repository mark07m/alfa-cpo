import { apiService } from './api'
import { News, NewsCategory, NewsFilters, PaginationParams, ApiResponse, UserRole } from '@/types/admin'
import { mockNewsCategories, mockNews } from '@/data/mockData'

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
  getStats(): Promise<ApiResponse<{ total: number; published: number; draft: number; archived: number; byCategory: Array<{ id: string; name: string; count: number }> }>>
}

class NewsServiceImpl implements NewsService {
  private sanitizePayload<T extends Record<string, any>>(obj: T): T {
    const entries = Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
    return Object.fromEntries(entries) as T
  }

  private async getFeaturedPublishedCount(): Promise<number> {
    try {
      const response = await apiService.get<{ data: any[] } & { pagination?: any }>(`/news?featured=true&status=published&page=1&limit=1`)
      return (response as any)?.pagination?.total ?? 0
    } catch {
      return 0
    }
  }
  async getNews(filters: NewsFilters & PaginationParams = { page: 1, limit: 10 }): Promise<ApiResponse<{ news: News[]; pagination: any }>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if ((filters as any).featured !== undefined) params.append('featured', (filters as any).featured.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await apiService.get(`/news?${params.toString()}`) as ApiResponse<News[]> & { pagination?: any }
      console.log('News service response:', response) // Debug log
      
      // Ensure we always return a valid response
      if (!response || !response.data) {
        return {
          success: false,
          data: { news: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
          message: 'API unavailable'
        }
      }
      
      // Backend returns data in format { data: [...], pagination: {...} }
      // Transform API data to match frontend News interface
      const transformedNews = response.data.map((newsItem: any) => ({
        id: newsItem._id || newsItem.id,
        title: newsItem.title,
        content: newsItem.content,
        excerpt: newsItem.excerpt,
        category: newsItem.category ? {
          id: newsItem.category._id || newsItem.category.id,
          name: newsItem.category.name,
          slug: newsItem.category.slug,
          color: newsItem.category.color || '#6B7280',
          icon: newsItem.category.icon || 'document-text',
          sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
          createdAt: newsItem.category.createdAt || new Date().toISOString(),
          updatedAt: newsItem.category.updatedAt || new Date().toISOString()
        } : {
          id: 'default',
          name: 'Без категории',
          slug: 'uncategorized',
          color: '#6B7280',
          icon: 'document-text',
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: newsItem.status,
        publishedAt: newsItem.publishedAt,
        createdAt: newsItem.createdAt,
        updatedAt: newsItem.updatedAt,
        author: newsItem.author ? {
          id: newsItem.author._id || newsItem.author.id || 'unknown',
          email: newsItem.author.email || 'unknown@example.com',
          name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
          role: newsItem.author.role || 'EDITOR' as any,
          permissions: newsItem.author.permissions || [],
          isActive: newsItem.author.isActive !== false,
          createdAt: newsItem.author.createdAt || new Date().toISOString(),
          updatedAt: newsItem.author.updatedAt || new Date().toISOString()
        } : {
          id: newsItem.createdBy || 'unknown',
          email: 'unknown@example.com',
          name: 'Неизвестный автор',
          role: 'EDITOR' as any,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        imageUrl: newsItem.imageUrl,
        featured: !!newsItem.featured,
        seoTitle: newsItem.seoTitle,
        seoDescription: newsItem.seoDescription,
        seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
      }))

      return {
        success: response.success,
        data: { 
          news: transformedNews, 
          pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
        },
        message: response.message
      }
    } catch (error: any) {
      console.error('Failed to fetch news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      // Do NOT fallback to mocks on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error
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
      
      // Transform the response data to match frontend News interface
      if (response.data) {
        const newsItem = response.data as any
        const transformedNews: News = {
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          featured: !!newsItem.featured,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
      return response
    } catch (error: any) {
      console.error('Failed to fetch news item:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error
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
      // Transform frontend News data to backend CreateNewsDto format
      const createData = this.sanitizePayload({
        title: newsData.title,
        content: newsData.content,
        excerpt: newsData.excerpt,
        publishedAt: newsData.publishedAt,
        category: newsData.category?.id !== 'default' ? newsData.category?.id : undefined,
        tags: newsData.seoKeywords ? newsData.seoKeywords.split(',').map(tag => tag.trim()) : [],
        featured: newsData.featured === true,
        imageUrl: newsData.imageUrl,
        cover: newsData.imageUrl, // Map imageUrl to cover
        status: newsData.status || 'draft',
        seoTitle: newsData.seoTitle,
        seoDescription: newsData.seoDescription,
        seoKeywords: newsData.seoKeywords ? newsData.seoKeywords.split(',').map(keyword => keyword.trim()) : []
      })

      const response = await apiService.post('/news', createData) as ApiResponse<News>
      
      // Transform response back to frontend format
      if (response.data) {
        const newsItem = response.data as any
        const transformedNews: News = {
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          featured: !!newsItem.featured,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
      return response
    } catch (error: any) {
      console.error('Failed to create news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      const backendMessage = (error?.response?.data?.message && Array.isArray(error.response.data.message))
        ? error.response.data.message.join(', ')
        : (error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Не удалось создать новость')
      return {
        success: false,
        data: null as any,
        message: backendMessage
      }
    }
  }

  async updateNews(id: string, newsData: Partial<News>): Promise<ApiResponse<News>> {
    try {
      // Transform frontend News data to backend UpdateNewsDto format
      const updateDataRaw = {
        title: newsData.title,
        content: newsData.content,
        excerpt: newsData.excerpt,
        publishedAt: newsData.publishedAt,
        category: newsData.category?.id !== 'default' ? newsData.category?.id : undefined,
        tags: newsData.seoKeywords ? newsData.seoKeywords.split(',').map(tag => tag.trim()) : [],
        featured: newsData.featured,
        imageUrl: newsData.imageUrl,
        cover: newsData.imageUrl, // Map imageUrl to cover
        status: newsData.status,
        seoTitle: newsData.seoTitle,
        seoDescription: newsData.seoDescription,
        seoKeywords: newsData.seoKeywords ? newsData.seoKeywords.split(',').map(keyword => keyword.trim()) : []
      }

      const updateData = this.sanitizePayload(updateDataRaw)

      // Client-side pre-check for featured limit to avoid backend 400
      if (updateData.featured === true || updateData.status === 'published') {
        try {
          const existingResp = await apiService.get(`/news/${id}`) as ApiResponse<any>
          const current: any = existingResp.data || {}
          const nextFeatured = typeof updateData.featured === 'boolean' ? updateData.featured : !!current.featured
          const nextStatus = updateData.status || current.status
          const wasFeaturedPublished = !!current.featured && current.status === 'published'
          if (nextFeatured && nextStatus === 'published' && !wasFeaturedPublished) {
            const count = await this.getFeaturedPublishedCount()
            if (count >= 4) {
              return { success: false, data: null as any, message: 'Достигнут лимит важных новостей (макс. 4)' }
            }
          }
        } catch {
          // ignore pre-check errors; backend will validate
        }
      }

      const response = await apiService.patch(`/news/${id}`, updateData) as ApiResponse<News>
      
      // Transform response back to frontend format
      if (response.data) {
        const newsItem = response.data as any
        const transformedNews: News = {
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          featured: !!newsItem.featured,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
      return response
    } catch (error: any) {
      console.error('Failed to update news:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      const backendMessage = (error?.response?.data?.message && Array.isArray(error.response.data.message))
        ? error.response.data.message.join(', ')
        : (error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Не удалось обновить новость')
      return {
        success: false,
        data: null as any,
        message: backendMessage
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
      const backendMessage = (error?.response?.data?.message && Array.isArray(error.response.data.message))
        ? error.response.data.message.join(', ')
        : (error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Не удалось обновить статус новости')
      return {
        success: false,
        data: null as any,
        message: backendMessage
      }
    }
  }

  async getNewsCategories(): Promise<ApiResponse<NewsCategory[]>> {
    try {
      const response = await apiService.get('/news/categories') as ApiResponse<NewsCategory[]>
      // Backend returns data in format { data: [...] }
      // Transform API data to match frontend NewsCategory interface
      const transformedCategories = response.data.map((category: any) => ({
        id: category._id || category.id,
        name: category.name,
        slug: category.slug,
        color: category.color || '#6B7280',
        icon: category.icon || 'document-text',
        sortOrder: category.sortOrder || category.order || 0,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }))

      return {
        success: response.success,
        data: transformedCategories,
        message: response.message
      }
    } catch (error: any) {
      console.error('Failed to fetch news categories:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by NewsServiceWithFallback
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error
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
      // Transform frontend NewsCategory data to backend CreateNewsCategoryDto format
      const createData = {
        name: categoryData.name,
        slug: categoryData.slug,
        color: categoryData.color || '#6B7280',
        icon: categoryData.icon || 'document-text',
        sortOrder: categoryData.sortOrder || 0
      }

      const response = await apiService.post('/news/categories', createData) as ApiResponse<NewsCategory>
      
      // Transform response back to frontend format
      if (response.data) {
        const category = response.data as any
        const transformedCategory: NewsCategory = {
          id: category._id || category.id,
          name: category.name,
          slug: category.slug,
          color: category.color || '#6B7280',
          icon: category.icon || 'document-text',
          sortOrder: category.sortOrder || category.order || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
        
        return {
          success: response.success,
          data: transformedCategory,
          message: response.message
        }
      }
      
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
      // Transform frontend NewsCategory data to backend UpdateNewsCategoryDto format
      const updateData = {
        name: categoryData.name,
        slug: categoryData.slug,
        color: categoryData.color || '#6B7280',
        icon: categoryData.icon || 'document-text',
        sortOrder: categoryData.sortOrder || 0
      }

      const response = await apiService.put(`/news/categories/${id}`, updateData) as ApiResponse<NewsCategory>
      
      // Transform response back to frontend format
      if (response.data) {
        const category = response.data as any
        const transformedCategory: NewsCategory = {
          id: category._id || category.id,
          name: category.name,
          slug: category.slug,
          color: category.color || '#6B7280',
          icon: category.icon || 'document-text',
          sortOrder: category.sortOrder || category.order || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }
        
        return {
          success: response.success,
          data: transformedCategory,
          message: response.message
        }
      }
      
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
      
      // Transform response data to match frontend News interface
      if (response.data) {
        const transformedNews = response.data.map((newsItem: any) => ({
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }))
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
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
      
      // Transform response data to match frontend News interface
      if (response.data) {
        const transformedNews = response.data.map((newsItem: any) => ({
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }))
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
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
      
      // Transform response data to match frontend News interface
      if (response.data) {
        const transformedNews = response.data.map((newsItem: any) => ({
          id: newsItem._id || newsItem.id,
          title: newsItem.title,
          content: newsItem.content,
          excerpt: newsItem.excerpt,
          category: newsItem.category ? {
            id: newsItem.category._id || newsItem.category.id,
            name: newsItem.category.name,
            slug: newsItem.category.slug,
            color: newsItem.category.color || '#6B7280',
            icon: newsItem.category.icon || 'document-text',
            sortOrder: newsItem.category.sortOrder || newsItem.category.order || 0,
            createdAt: newsItem.category.createdAt || new Date().toISOString(),
            updatedAt: newsItem.category.updatedAt || new Date().toISOString()
          } : {
            id: 'default',
            name: 'Без категории',
            slug: 'uncategorized',
            color: '#6B7280',
            icon: 'document-text',
            sortOrder: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          status: newsItem.status,
          publishedAt: newsItem.publishedAt,
          createdAt: newsItem.createdAt,
          updatedAt: newsItem.updatedAt,
          author: newsItem.author ? {
            id: newsItem.author._id || newsItem.author.id || 'unknown',
            email: newsItem.author.email || 'unknown@example.com',
            name: newsItem.author.name || newsItem.author.firstName + ' ' + newsItem.author.lastName || 'Неизвестный автор',
            role: newsItem.author.role || 'EDITOR' as any,
            permissions: newsItem.author.permissions || [],
            isActive: newsItem.author.isActive !== false,
            createdAt: newsItem.author.createdAt || new Date().toISOString(),
            updatedAt: newsItem.author.updatedAt || new Date().toISOString()
          } : {
            id: newsItem.createdBy || 'unknown',
            email: 'unknown@example.com',
            name: 'Неизвестный автор',
            role: 'EDITOR' as any,
            permissions: [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          imageUrl: newsItem.imageUrl,
          seoTitle: newsItem.seoTitle,
          seoDescription: newsItem.seoDescription,
          seoKeywords: Array.isArray(newsItem.seoKeywords) 
          ? newsItem.seoKeywords.join(', ') 
          : newsItem.seoKeywords || ''
        }))
        
        return {
          success: response.success,
          data: transformedNews,
          message: response.message
        }
      }
      
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

  async getStats(): Promise<ApiResponse<{ total: number; published: number; draft: number; archived: number; byCategory: Array<{ id: string; name: string; count: number }> }>> {
    try {
      // Fetch minimal data to compute stats efficiently
      const [allRes, publishedRes, draftRes, archivedRes, categoriesRes] = await Promise.all([
        apiService.get<{ data: any[]; pagination: any }>(`/news?page=1&limit=1`),
        apiService.get<{ data: any[]; pagination: any }>(`/news?status=published&page=1&limit=1`),
        apiService.get<{ data: any[]; pagination: any }>(`/news?status=draft&page=1&limit=1`),
        apiService.get<{ data: any[]; pagination: any }>(`/news?status=archived&page=1&limit=1`),
        this.getNewsCategories(),
      ])

      const total = (allRes as any)?.pagination?.total ?? 0
      const published = (publishedRes as any)?.pagination?.total ?? 0
      const draft = (draftRes as any)?.pagination?.total ?? 0
      const archived = (archivedRes as any)?.pagination?.total ?? 0
      const categories = (categoriesRes?.data || []) as any[]

      // Compute per-category counts with lightweight queries (page=1&limit=1 to read total)
      const byCategory = await Promise.all(categories.map(async (cat: any) => {
        const res = await apiService.get<{ data: any[]; pagination: any }>(`/news?category=${cat.id}&page=1&limit=1`)
        const count = (res as any)?.pagination?.total ?? 0
        return { id: cat.id, name: cat.name, count }
      }))

      return {
        success: true,
        data: { total, published, draft, archived, byCategory },
      }
    } catch (error: any) {
      // Fallback: compute from mock data
      const all = (mockNews || []) as any[]
      const total = all.length
      const published = all.filter(n => n.status === 'published').length
      const draft = all.filter(n => n.status === 'draft').length
      const archived = all.filter(n => n.status === 'archived').length
      // Mock categories
      const cats = (mockNewsCategories || []) as any[]
      const byCategory = cats.map(c => ({ id: c.id, name: c.name, count: all.filter(n => n.category?.id === c.id).length }))
      return { success: true, data: { total, published, draft, archived, byCategory } }
    }
  }
}

// Моковые данные для демонстрации


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

  async getStats(): Promise<ApiResponse<{ total: number; published: number; draft: number; archived: number; byCategory: Array<{ id: string; name: string; count: number }> }>> {
    try {
      return await this.impl.getStats()
    } catch (error) {
      const all = (mockNews || []) as any[]
      const total = all.length
      const published = all.filter(n => n.status === 'published').length
      const draft = all.filter(n => n.status === 'draft').length
      const archived = all.filter(n => n.status === 'archived').length
      const cats = (mockNewsCategories || []) as any[]
      const byCategory = cats.map(c => ({ id: c.id, name: c.name, count: all.filter(n => n.category?.id === c.id).length }))
      return { success: true, data: { total, published, draft, archived, byCategory } }
    }
  }
}

export const newsService = new NewsServiceWithFallback()