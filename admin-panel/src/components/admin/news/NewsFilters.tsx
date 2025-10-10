'use client'

import React from 'react'
import { Button } from '@/components/admin/ui/Button'
import { Input } from '@/components/admin/ui/Input'
import { Select } from '@/components/admin/ui/Select'
import { NewsCategory } from '@/types/admin'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface NewsFiltersProps {
  filters: {
    search: string
    category: string
    status: string
    dateFrom: string
    dateTo: string
  }
  categories: NewsCategory[]
  onFilterChange: (filters: Partial<NewsFiltersProps['filters']>) => void
  onSearch: (searchTerm: string) => void
}

export function NewsFilters({
  filters,
  categories,
  onFilterChange,
  onSearch
}: NewsFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSearch(value)
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-amber-700">
            <XMarkIcon className="h-4 w-4 mr-1" />
            Очистить фильтры
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Поиск */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Поиск
          </label>
          <Input
            id="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Поиск по заголовку или содержанию..."
            icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          />
        </div>

        {/* Категория */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Категория
          </label>
          <Select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', (e.target as HTMLSelectElement).value)}
            options={[{ value: '', label: 'Все категории' }, ...(categories || []).map((c, index) => ({ value: c.id || `category-${index}`, label: c.name }))]}
          />
        </div>

        {/* Статус */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Статус
          </label>
          <Select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', (e.target as HTMLSelectElement).value)}
            options={[
              { value: '', label: 'Все статусы' },
              { value: 'draft', label: 'Черновик' },
              { value: 'published', label: 'Опубликовано' },
              { value: 'archived', label: 'Архив' }
            ]}
          />
        </div>

        {/* Дата от */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Дата от
          </label>
          <Input
            type="date"
            id="dateFrom"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {/* Дата до */}
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            Дата до
          </label>
          <Input
            type="date"
            id="dateTo"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>

        {/* Дополнительные фильтры можно добавить здесь */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Активные фильтры:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Поиск: &quot;{filters.search}&quot;
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Категория: {categories.find(cat => cat.id === filters.category)?.name}
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Статус: {filters.status === 'draft' ? 'Черновик' : filters.status === 'published' ? 'Опубликовано' : 'Архив'}
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                От: {filters.dateFrom}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                До: {filters.dateTo}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
