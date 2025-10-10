'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/admin/ui/Button'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { Event, EventType } from '@/types/admin'
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface EventsListProps {
  events: Event[]
  eventTypes: EventType[]
  isLoading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  selectedEvents: Event[]
  onSelectEvent: (event: Event, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onDeleteEvent: (id: string) => void
  onUpdateEventStatus: (id: string, status: Event['status']) => void
  onPageChange: (page: number) => void
}

export function EventsList({
  events,
  eventTypes,
  isLoading,
  pagination,
  selectedEvents,
  onSelectEvent,
  onSelectAll,
  onDeleteEvent,
  onUpdateEventStatus,
  onPageChange
}: EventsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      setDeletingId(id)
      try {
        await onDeleteEvent(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const getStatusBadge = (status: Event['status']) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Черновик' },
      published: { color: 'bg-green-100 text-green-800', label: 'Опубликовано' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Отменено' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Завершено' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getEventType = (typeId?: string) => {
    if (!typeId) return null
    return eventTypes.find(type => type.id === typeId)
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru })
    } catch {
      return dateString
    }
  }

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = format(new Date(startDate), 'dd.MM.yyyy', { locale: ru })
    if (!endDate) return start
    
    const end = format(new Date(endDate), 'dd.MM.yyyy', { locale: ru })
    return start === end ? start : `${start} - ${end}`
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="ml-4">
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет мероприятий</h3>
          <p className="mt-1 text-sm text-gray-500">
            Начните с создания нового мероприятия
          </p>
          <div className="mt-6">
            <Link
              href="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Создать мероприятие
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Заголовок с чекбоксом "Выбрать все" */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Checkbox
              checked={selectedEvents.length === events.length && events.length > 0}
              onChange={(e) => onSelectAll((e.target as HTMLInputElement).checked)}
              size="sm"
            />
            <span className="ml-2 text-sm text-gray-700">
              Выбрать все ({selectedEvents.length} из {events.length})
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Всего: {pagination.total} мероприятий
          </div>
        </div>

        {/* Список мероприятий */}
        <div className="space-y-4">
          {events?.map((event) => {
            const eventType = getEventType(event.type?.id)
            const isSelected = selectedEvents.some(selected => selected.id === event.id)
            const isDeleting = deletingId === event.id

            return (
              <div
                key={event.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                } ${isDeleting ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Чекбокс выбора */}
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectEvent(event, (e.target as HTMLInputElement).checked)}
                      size="sm"
                      className="mt-1"
                    />

                    {/* Изображение мероприятия */}
                    <div className="flex-shrink-0">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Основная информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {event.title}
                          </h3>
                          
                          <p className="mt-1 text-sm text-gray-600 truncate">
                            {event.description}
                          </p>

                          {/* Метаинформация */}
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {formatDateRange(event.startDate, event.endDate)}
                            </div>
                            
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {event.location}
                            </div>

                            {event.maxParticipants && (
                              <div className="flex items-center">
                                <UsersIcon className="h-4 w-4 mr-1" />
                                {event.currentParticipants}/{event.maxParticipants}
                              </div>
                            )}

                            {event.registrationRequired && (
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                Регистрация до {event.registrationDeadline ? formatDate(event.registrationDeadline) : 'начала'}
                              </div>
                            )}
                          </div>

                          {/* Теги и тип */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {eventType && (
                              <span 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: eventType.color + '20', 
                                  color: eventType.color 
                                }}
                              >
                                {eventType.name}
                              </span>
                            )}
                            
                            {event.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Рекомендуемое
                              </span>
                            )}

                            {event.tags?.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Статус */}
                        <div className="ml-4 flex-shrink-0">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Просмотр"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="text-gray-400 hover:text-blue-600"
                      title="Редактировать"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>

                    {event.status === 'published' ? (
                      <Button variant="ghost" size="sm" onClick={() => onUpdateEventStatus(event.id, 'draft')} title="Снять с публикации">
                        <XMarkIcon className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => onUpdateEventStatus(event.id, 'published')} title="Опубликовать">
                        <CheckIcon className="h-5 w-5" />
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)} disabled={isDeleting} title="Удалить" className="text-red-600 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Пагинация */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                Предыдущая
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1
                const isCurrentPage = page === pagination.page
                
                return (
                  <Button key={page} variant={isCurrentPage ? 'primary' : 'outline'} size="sm" onClick={() => onPageChange(page)}>
                    {page}
                  </Button>
                )
              })}
              
              <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>
                Следующая
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
