'use client'

import React, { useState, useEffect } from 'react'
import { EventType, EventFilters } from '@/types/admin'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface EventsFiltersProps {
  eventTypes: EventType[]
  filters: EventFilters
  onFiltersChange: (filters: Partial<EventFilters>) => void
  onSearch: (searchTerm: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function EventsFilters({
  eventTypes,
  filters,
  onFiltersChange,
  onSearch,
  isOpen,
  onToggle
}: EventsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [localFilters, setLocalFilters] = useState<EventFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
    setSearchTerm(filters.search || '')
  }, [filters])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = (key: keyof EventFilters, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: EventFilters = {}
    setLocalFilters(clearedFilters)
    setSearchTerm('')
    onFiltersChange(clearedFilters)
    onSearch('')
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false
  )

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'draft', label: 'Черновик' },
    { value: 'published', label: 'Опубликовано' },
    { value: 'cancelled', label: 'Отменено' },
    { value: 'completed', label: 'Завершено' }
  ]

  const registrationOptions = [
    { value: '', label: 'Все мероприятия' },
    { value: 'true', label: 'С регистрацией' },
    { value: 'false', label: 'Без регистрации' }
  ]

  const featuredOptions = [
    { value: '', label: 'Все мероприятия' },
    { value: 'true', label: 'Рекомендуемые' },
    { value: 'false', label: 'Обычные' }
  ]

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Заголовок с кнопкой фильтров */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Фильтры и поиск</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Очистить фильтры
              </button>
            )}
            <button
              onClick={onToggle}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isOpen ? 'bg-gray-50' : ''
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </button>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Поиск по названию, описанию, месту проведения..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Расширенные фильтры */}
        {isOpen && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Тип мероприятия */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип мероприятия
                </label>
                <select
                  value={localFilters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Все типы</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Регистрация */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Регистрация
                </label>
                <select
                  value={localFilters.registrationRequired !== undefined ? localFilters.registrationRequired.toString() : ''}
                  onChange={(e) => handleFilterChange('registrationRequired', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {registrationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Рекомендуемые */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рекомендуемые
                </label>
                <select
                  value={localFilters.featured !== undefined ? localFilters.featured.toString() : ''}
                  onChange={(e) => handleFilterChange('featured', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {featuredOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Место проведения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Место проведения
                </label>
                <input
                  type="text"
                  value={localFilters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  placeholder="Введите место проведения"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Организатор */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Организатор
                </label>
                <input
                  type="text"
                  value={localFilters.organizer || ''}
                  onChange={(e) => handleFilterChange('organizer', e.target.value || undefined)}
                  placeholder="Введите организатора"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Фильтры по датам */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала (от)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала (до)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Быстрые фильтры */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('status', 'published')}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.status === 'published'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Опубликованные
              </button>
              
              <button
                onClick={() => handleFilterChange('status', 'draft')}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Черновики
              </button>
              
              <button
                onClick={() => handleFilterChange('featured', true)}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.featured === true
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Рекомендуемые
              </button>
              
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0]
                  handleFilterChange('dateFrom', today)
                }}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.dateFrom === new Date().toISOString().split('T')[0]
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Предстоящие
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
