import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, PaginatedResponse, LoginCredentials, User, AuthState } from '@/types/admin'

class ApiService {
  private api: AxiosInstance
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh and network errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Handle network errors (server not running)
        if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.info('API server not available, using mock data')
          // Return a special error that won't be logged as an error
          const apiUnavailableError = new Error('API_UNAVAILABLE')
          apiUnavailableError.name = 'API_UNAVAILABLE'
          return Promise.reject(apiUnavailableError)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = this.getRefreshToken()
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              this.setTokens(response.data.token, response.data.refreshToken)
              originalRequest.headers.Authorization = `Bearer ${response.data.token}`
              return this.api(originalRequest)
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
      return localStorage.getItem('admin_token')
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

  // Auth methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthState>> {
    const response = await this.api.post('/auth/login', credentials)
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
    try {
      await this.api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/refresh', { refreshToken })
    return response.data
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/me')
    return response.data
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get(endpoint, config)
    return response.data
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(endpoint, data, config)
    return response.data
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put(endpoint, data, config)
    return response.data
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch(endpoint, data, config)
    return response.data
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete(endpoint, config)
    return response.data
  }

  // File upload
  async uploadFile(file: File, endpoint: string = '/files/upload'): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.api.post(endpoint, formData, {
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
    const response = await this.api.get(endpoint, { params })
    return response.data
  }

  // Batch operations
  async batchDelete(endpoint: string, ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
    const response = await this.api.delete(endpoint, { data: { ids } })
    return response.data
  }

  async batchUpdate(endpoint: string, updates: Array<{ id: string; data: any }>): Promise<ApiResponse<{ updated: number }>> {
    const response = await this.api.patch(endpoint, { updates })
    return response.data
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/health')
      return true
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
