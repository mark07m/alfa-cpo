import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, PaginatedResponse, LoginCredentials, User, ApiUser, AuthState, UserRole } from '@/types/admin'
import { mockUsers, mockEvents, mockNews, mockDocuments, mockPages } from '@/data/mockData'

class ApiService {
  private api: AxiosInstance | null = null
  private baseURL: string
  private useMockData: boolean

  constructor() {
    // Используем backend API напрямую
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'
    this.useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
    
    // В моковом режиме не создаем axios instance
    if (!this.useMockData) {
      this.api = axios.create({
        baseURL: this.baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      this.setupInterceptors()
    }
  }

  private setupInterceptors() {
    if (!this.api) return
    
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('🔍 API request interceptor - adding token:', token.substring(0, 20) + '...');
          console.log('🔍 API request interceptor - request URL:', config.url);
          console.log('🔍 API request interceptor - request method:', config.method);
        } else {
          console.warn('🔍 API request interceptor - NO TOKEN FOUND! Request will fail with 403');
          console.log('🔍 API request interceptor - request URL:', config.url);
          console.log('🔍 API request interceptor - request method:', config.method);
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh and network errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('API response interceptor - success:', response.status, response.config.url);
        return response;
      },
      async (error) => {
        const originalRequest = error.config

        // Handle 404 errors - let services handle them (e.g., for uniqueness checks)
        if (error.response?.status === 404) {
          // Don't log 404 errors as they are expected for uniqueness checks
          return Promise.reject(error)
        }

        // Handle network errors (server not running)
        if (error.code === 'NETWORK_ERROR' || 
            error.message === 'Network Error' || 
            error.code === 'ECONNREFUSED' ||
            error.code === 'ERR_NETWORK' ||
            error.code === 'EADDRINUSE' ||
            error.response?.status === 400 ||
            error.response?.status === 503 ||
            !error.response) {
          console.info('API server not available, services will use mock data')
          // Just log and let services handle the fallback
          return Promise.reject(error)
        }

        // Log other errors
        console.error('API response interceptor - error:', error);

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = this.getRefreshToken()
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              this.setTokens(response.data.token, response.data.refreshToken)
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`
              return this.api!(originalRequest)
            }
          } catch (refreshError) {
            this.clearTokens()
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      console.log('🔍 ApiService.getToken():', token ? token.substring(0, 20) + '...' : 'NOT FOUND')
      return token
    }
    return null
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_refresh_token')
    }
    return null
  }

  private setTokens(token: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_refresh_token', refreshToken)
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_refresh_token')
    }
  }

  private getMockData<T>(endpoint: string): ApiResponse<T> {
    // Простая логика для возврата моковых данных по эндпоинту
    let data: any = []
    
    if (endpoint.includes('/users')) {
      data = mockUsers
    } else if (endpoint.includes('/events')) {
      data = mockEvents
    } else if (endpoint.includes('/news')) {
      data = mockNews
    } else if (endpoint.includes('/documents')) {
      data = mockDocuments
    } else if (endpoint.includes('/pages')) {
      data = mockPages
    } else if (endpoint.includes('/dashboard/activities')) {
      // Для эндпоинта activities возвращаем массив напрямую
      data = [
        {
          id: '1',
          type: 'news',
          action: 'created',
          title: 'Новая статья о банкротстве',
          user: { name: 'Иван Петров', id: '1' },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'Статья о новых изменениях в законодательстве'
        },
        {
          id: '2',
          type: 'arbitrator',
          action: 'updated',
          title: 'Обновлены данные управляющего',
          user: { name: 'Мария Сидорова', id: '2' },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'Изменены контактные данные'
        },
        {
          id: '3',
          type: 'event',
          action: 'created',
          title: 'Семинар по новому законодательству',
          user: { name: 'Алексей Козлов', id: '3' },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          details: 'Планируется на 15 января 2025'
        }
      ]
    } else if (endpoint.includes('/dashboard/activity-chart')) {
      // Для эндпоинта activity-chart возвращаем данные для графика
      data = this.generateMockChartData()
    } else if (endpoint.includes('/dashboard') || endpoint.includes('/stats')) {
      // Моковые данные для дашборда
      data = {
        totalUsers: mockUsers.length,
        totalEvents: mockEvents.length,
        totalNews: mockNews.length,
        totalDocuments: mockDocuments.length,
        statistics: {
          users: { total: mockUsers.length, active: mockUsers.filter(u => u.isActive).length },
          events: { total: mockEvents.length, upcoming: mockEvents.filter(e => new Date(e.startDate) > new Date()).length },
          news: { total: mockNews.length, published: mockNews.filter(n => n.publishedAt).length },
          documents: { total: mockDocuments.length }
        }
      }
    }

    return {
      success: true,
      data: data as T,
      message: 'Mock data'
    }
  }

  private generateMockChartData(): any[] {
    const data = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        news: Math.floor(Math.random() * 10) + 1,
        events: Math.floor(Math.random() * 5) + 1,
        documents: Math.floor(Math.random() * 15) + 3,
        users: Math.floor(Math.random() * 8) + 2
      })
    }
    
    return data
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthState>> {
    if (this.useMockData) {
      throw new Error('MOCK_MODE')
    }
    
    const response = await this.api!.post('/auth/login', credentials)
    const { token, refreshToken, user } = response.data.data
    
    this.setTokens(token, refreshToken)
    
    return {
      success: true,
      data: {
        user,
        token,
        refreshToken,
        isAuthenticated: true,
        isLoading: false
      }
    }
  }

  async logout(): Promise<void> {
    if (this.useMockData) {
      this.clearTokens()
      return
    }
    
    try {
      const refreshToken = this.getRefreshToken()
      if (refreshToken) {
        await this.api!.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    if (this.useMockData) {
      throw new Error('MOCK_MODE')
    }
    
    const response = await this.api!.post('/auth/refresh', { refreshToken })
    return response.data
  }

  async getCurrentUser(): Promise<ApiResponse<ApiUser>> {
    if (this.useMockData) {
      throw new Error('MOCK_MODE')
    }
    
    try {
      const response = await this.api!.get('/auth/profile')
      // Backend возвращает сырые данные, оборачиваем в ApiResponse
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.log('getCurrentUser error:', error)
      // Если API недоступен, возвращаем моковые данные
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        console.info('API unavailable, returning mock user')
        const mockUser: ApiUser = {
          _id: '1',
          email: 'admin@sro-au.ru',
          name: 'Администратор Системы',
          role: UserRole.SUPER_ADMIN,
          permissions: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return {
          success: true,
          data: mockUser,
          message: 'Mock data'
        }
      }
      throw error
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.useMockData) {
      return this.getMockData<T>(endpoint)
    }
    
    console.log('API GET request to:', endpoint, 'with config:', config);
    try {
      const response = await this.api!.get(endpoint, config)
      console.log('API GET response:', response.data);
      // Если ответ уже содержит data и pagination, возвращаем как есть
      if (response.data && (response.data.data || response.data.pagination)) {
        return response.data
      }
      // Иначе оборачиваем в стандартный формат
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      // Don't log 404 errors as they are expected for uniqueness checks
      if (error.response?.status !== 404) {
        console.error('API GET error:', error);
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.useMockData) {
      return this.getMockData<T>(endpoint)
    }
    
    const response = await this.api!.post(endpoint, data, config)
    // Если ответ уже содержит data, возвращаем как есть
    if (response.data && response.data.data) {
      return response.data
    }
    // Иначе оборачиваем в стандартный формат
    return {
      success: true,
      data: response.data
    }
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.useMockData) {
      return this.getMockData<T>(endpoint)
    }
    
    const response = await this.api!.put(endpoint, data, config)
    // Если ответ уже содержит data, возвращаем как есть
    if (response.data && response.data.data) {
      return response.data
    }
    // Иначе оборачиваем в стандартный формат
    return {
      success: true,
      data: response.data
    }
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    console.log('🔍 ApiService.patch: useMockData =', this.useMockData, 'endpoint =', endpoint)
    if (this.useMockData) {
      console.log('🔍 ApiService.patch: using mock data')
      return this.getMockData<T>(endpoint)
    }
    
    console.log('🔍 ApiService.patch: making real API call to', endpoint)
    const response = await this.api!.patch(endpoint, data, config)
    // Если ответ уже содержит data, возвращаем как есть
    if (response.data && response.data.data) {
      return response.data
    }
    // Иначе оборачиваем в стандартный формат
    return {
      success: true,
      data: response.data
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.useMockData) {
      return this.getMockData<T>(endpoint)
    }
    
    const response = await this.api!.delete(endpoint, config)
    // Если ответ уже содержит data, возвращаем как есть
    if (response.data && response.data.data) {
      return response.data
    }
    // Иначе оборачиваем в стандартный формат
    return {
      success: true,
      data: response.data
    }
  }

  // File upload
  async uploadFile(file: File, endpoint: string = '/files/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    if (this.useMockData) {
      return {
        success: true,
        data: {
          url: `/uploads/${file.name}`,
          filename: file.name
        },
        message: 'Mock data'
      }
    }
    
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.api!.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params: {
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
      search?: string
      filters?: Record<string, any>
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    if (this.useMockData) {
      const mockResponse = this.getMockData<T[]>(endpoint)
      return {
        success: true,
        data: {
          data: mockResponse.data as T[],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: (mockResponse.data as T[]).length,
            totalPages: Math.ceil((mockResponse.data as T[]).length / (params.limit || 10))
          }
        },
        message: 'Mock data'
      }
    }
    
    const response = await this.api!.get(endpoint, { params })
    return response.data
  }

  // Batch operations
  async batchDelete(endpoint: string, ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
    if (this.useMockData) {
      return {
        success: true,
        data: { deleted: ids.length },
        message: 'Mock data'
      }
    }
    
    const response = await this.api!.delete(endpoint, { data: { ids } })
    return response.data
  }

  async batchUpdate(endpoint: string, updates: Array<{ id: string; data: any }>): Promise<ApiResponse<{ updated: number }>> {
    if (this.useMockData) {
      return {
        success: true,
        data: { updated: updates.length },
        message: 'Mock data'
      }
    }
    
    const response = await this.api!.patch(endpoint, { updates })
    return response.data
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    if (this.useMockData) {
      return false // В моковом режиме API недоступен
    }
    
    try {
      await this.api!.get('/health')
      return true
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
