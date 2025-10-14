import api from '@/lib/api'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface RegistryFilters {
  search?: string
  region?: string
  status?: 'active' | 'excluded' | 'suspended'
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

export interface RegistryStats {
  total: number
  active: number
  excluded: number
  suspended: number
}

export interface ArbitratorListItem {
  id: string
  fullName: string
  inn: string
  registryNumber: string
  region?: string
  status: 'active'|'excluded'|'suspended'
}

export const registryService = {
  async list(filters: RegistryFilters = {}): Promise<ApiResponse<PaginatedResponse<ArbitratorListItem>>> {
    const params: any = {}
    if (filters.search) params.search = filters.search
    if (filters.region) params.region = filters.region
    if (filters.status) params.status = filters.status
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder
    const res = await api.get(`/registry`, { params })
    const data = Array.isArray(res.data) ? res.data.map((r: any) => ({
      id: r.id || r._id,
      fullName: r.fullName,
      inn: r.inn,
      registryNumber: r.registryNumber,
      region: r.region,
      status: r.status,
    })) : []
    const pagination = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    return { success: true, data: { data, pagination } }
  },
  async stats(): Promise<ApiResponse<RegistryStats>> {
    return api.get<RegistryStats>(`/registry/statistics`)
  }
}

export type RegistryService = typeof registryService


