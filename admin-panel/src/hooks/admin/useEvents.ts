import { useState, useEffect, useCallback } from 'react'
import { eventsService } from '@/services/admin/events'
import { Event, EventType, EventParticipant, EventFilters, PaginationParams, ApiResponse } from '@/types/admin'
import { mockEvents, mockEventTypes, mockEventParticipants } from '@/data/mockData'

interface UseEventsReturn {
  // Данные
  events: Event[]
  eventTypes: EventType[]
  selectedEvent: Event | null
  participants: EventParticipant[]
  
  // Состояние загрузки
  isLoading: boolean
  isParticipantsLoading: boolean
  error: string | null
  
  // Пагинация
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Фильтры
  filters: EventFilters
  
  // Методы для работы с мероприятиями
  fetchEvents: (newFilters?: EventFilters & PaginationParams) => Promise<void>
  fetchEvent: (id: string) => Promise<void>
  createEvent: (eventData: Partial<Event>) => Promise<{ success: boolean; data?: Event; error?: string }>
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<{ success: boolean; data?: Event; error?: string }>
  deleteEvent: (id: string) => Promise<{ success: boolean; error?: string }>
  bulkDeleteEvents: (ids: string[]) => Promise<{ success: boolean; error?: string }>
  updateEventStatus: (id: string, status: Event['status']) => Promise<{ success: boolean; data?: Event; error?: string }>
  
  // Методы для работы с типами мероприятий
  fetchEventTypes: () => Promise<void>
  createEventType: (typeData: Partial<EventType>) => Promise<{ success: boolean; data?: EventType; error?: string }>
  updateEventType: (id: string, typeData: Partial<EventType>) => Promise<{ success: boolean; data?: EventType; error?: string }>
  deleteEventType: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Методы для работы с участниками
  fetchEventParticipants: (eventId: string) => Promise<void>
  addEventParticipant: (eventId: string, participantData: Partial<EventParticipant>) => Promise<{ success: boolean; data?: EventParticipant; error?: string }>
  updateEventParticipant: (eventId: string, participantId: string, participantData: Partial<EventParticipant>) => Promise<{ success: boolean; data?: EventParticipant; error?: string }>
  removeEventParticipant: (eventId: string, participantId: string) => Promise<{ success: boolean; error?: string }>
  exportEventParticipants: (eventId: string) => Promise<void>
  
  // Специальные методы
  getUpcomingEvents: (limit?: number) => Promise<Event[]>
  getFeaturedEvents: (limit?: number) => Promise<Event[]>
  getEventsCalendar: (year?: number, month?: number) => Promise<unknown[]>
  
