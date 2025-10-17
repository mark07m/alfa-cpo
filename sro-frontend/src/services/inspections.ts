import api from '@/lib/api'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface InspectionListItem {
  id: string
  managerId: string
  managerName?: string
  managerInn?: string
  managerRegion?: string
  type: 'planned' | 'unplanned'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledDate: string
  completedDate?: string
  inspector: string
  result?: 'passed' | 'failed' | 'needs_improvement'
  notes?: string
  documentsCount?: number
  violations?: string[]
  recommendations?: string[]
}

export interface InspectionStats {
  total: number
  planned: number
  unplanned: number
  scheduled: number
  inProgress: number
  completed: number
  passed: number
  failed: number
  needsImprovement: number
}

export interface InspectionFilters {
  managerId?: string
  type?: 'planned' | 'unplanned'
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  inspector?: string
  result?: 'passed' | 'failed' | 'needs_improvement'
  scheduledDateFrom?: string
  scheduledDateTo?: string
  completedDateFrom?: string
  completedDateTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

function normalizeInspection(i: any): InspectionListItem {
  const manager = i.managerId || {}
  return {
    id: i.id || i._id,
    managerId: typeof i.managerId === 'string' ? i.managerId : (i.managerId?._id || ''),
    managerName: manager.fullName,
    managerInn: manager.inn,
    managerRegion: manager.region,
    type: i.type,
    status: i.status,
    scheduledDate: i.scheduledDate,
    completedDate: i.completedDate,
    inspector: i.inspector,
    result: i.result,
    notes: i.notes,
    documentsCount: Array.isArray(i.documents) ? i.documents.length : 0,
    violations: Array.isArray(i.violations) ? i.violations.map((v: any) => v?.description || String(v)) : [],
    recommendations: Array.isArray(i.recommendations) ? i.recommendations : [],
  }
}

export const inspectionsService = {
  async list(filters: InspectionFilters = {}): Promise<ApiResponse<PaginatedResponse<InspectionListItem>>> {
    const params: any = {}
    if (filters.managerId) params.managerId = filters.managerId
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status
    if (filters.inspector) params.inspector = filters.inspector
    if (filters.result) params.result = filters.result
    if (filters.scheduledDateFrom) params.scheduledDateFrom = filters.scheduledDateFrom
    if (filters.scheduledDateTo) params.scheduledDateTo = filters.scheduledDateTo
    if (filters.completedDateFrom) params.completedDateFrom = filters.completedDateFrom
    if (filters.completedDateTo) params.completedDateTo = filters.completedDateTo
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    // Prefer public endpoints if available
    const res = await api.get(`/public/inspections`, { params })
    const items = Array.isArray(res.data) ? res.data.map(normalizeInspection) : []
    const pagination = res.pagination || { page: params.page || 1, limit: params.limit || 10, total: 0, totalPages: 0 }
    return { success: true, data: { data: items, pagination } }
  },

  async statistics(): Promise<ApiResponse<InspectionStats>> {
    return api.get<InspectionStats>(`/public/inspections/statistics`)
  },
}

export type InspectionsService = typeof inspectionsService


