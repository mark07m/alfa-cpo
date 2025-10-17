import api from '@/lib/api'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface DisciplinaryMeasureListItem {
  id: string
  managerId: string
  managerName?: string
  managerInn?: string
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other'
  reason: string
  date: string
  decisionNumber: string
  status: 'active' | 'cancelled' | 'expired'
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
  appealNotes?: string
  appealDate?: string
  appealDecision?: string
}

export interface DisciplinaryStats {
  total: number
  warning: number
  reprimand: number
  exclusion: number
  suspension: number
  other: number
  active: number
  cancelled: number
  expired: number
  withAppeal: number
  appealSubmitted: number
  appealApproved: number
  appealRejected: number
}

export interface DisciplinaryFilters {
  managerId?: string
  type?: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other'
  status?: 'active' | 'cancelled' | 'expired'
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
  decisionNumber?: string
  dateFrom?: string
  dateTo?: string
  appealDeadlineFrom?: string
  appealDeadlineTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

function normalizeMeasure(m: any): DisciplinaryMeasureListItem {
  const manager = m.managerId || {}
  return {
    id: m.id || m._id,
    managerId: typeof m.managerId === 'string' ? m.managerId : (m.managerId?._id || ''),
    managerName: manager.fullName,
    managerInn: manager.inn,
    type: m.type,
    reason: m.reason,
    date: m.date,
    decisionNumber: m.decisionNumber,
    status: m.status,
    appealStatus: m.appealStatus,
    appealNotes: m.appealNotes,
    appealDate: m.appealDate,
    appealDecision: m.appealDecision,
  }
}

export const disciplinaryMeasuresService = {
  async list(filters: DisciplinaryFilters = {}): Promise<ApiResponse<PaginatedResponse<DisciplinaryMeasureListItem>>> {
    const params: any = {}
    if (filters.managerId) params.managerId = filters.managerId
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status
    if (filters.appealStatus) params.appealStatus = filters.appealStatus
    if (filters.decisionNumber) params.decisionNumber = filters.decisionNumber
    if (filters.dateFrom) params.dateFrom = filters.dateFrom
    if (filters.dateTo) params.dateTo = filters.dateTo
    if (filters.appealDeadlineFrom) params.appealDeadlineFrom = filters.appealDeadlineFrom
    if (filters.appealDeadlineTo) params.appealDeadlineTo = filters.appealDeadlineTo
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    const res = await api.get(`/public/disciplinary-measures`, { params })
    const items = Array.isArray(res.data) ? res.data.map(normalizeMeasure) : []
    const pagination = res.pagination || { page: params.page || 1, limit: params.limit || 10, total: 0, totalPages: 0 }
    return { success: true, data: { data: items, pagination } }
  },

  async statistics(): Promise<ApiResponse<DisciplinaryStats>> {
    return api.get<DisciplinaryStats>(`/public/disciplinary-measures/statistics`)
  },
}

export type DisciplinaryMeasuresService = typeof disciplinaryMeasuresService