  // Утилиты
  setFilters: (filters: Partial<EventFilters>) => void
  setSelectedEvent: (event: Event | null) => void
  clearError: () => void
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [participants, setParticipants] = useState<EventParticipant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [filters, setFiltersState] = useState<EventFilters>({})

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchEvents = useCallback(async (newFilters?: EventFilters & PaginationParams) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const currentFilters = newFilters || filters
      const response = await eventsService.getEvents({
        ...currentFilters,
        page: newFilters?.page || pagination.page,
        limit: newFilters?.limit || pagination.limit
      })
      
      console.log('Events response:', response) // Debug log
      
      if (response && response.success) {
        setEvents(response.data.events)
        setPagination(response.data.pagination)
        setError(null)
      } else if (!response || response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for events')
        setEvents(mockEvents)
        setPagination({ page: 1, limit: 10, total: mockEvents.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Не удалось загрузить мероприятия')
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err)
      if (err instanceof Error && (err.message === 'API_UNAVAILABLE' || err.message === 'API unavailable')) {
        // API недоступен, используем моковые данные
        console.info('Using mock data for events')
        setEvents(mockEvents)
        setPagination({ page: 1, limit: 10, total: mockEvents.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Ошибка при загрузке мероприятий')
      }
    } finally {
      setIsLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  const fetchEvent = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await eventsService.getEvent(id)
      
      if (response && response.success) {
        setSelectedEvent(response.data)
        setError(null)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for event')
        setSelectedEvent(null)
        setError(null)
      } else {
        setError('Не удалось загрузить мероприятие')
      }
    } catch (err) {
      console.error('Error fetching event:', err)
      setError('Ошибка при загрузке мероприятия')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (eventData: Partial<Event>) => {
    setError(null)
    
    try {
      const response = await eventsService.createEvent(eventData)
      
      if (response && response.success) {
        await fetchEvents() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось создать мероприятие' }
      }
    } catch (err) {
      console.error('Error creating event:', err)
      return { success: false, error: 'Ошибка при создании мероприятия' }
    }
  }, [fetchEvents])

  const updateEvent = useCallback(async (id: string, eventData: Partial<Event>) => {
    setError(null)
    
    try {
      const response = await eventsService.updateEvent(id, eventData)
      
      if (response && response.success) {
        await fetchEvents() // Обновляем список
        if (selectedEvent?.id === id) {
          setSelectedEvent(response.data)
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить мероприятие' }
      }
    } catch (err) {
      console.error('Error updating event:', err)
      return { success: false, error: 'Ошибка при обновлении мероприятия' }
    }
  }, [fetchEvents, selectedEvent])

  const deleteEvent = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await eventsService.deleteEvent(id)
      
      if (response && response.success) {
        await fetchEvents() // Обновляем список
        if (selectedEvent?.id === id) {
          setSelectedEvent(null)
        }
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить мероприятие' }
      }
    } catch (err) {
      console.error('Error deleting event:', err)
      return { success: false, error: 'Ошибка при удалении мероприятия' }
    }
  }, [fetchEvents, selectedEvent])

  const bulkDeleteEvents = useCallback(async (ids: string[]) => {
    setError(null)
    
    try {
      const response = await eventsService.bulkDeleteEvents(ids)
      
      if (response && response.success) {
        await fetchEvents() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить мероприятия' }
      }
    } catch (err) {
      console.error('Error bulk deleting events:', err)
      return { success: false, error: 'Ошибка при удалении мероприятий' }
    }
  }, [fetchEvents])

  const updateEventStatus = useCallback(async (id: string, status: Event['status']) => {
    setError(null)
    
    try {
      const response = await eventsService.updateEventStatus(id, status)
      
      if (response && response.success) {
        await fetchEvents() // Обновляем список
        if (selectedEvent?.id === id) {
          setSelectedEvent(response.data)
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить статус мероприятия' }
      }
    } catch (err) {
      console.error('Error updating event status:', err)
      return { success: false, error: 'Ошибка при обновлении статуса мероприятия' }
    }
  }, [fetchEvents, selectedEvent])

  const fetchEventTypes = useCallback(async () => {
    try {
      const response = await eventsService.getEventTypes()
      
      if (response && response.success) {
        setEventTypes(response.data)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for event types')
        setEventTypes(mockEventTypes)
      }
    } catch (err) {
      console.error('Error fetching event types:', err)
      // Используем моковые данные при ошибке
      setEventTypes(mockEventTypes)
    }
  }, [])

  const createEventType = useCallback(async (typeData: Partial<EventType>) => {
    setError(null)
    
    try {
      const response = await eventsService.createEventType(typeData)
      
      if (response && response.success) {
        await fetchEventTypes() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось создать тип мероприятия' }
      }
    } catch (err) {
      console.error('Error creating event type:', err)
      return { success: false, error: 'Ошибка при создании типа мероприятия' }
    }
  }, [fetchEventTypes])

  const updateEventType = useCallback(async (id: string, typeData: Partial<EventType>) => {
    setError(null)
    
    try {
      const response = await eventsService.updateEventType(id, typeData)
      
      if (response && response.success) {
        await fetchEventTypes() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить тип мероприятия' }
      }
    } catch (err) {
      console.error('Error updating event type:', err)
      return { success: false, error: 'Ошибка при обновлении типа мероприятия' }
    }
  }, [fetchEventTypes])

  const deleteEventType = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await eventsService.deleteEventType(id)
      
      if (response && response.success) {
        await fetchEventTypes() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить тип мероприятия' }
      }
    } catch (err) {
      console.error('Error deleting event type:', err)
      return { success: false, error: 'Ошибка при удалении типа мероприятия' }
    }
  }, [fetchEventTypes])

