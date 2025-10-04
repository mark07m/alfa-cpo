'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { EventsList } from '@/components/admin/events/EventsList'
import { EventsFilters } from '@/components/admin/events/EventsFilters'
import { EventsActions } from '@/components/admin/events/EventsActions'
import { useEvents } from '@/hooks/admin/useEvents'
import { Event, EventFilters } from '@/types/admin'
import { PlusIcon, FunnelIcon, CalendarIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'

export default function EventsPage() {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    events,
    eventTypes,
    isLoading,
    error,
    pagination,
    filters,
    fetchEvents,
    deleteEvent,
    updateEventStatus,
    bulkDeleteEvents,
    setFilters,
    clearError
  } = useEvents()

  useEffect(() => {
    fetchEvents(filters)
  }, [filters, fetchEvents])

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
  }

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    setFilters(newFilters)
  }

  const handleSelectEvent = (event: Event, selected: boolean) => {
    if (selected) {
      setSelectedEvents(prev => [...prev, event])
    } else {
      setSelectedEvents(prev => prev.filter(item => item.id !== event.id))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedEvents(events)
    } else {
      setSelectedEvents([])
    }
  }

  const handleBulkAction = async (action: string, eventIds: string[]) => {
    setIsProcessing(true)
    try {
      switch (action) {
        case 'delete':
          await bulkDeleteEvents(eventIds)
          setSelectedEvents([])
          break
        case 'publish':
          for (const id of eventIds) {
            await updateEventStatus(id, 'published')
          }
          setSelectedEvents([])
          break
        case 'unpublish':
          for (const id of eventIds) {
            await updateEventStatus(id, 'draft')
          }
          setSelectedEvents([])
          break
        case 'complete':
          for (const id of eventIds) {
            await updateEventStatus(id, 'completed')
          }
          setSelectedEvents([])
          break
        case 'cancel':
          for (const id of eventIds) {
            await updateEventStatus(id, 'cancelled')
          }
          setSelectedEvents([])
          break
        case 'export':
          // TODO: Implement export functionality
          console.log('Export events:', eventIds)
          break
        default:
          console.warn('Unknown bulk action:', action)
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchEvents({ ...filters, page })
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id)
      setSelectedEvents(prev => prev.filter(event => event.id !== id))
    } catch (error) {
      console.error('Delete event failed:', error)
    }
  }

  const handleUpdateEventStatus = async (id: string, status: Event['status']) => {
    try {
      await updateEventStatus(id, status)
    } catch (error) {
      console.error('Update event status failed:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Управление мероприятиями
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Создание, редактирование и управление мероприятиями СРО АУ
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Создать мероприятие
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Всего мероприятий
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pagination?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Опубликовано
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {events?.filter(e => e.status === 'published').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Черновики
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {events?.filter(e => e.status === 'draft').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Рекомендуемые
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {events?.filter(e => e.featured).length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Переключатель вида */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                viewMode === 'list'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <ListBulletIcon className="h-4 w-4 mr-2" />
              Список
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                viewMode === 'calendar'
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Календарь
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                showFilters
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </button>
          </div>
        </div>

        {/* Ошибки API */}
        <ApiErrorBanner 
          error={error} 
          onClose={clearError}
          onRetry={() => fetchEvents()}
        />

        {/* Фильтры */}
        <EventsFilters
          eventTypes={eventTypes}
          filters={filters}
          onFiltersChange={handleFilterChange}
          onSearch={handleSearch}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Массовые действия */}
        {selectedEvents.length > 0 && (
          <EventsActions
            selectedEvents={selectedEvents}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedEvents([])}
            isProcessing={isProcessing}
          />
        )}

        {/* Контент */}
        {viewMode === 'list' ? (
          <EventsList
            events={events}
            eventTypes={eventTypes}
            isLoading={isLoading}
            pagination={pagination}
            selectedEvents={selectedEvents}
            onSelectEvent={handleSelectEvent}
            onSelectAll={handleSelectAll}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEventStatus={handleUpdateEventStatus}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Календарный вид</h3>
              <p className="mt-1 text-sm text-gray-500">
                Календарный вид мероприятий будет реализован в следующей версии
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
