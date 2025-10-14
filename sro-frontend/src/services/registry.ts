import api from '@/lib/api'
import { ApiResponse, PaginatedResponse, ArbitraryManager } from '@/types'

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

function toIso(dateLike: any): string | undefined {
  if (!dateLike) return undefined
  try {
    const d = new Date(dateLike)
    if (isNaN(d.getTime())) return String(dateLike)
    return d.toISOString()
  } catch {
    return String(dateLike)
  }
}

function normalizeManagerDetail(r: any): ArbitraryManager {
  const insurance = r.insurance ? (() => {
    const parts: string[] = []
    if (r.insurance.contractNumber) parts.push(`Полис №${r.insurance.contractNumber}`)
    const dates: string[] = []
    if (r.insurance.startDate) dates.push(toIso(r.insurance.startDate)!)
    if (r.insurance.endDate) dates.push(toIso(r.insurance.endDate)!)
    if (dates.length) parts.push(`${dates.join(' - ')}`)
    if (r.insurance.amount) parts.push(`страховая сумма ${r.insurance.amount}`)
    if (r.insurance.insuranceCompany) parts.push(r.insurance.insuranceCompany)
    return parts.join(', ')
  })() : undefined

  return {
    id: r.id || r._id,
    fullName: r.fullName,
    inn: r.inn,
    registryNumber: r.registryNumber,
    phone: r.phone || '',
    email: r.email || '',
    region: r.region,
    status: r.status,
    joinDate: toIso(r.joinDate) || '',
    excludeDate: toIso(r.excludeDate),
    excludeReason: r.excludeReason,
    birthDate: toIso(r.birthDate),
    birthPlace: r.birthPlace,
    registrationDate: toIso(r.registrationDate),
    decisionNumber: r.decisionNumber,
    education: r.education,
    workExperience: r.workExperience,
    internship: r.internship,
    examCertificate: r.examCertificate,
    disqualification: r.disqualification,
    criminalRecord: r.criminalRecord,
    insurance,
    compensationFundContribution: r.compensationFundContribution != null ? String(r.compensationFundContribution) : undefined,
    penalties: r.penalties,
    complianceStatus: r.complianceStatus,
    lastInspection: toIso(r.lastInspection),
    postalAddress: r.postalAddress,
  }
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
      // optional fields for UI convenience
      phone: r.phone,
      email: r.email,
      joinDate: r.joinDate || r.registrationDate,
    })) : []
    const pagination = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    return { success: true, data: { data, pagination } }
  },
  async stats(): Promise<ApiResponse<RegistryStats>> {
    return api.get<RegistryStats>(`/registry/statistics`)
  },
  async getById(id: string): Promise<ApiResponse<ArbitraryManager>> {
    const res = await api.get<any>(`/registry/${id}`)
    const item = res?.data ? normalizeManagerDetail(res.data) : undefined
    return { success: !!item, data: item as ArbitraryManager }
  },
  async byInn(inn: string): Promise<ApiResponse<ArbitraryManager>> {
    const res = await api.get<any>(`/registry/inn/${encodeURIComponent(inn)}`)
    const item = res?.data ? normalizeManagerDetail(res.data) : undefined
    return { success: !!item, data: item as ArbitraryManager }
  },
  async byRegistryNumber(registryNumber: string): Promise<ApiResponse<ArbitraryManager>> {
    const res = await api.get<any>(`/registry/number/${encodeURIComponent(registryNumber)}`)
    const item = res?.data ? normalizeManagerDetail(res.data) : undefined
    return { success: !!item, data: item as ArbitraryManager }
  },
  async exportExcel(): Promise<Blob | null> {
    // Using fetch directly to handle binary download
    try {
      const base = (await import('@/constants')).API_BASE_URL
      const res = await fetch(`${base}/registry/export/excel`)
      if (!res.ok) return null
      return await res.blob()
    } catch {
      return null
    }
  }
}

export type RegistryService = typeof registryService


