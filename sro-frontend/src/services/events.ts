import api from '@/lib/api'
import { ApiResponse, PaginatedResponse, Event, EventType } from '@/types'

export interface EventsFilters {
  query?: string
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  location?: string
  featured?: boolean
  registrationRequired?: boolean
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

function normalizeEvent(e: any): Event {
  return {
    id: e.id || e._id,
    title: e.title,
    description: e.description,
    content: e.content,
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location,
    type: e.type,
    status: e.status,
    maxParticipants: e.maxParticipants,
    currentParticipants: e.currentParticipants,
    registrationRequired: !!e.registrationRequired,
    registrationDeadline: e.registrationDeadline,
    materials: e.materials,
    imageUrl: e.imageUrl,
    cover: e.cover,
    featured: !!e.featured,
    tags: e.tags,
    organizer: e.organizer,
    contactEmail: e.contactEmail,
    contactPhone: e.contactPhone,
    price: e.price,
    currency: e.currency,
    requirements: e.requirements,
    agenda: e.agenda,
  }
}

export const eventsService = {
  async list(filters: EventsFilters = {}): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const params: any = {}
    if (filters.query) params.search = filters.query
    if (filters.type) params.type = filters.type
    if (filters.status) params.status = filters.status
    if (filters.dateFrom) params.startDateFrom = filters.dateFrom
    if (filters.dateTo) params.startDateTo = filters.dateTo
    if (filters.location) params.location = filters.location
    if (typeof filters.featured === 'boolean') params.featured = filters.featured
    if (typeof filters.registrationRequired === 'boolean') params.registrationRequired = filters.registrationRequired
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder

    const res = await api.get(`/events`, { params })
    const events = Array.isArray(res.data) ? res.data.map(normalizeEvent) : []
    const pagination = res.pagination || { page: params.page || 1, limit: params.limit || 10, total: 0, totalPages: 0 }
    return {
      success: true,
      data: { data: events, pagination }
    }
  },

  async types(): Promise<ApiResponse<EventType[]>> {
    const res = await api.get<EventType[]>(`/events/types`)
    return res
  },

  async calendar(year: number, month: number): Promise<ApiResponse<any[]>> {
    // Convert to start/end range to match backend CalendarQueryDto
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59, 999).toISOString()
    const res = await api.get<any[]>(`/events/calendar?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`)
    return res
  },

  async getById(id: string): Promise<ApiResponse<Event>> {
    const res = await api.get<any>(`/events/${id}`)
    const item = res?.data ? normalizeEvent(res.data) : undefined
    return { success: !!item, data: item as Event }
  },

  async byType(typeSlug: string, limit = 3, excludeId?: string): Promise<ApiResponse<Event[]>> {
    const params: any = { type: typeSlug, limit }
    const res = await api.get(`/events`, { params })
    const items = Array.isArray(res.data) ? (res.data as any[]).map(normalizeEvent) : []
    const filtered = excludeId ? items.filter(e => e.id !== excludeId) : items
    return { success: true, data: filtered }
  },

  async register(id: string, payload: { fullName: string; email: string; phone?: string; organization?: string; notes?: string; }): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return api.post<{ success: boolean; message: string }>(`/events/${id}/register`, payload)
  },
}

export type EventsService = typeof eventsService