  const fetchEventParticipants = useCallback(async (eventId: string) => {
    setIsParticipantsLoading(true)
    setError(null)
    
    try {
      const response = await eventsService.getEventParticipants(eventId)
      
      if (response && response.success) {
        setParticipants(response.data)
        setError(null)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for event participants')
        setParticipants([])
        setError(null)
      } else {
        setError('Не удалось загрузить участников мероприятия')
      }
    } catch (err) {
      console.error('Error fetching event participants:', err)
      setError('Ошибка при загрузке участников мероприятия')
    } finally {
      setIsParticipantsLoading(false)
    }
  }, [])

  const addEventParticipant = useCallback(async (eventId: string, participantData: Partial<EventParticipant>) => {
    setError(null)
    
    try {
      const response = await eventsService.addEventParticipant(eventId, participantData)
      
      if (response && response.success) {
        await fetchEventParticipants(eventId) // Обновляем список участников
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось добавить участника' }
      }
    } catch (err) {
      console.error('Error adding event participant:', err)
      return { success: false, error: 'Ошибка при добавлении участника' }
    }
  }, [fetchEventParticipants])

  const updateEventParticipant = useCallback(async (eventId: string, participantId: string, participantData: Partial<EventParticipant>) => {
    setError(null)
    
    try {
      const response = await eventsService.updateEventParticipant(eventId, participantId, participantData)
      
      if (response && response.success) {
        await fetchEventParticipants(eventId) // Обновляем список участников
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить участника' }
      }
    } catch (err) {
      console.error('Error updating event participant:', err)
      return { success: false, error: 'Ошибка при обновлении участника' }
    }
  }, [fetchEventParticipants])

  const removeEventParticipant = useCallback(async (eventId: string, participantId: string) => {
    setError(null)
    
    try {
      const response = await eventsService.removeEventParticipant(eventId, participantId)
      
      if (response && response.success) {
        await fetchEventParticipants(eventId) // Обновляем список участников
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить участника' }
      }
    } catch (err) {
      console.error('Error removing event participant:', err)
      return { success: false, error: 'Ошибка при удалении участника' }
    }
  }, [fetchEventParticipants])

  const exportEventParticipants = useCallback(async (eventId: string) => {
    try {
      const blob = await eventsService.exportEventParticipants(eventId)
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `participants-${eventId}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting event participants:', err)
      setError('Ошибка при экспорте участников')
    }
  }, [])

  const getUpcomingEvents = useCallback(async (limit?: number) => {
    try {
      const response = await eventsService.getUpcomingEvents(limit)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching upcoming events:', err)
      return []
    }
  }, [])

  const getFeaturedEvents = useCallback(async (limit?: number) => {
    try {
      const response = await eventsService.getFeaturedEvents(limit)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching featured events:', err)
      return []
    }
  }, [])

  const getEventsCalendar = useCallback(async (year?: number, month?: number) => {
    try {
      const response = await eventsService.getEventsCalendar(year, month)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching events calendar:', err)
      return []
    }
  }, [])

  const setFilters = useCallback((newFilters: Partial<EventFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchEvents()
    fetchEventTypes()
  }, [fetchEvents, fetchEventTypes])

  return {
    // Данные
    events,
    eventTypes,
    selectedEvent,
    participants,
    
    // Состояние загрузки
    isLoading,
    isParticipantsLoading,
    error,
    
    // Пагинация
    pagination,
    
    // Фильтры
    filters,
    
    // Методы для работы с мероприятиями
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    bulkDeleteEvents,
    updateEventStatus,
    
    // Методы для работы с типами мероприятий
    fetchEventTypes,
    createEventType,
    updateEventType,
    deleteEventType,
    
    // Методы для работы с участниками
    fetchEventParticipants,
    addEventParticipant,
    updateEventParticipant,
    removeEventParticipant,
    exportEventParticipants,
    
    // Специальные методы
    getUpcomingEvents,
    getFeaturedEvents,
    getEventsCalendar,
    
    // Утилиты
    setFilters,
    setSelectedEvent,
    clearError
  }
}
