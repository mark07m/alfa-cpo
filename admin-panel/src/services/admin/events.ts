import { apiService } from './api'
import { Event, EventType, EventParticipant, EventFilters, PaginationParams, ApiResponse, PaginationResponse } from '@/types/admin'

export interface EventsService {
  getEvents(filters?: EventFilters & PaginationParams): Promise<ApiResponse<{ events: Event[]; pagination: any }>>
  getEvent(id: string): Promise<ApiResponse<Event>>
  createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>>
  updateEvent(id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>>
  deleteEvent(id: string): Promise<ApiResponse<void>>
  bulkDeleteEvents(ids: string[]): Promise<ApiResponse<void>>
  updateEventStatus(id: string, status: Event['status']): Promise<ApiResponse<Event>>
  getEventTypes(): Promise<ApiResponse<EventType[]>>
  createEventType(typeData: Partial<EventType>): Promise<ApiResponse<EventType>>
  updateEventType(id: string, typeData: Partial<EventType>): Promise<ApiResponse<EventType>>
  deleteEventType(id: string): Promise<ApiResponse<void>>
  getEventParticipants(eventId: string): Promise<ApiResponse<EventParticipant[]>>
  addEventParticipant(eventId: string, participantData: Partial<EventParticipant>): Promise<ApiResponse<EventParticipant>>
  updateEventParticipant(eventId: string, participantId: string, participantData: Partial<EventParticipant>): Promise<ApiResponse<EventParticipant>>
  removeEventParticipant(eventId: string, participantId: string): Promise<ApiResponse<void>>
  exportEventParticipants(eventId: string): Promise<Blob>
  getUpcomingEvents(limit?: number): Promise<ApiResponse<Event[]>>
  getFeaturedEvents(limit?: number): Promise<ApiResponse<Event[]>>
  getEventsCalendar(year?: number, month?: number): Promise<ApiResponse<any[]>>
}

class EventsServiceImpl implements EventsService {
  async getEvents(filters: EventFilters & PaginationParams = {}): Promise<ApiResponse<{ events: Event[]; pagination: any }>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.type) params.append('type', filters.type)
      if (filters.status) params.append('status', filters.status)
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.featured !== undefined) params.append('featured', filters.featured.toString())
      if (filters.registrationRequired !== undefined) params.append('registrationRequired', filters.registrationRequired.toString())
      if (filters.location) params.append('location', filters.location)
      if (filters.organizer) params.append('organizer', filters.organizer)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await apiService.get(`/events?${params.toString()}`)
      console.log('Events service response:', response) // Debug log
      
      // Ensure we always return a valid response
      if (!response || !response.data) {
        return {
          success: false,
          data: { events: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
          message: 'API unavailable'
        }
      }
      
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch events:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by Proxy fallback
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
        throw error // Re-throw to be caught by Proxy fallback
      }
      // Return fallback response instead of throwing
      return {
        success: false,
        data: { events: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
        message: 'API unavailable'
      }
    }
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    try {
      const response = await apiService.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch event:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async createEvent(eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    try {
      const response = await apiService.post('/events', eventData)
      return response.data
    } catch (error) {
      console.error('Failed to create event:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    try {
      const response = await apiService.put(`/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.error('Failed to update event:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete event:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async bulkDeleteEvents(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete('/events/bulk', { data: { ids } })
      return response.data
    } catch (error) {
      console.error('Failed to bulk delete events:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateEventStatus(id: string, status: Event['status']): Promise<ApiResponse<Event>> {
    try {
      const response = await apiService.patch(`/events/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Failed to update event status:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getEventTypes(): Promise<ApiResponse<EventType[]>> {
    try {
      const response = await apiService.get('/events/types')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch event types:', error)
      if (error.message === 'MOCK_MODE') {
        throw error // Re-throw to be caught by Proxy fallback
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
        throw error // Re-throw to be caught by Proxy fallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }

  async createEventType(typeData: Partial<EventType>): Promise<ApiResponse<EventType>> {
    try {
      const response = await apiService.post('/events/types', typeData)
      return response.data
    } catch (error) {
      console.error('Failed to create event type:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateEventType(id: string, typeData: Partial<EventType>): Promise<ApiResponse<EventType>> {
    try {
      const response = await apiService.put(`/events/types/${id}`, typeData)
      return response.data
    } catch (error) {
      console.error('Failed to update event type:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async deleteEventType(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/events/types/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete event type:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getEventParticipants(eventId: string): Promise<ApiResponse<EventParticipant[]>> {
    try {
      const response = await apiService.get(`/events/${eventId}/participants`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch event participants:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async addEventParticipant(eventId: string, participantData: Partial<EventParticipant>): Promise<ApiResponse<EventParticipant>> {
    try {
      const response = await apiService.post(`/events/${eventId}/participants`, participantData)
      return response.data
    } catch (error) {
      console.error('Failed to add event participant:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateEventParticipant(eventId: string, participantId: string, participantData: Partial<EventParticipant>): Promise<ApiResponse<EventParticipant>> {
    try {
      const response = await apiService.put(`/events/${eventId}/participants/${participantId}`, participantData)
      return response.data
    } catch (error) {
      console.error('Failed to update event participant:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async removeEventParticipant(eventId: string, participantId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/events/${eventId}/participants/${participantId}`)
      return response.data
    } catch (error) {
      console.error('Failed to remove event participant:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async exportEventParticipants(eventId: string): Promise<Blob> {
    try {
      const response = await apiService.get(`/events/${eventId}/participants/export`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Failed to export event participants:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getUpcomingEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    try {
      const response = await apiService.get(`/events/upcoming?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch upcoming events:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getFeaturedEvents(limit: number = 10): Promise<ApiResponse<Event[]>> {
    try {
      const response = await apiService.get(`/events/featured?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch featured events:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getEventsCalendar(year?: number, month?: number): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams()
      if (year) params.append('year', year.toString())
      if (month) params.append('month', month.toString())
      
      const response = await apiService.get(`/events/calendar?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch events calendar:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }
}

// Моковые данные для демонстрации
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Семинар по новому законодательству о банкротстве',
    description: 'Обсуждение изменений в федеральном законодательстве о несостоятельности (банкротстве)',
    content: 'Подробная программа семинара...',
    startDate: '2024-02-15T10:00:00Z',
    endDate: '2024-02-15T17:00:00Z',
    location: 'Конференц-зал СРО АУ, Москва',
    status: 'published',
    maxParticipants: 50,
    currentParticipants: 23,
    registrationRequired: true,
    registrationDeadline: '2024-02-10T23:59:59Z',
    materials: [],
    imageUrl: '/images/events/seminar-1.jpg',
    featured: true,
    tags: ['законодательство', 'семинар', 'обучение'],
    organizer: 'СРО АУ',
    contactEmail: 'events@sro-au.ru',
    contactPhone: '+7 (495) 123-45-67',
    price: 0,
    currency: 'RUB',
    requirements: 'Членство в СРО АУ',
    agenda: [
      {
        id: '1',
        time: '10:00',
        title: 'Регистрация участников',
        description: 'Встреча и регистрация участников',
        duration: 30
      },
      {
        id: '2',
        time: '10:30',
        title: 'Вступительное слово',
        description: 'Приветствие и обзор программы',
        speaker: 'Председатель СРО АУ',
        duration: 15
      }
    ],
    seoTitle: 'Семинар по банкротству 2024',
    seoDescription: 'Актуальные изменения в законодательстве о банкротстве',
    seoKeywords: ['банкротство', 'семинар', 'законодательство'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    },
    updatedBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  },
  {
    id: '2',
    title: 'Конференция по развитию арбитражного управления',
    description: 'Ежегодная конференция для обсуждения тенденций и перспектив развития отрасли',
    content: 'Программа конференции включает...',
    startDate: '2024-03-20T09:00:00Z',
    endDate: '2024-03-22T18:00:00Z',
    location: 'Гостиница "Метрополь", Москва',
    status: 'published',
    maxParticipants: 200,
    currentParticipants: 156,
    registrationRequired: true,
    registrationDeadline: '2024-03-15T23:59:59Z',
    materials: [],
    imageUrl: '/images/events/conference-1.jpg',
    featured: true,
    tags: ['конференция', 'развитие', 'отрасль'],
    organizer: 'СРО АУ',
    contactEmail: 'conference@sro-au.ru',
    contactPhone: '+7 (495) 123-45-67',
    price: 5000,
    currency: 'RUB',
    requirements: 'Членство в СРО АУ, опыт работы от 3 лет',
    agenda: [],
    seoTitle: 'Конференция арбитражных управляющих 2024',
    seoDescription: 'Крупнейшая конференция в сфере арбитражного управления',
    seoKeywords: ['конференция', 'арбитражные управляющие', 'развитие'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    createdBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    },
    updatedBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  }
]

const mockEventTypes: EventType[] = [
  {
    id: '1',
    name: 'Семинар',
    slug: 'seminar',
    description: 'Обучающие семинары и тренинги',
    color: '#3B82F6',
    icon: 'academic-cap',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Конференция',
    slug: 'conference',
    description: 'Конференции и крупные мероприятия',
    color: '#10B981',
    icon: 'users',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Вебинар',
    slug: 'webinar',
    description: 'Онлайн мероприятия',
    color: '#8B5CF6',
    icon: 'video-camera',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Создаем экземпляр сервиса с fallback на моковые данные
export const eventsService: EventsService = new Proxy(new EventsServiceImpl(), {
  get(target, prop) {
    const originalMethod = target[prop as keyof EventsService]
    
    if (typeof originalMethod === 'function') {
      return async (...args: any[]) => {
        try {
          return await originalMethod.apply(target, args)
        } catch (error) {
          console.warn(`API call failed, using mock data for ${String(prop)}:`, error)
          
          // Fallback на моковые данные
          switch (prop) {
            case 'getEvents':
              return {
                success: true,
                data: {
                  events: mockEvents,
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: mockEvents.length,
                    totalPages: 1
                  }
                }
              }
            case 'getEvent':
              const eventId = args[0]
              const event = mockEvents.find(e => e.id === eventId)
              return {
                success: true,
                data: event || mockEvents[0]
              }
            case 'getEventTypes':
              return {
                success: true,
                data: mockEventTypes
              }
            case 'getUpcomingEvents':
              return {
                success: true,
                data: mockEvents.filter(e => new Date(e.startDate) > new Date()).slice(0, args[0] || 10)
              }
            case 'getFeaturedEvents':
              return {
                success: true,
                data: mockEvents.filter(e => e.featured).slice(0, args[0] || 10)
              }
            case 'getEventsCalendar':
              return {
                success: true,
                data: mockEvents.map(event => ({
                  id: event.id,
                  title: event.title,
                  start: event.startDate,
                  end: event.endDate || event.startDate,
                  allDay: false,
                  color: event.featured ? '#10B981' : '#3B82F6'
                }))
              }
            default:
              return {
                success: true,
                data: null
              }
          }
        }
      }
    }
    
    return originalMethod
  }
})
