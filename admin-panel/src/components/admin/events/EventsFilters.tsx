'use client'

import React, { useState, useEffect } from 'react'
import { EventType, EventFilters } from '@/types/admin'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/admin/ui/Button'
import { Input } from '@/components/admin/ui/Input'
import { Select } from '@/components/admin/ui/Select'

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
        <div className="flex items-center justify_between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Фильтры и поиск</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Очистить фильтры
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggle}
              className={isOpen ? 'bg-gray-50' : ''}
              icon={<FunnelIcon className="h-4 w-4" />}
            >
              Фильтры
            </Button>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Поиск по названию, описанию, месту проведения..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
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
                <Select
                  value={localFilters.type || ''}
                  onChange={(e) => handleFilterChange('type', (e.target as HTMLSelectElement).value || undefined)}
                  options={[{ value: '', label: 'Все типы' }, ...eventTypes.map((type) => ({ value: type.id, label: type.name }))]}
                />
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', (e.target as HTMLSelectElement).value || undefined)}
                  options={statusOptions}
                />
              </div>

              {/* Регистрация */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Регистрация
                </label>
                <Select
                  value={localFilters.registrationRequired !== undefined ? String(localFilters.registrationRequired) : ''}
                  onChange={(e) => handleFilterChange('registrationRequired', (e.target as HTMLSelectElement).value === '' ? undefined : (e.target as HTMLSelectElement).value === 'true')}
                  options={registrationOptions}
                />
              </div>

              {/* Рекомендуемые */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Рекомендуемые
                </label>
                <Select
                  value={localFilters.featured !== undefined ? String(localFilters.featured) : ''}
                  onChange={(e) => handleFilterChange('featured', (e.target as HTMLSelectElement).value === '' ? undefined : (e.target as HTMLSelectElement).value === 'true')}
                  options={featuredOptions}
                />
              </div>

              {/* Место проведения */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Место проведения
                </label>
                <Input
                  value={localFilters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                  placeholder="Введите место проведения"
                />
              </div>

              {/* Организатор */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Организатор
                </label>
                <Input
                  value={localFilters.organizer || ''}
                  onChange={(e) => handleFilterChange('organizer', e.target.value || undefined)}
                  placeholder="Введите организатора"
                />
              </div>
            </div>

            {/* Фильтры по датам */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала (от)
                </label>
                <Input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                  icon={<CalendarIcon className="h-5 w-5" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала (до)
                </label>
                <Input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                  icon={<CalendarIcon className="h-5 w-5" />}
                />
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
