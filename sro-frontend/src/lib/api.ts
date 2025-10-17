import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ApiResponse, PaginatedResponse } from '@/types'
import { API_BASE_URL } from '@/constants'

class FrontendApiClient {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({ baseURL: API_BASE_URL, timeout: 10000, withCredentials: true })
  }

  async get<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.api.get(path, config)
    // Backend already returns unified envelope
    if (res.data && (res.data.data !== undefined || res.data.success !== undefined)) return res.data
    return { success: true, data: res.data as T }
  }

  async post<T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const res = await this.api.post(path, data, config)
    if (res.data && (res.data.data !== undefined || res.data.success !== undefined)) return res.data
    return { success: true, data: res.data as T }
  }

  async getPaginated<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<PaginatedResponse<T>>> {
    const res = await this.api.get(path, { params })
    return res.data
  }
}

export const api = new FrontendApiClient()
export default api


