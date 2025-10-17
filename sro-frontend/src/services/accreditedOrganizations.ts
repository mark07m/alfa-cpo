import api from '@/lib/api'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface AccreditedOrganizationItem {
  id: string
  name: string
  type?: string
  accreditationDate?: string
  accreditationExpiryDate?: string
  status: 'active' | 'suspended' | 'revoked' | 'expired'
}

export interface AccreditedOrganizationStats {
  total: number
  active: number
  suspended: number
  revoked: number
  expired: number
}

export interface AccreditedOrgFilters {
  search?: string
  status?: 'active' | 'suspended' | 'revoked' | 'expired'
  accreditationType?: string
  region?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

function normalizeItem(raw: any): AccreditedOrganizationItem {
  return {
    id: raw.id || raw._id,
    name: raw.name,
    type: raw.accreditationType,
    accreditationDate: raw.accreditationDate,
    accreditationExpiryDate: raw.accreditationExpiryDate,
    status: raw.status,
  }
}

export const accreditedOrganizationsService = {
  async list(filters: AccreditedOrgFilters = {}): Promise<ApiResponse<PaginatedResponse<AccreditedOrganizationItem>>> {
    const params: any = {}
    if (filters.search) params.search = filters.search
    if (filters.status) params.status = filters.status
    if (filters.accreditationType) params.accreditationType = filters.accreditationType
    if (filters.region) params.region = filters.region
    if (filters.dateFrom) params.dateFrom = filters.dateFrom
    if (filters.dateTo) params.dateTo = filters.dateTo
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    const res = await api.get(`/accredited-organizations`, { params })
    const data = Array.isArray(res.data) ? res.data.map(normalizeItem) : []
    const pagination = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    return { success: true, data: { data, pagination } }
  },

  async stats(): Promise<ApiResponse<AccreditedOrganizationStats>> {
    return api.get<AccreditedOrganizationStats>(`/accredited-organizations/stats`)
  },
}

export type AccreditedOrganizationsService = typeof accreditedOrganizationsService


