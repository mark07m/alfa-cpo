'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/admin/ui/Button'
import { Input } from '@/components/admin/ui/Input'
import { Select } from '@/components/admin/ui/Select'
import { DocumentCategory, DocumentFilters } from '@/types/admin'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  DocumentIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface DocumentsFiltersProps {
  documentCategories: DocumentCategory[]
  filters: DocumentFilters
  onFiltersChange: (filters: Partial<DocumentFilters>) => void
  onSearch: (searchTerm: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function DocumentsFilters({
  documentCategories,
  filters,
  onFiltersChange,
  onSearch,
  isOpen,
  onToggle
}: DocumentsFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [localFilters, setLocalFilters] = useState<DocumentFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
    setSearchTerm(filters.search || '')
  }, [filters])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = (key: keyof DocumentFilters, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: DocumentFilters = {}
    setLocalFilters(clearedFilters)
    setSearchTerm('')
    onFiltersChange(clearedFilters)
    onSearch('')
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== false && 
    !(Array.isArray(value) && value.length === 0)
  )

  const fileTypeOptions = [
    { value: '', label: 'Все типы файлов' },
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word (DOC)' },
    { value: 'docx', label: 'Word (DOCX)' },
    { value: 'xls', label: 'Excel (XLS)' },
    { value: 'xlsx', label: 'Excel (XLSX)' },
    { value: 'ppt', label: 'PowerPoint (PPT)' },
    { value: 'pptx', label: 'PowerPoint (PPTX)' },
    { value: 'jpg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'gif', label: 'GIF' },
    { value: 'mp4', label: 'MP4' },
    { value: 'zip', label: 'ZIP' },
    { value: 'other', label: 'Прочие' }
  ]

  const sizeOptions = [
    { value: '', label: 'Любой размер' },
    { value: 'small', label: 'Малые (< 1 MB)' },
    { value: 'medium', label: 'Средние (1-10 MB)' },
    { value: 'large', label: 'Большие (> 10 MB)' }
  ]

  const getSizeRange = (sizeType: string) => {
    switch (sizeType) {
      case 'small':
        return { minSize: 0, maxSize: 1024 * 1024 }
      case 'medium':
        return { minSize: 1024 * 1024, maxSize: 10 * 1024 * 1024 }
      case 'large':
        return { minSize: 10 * 1024 * 1024, maxSize: undefined }
      default:
        return {}
    }
  }

  const handleSizeChange = (sizeType: string) => {
    const sizeRange = getSizeRange(sizeType)
    handleFilterChange('minSize', sizeRange.minSize)
    handleFilterChange('maxSize', sizeRange.maxSize)
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Заголовок с кнопкой фильтров */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Фильтры и поиск</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Очистить фильтры
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onToggle} className={isOpen ? 'bg-gray-50' : ''} icon={<FunnelIcon className="h-4 w-4" />}>
              Фильтры
            </Button>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-4">
          <Input
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Поиск по названию, описанию, тегам..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>

        {/* Расширенные фильтры */}
        {isOpen && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Категория */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <Select
                  value={localFilters.category || ''}
                  onChange={(e) => handleFilterChange('category', (e.target as HTMLSelectElement).value || undefined)}
                  options={[{ value: '', label: 'Все категории' }, ...documentCategories.map(c => ({ value: c.id, label: c.name }))]}
                />
              </div>

              {/* Тип файла */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип файла
                </label>
                <Select
                  value={localFilters.fileType || ''}
                  onChange={(e) => handleFilterChange('fileType', (e.target as HTMLSelectElement).value || undefined)}
                  options={fileTypeOptions}
                />
              </div>

              {/* Размер файла */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Размер файла
                </label>
                <Select
                  value={
                    localFilters.minSize === 0 && localFilters.maxSize === 1024 * 1024 ? 'small' :
                    localFilters.minSize === 1024 * 1024 && localFilters.maxSize === 10 * 1024 * 1024 ? 'medium' :
                    localFilters.minSize === 10 * 1024 * 1024 ? 'large' : ''
                  }
                  onChange={(e) => handleSizeChange((e.target as HTMLSelectElement).value)}
                  options={sizeOptions}
                />
              </div>

              {/* Публичность */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Видимость
                </label>
                <Select
                  value={localFilters.isPublic !== undefined ? String(localFilters.isPublic) : ''}
                  onChange={(e) => handleFilterChange('isPublic', (e.target as HTMLSelectElement).value === '' ? undefined : (e.target as HTMLSelectElement).value === 'true')}
                  options={[
                    { value: '', label: 'Все документы' },
                    { value: 'true', label: 'Публичные' },
                    { value: 'false', label: 'Приватные' }
                  ]}
                />
              </div>

              {/* Автор */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Автор
                </label>
                <Input
                  value={localFilters.author || ''}
                  onChange={(e) => handleFilterChange('author', e.target.value || undefined)}
                  placeholder="Введите имя автора"
                />
              </div>

              {/* Теги */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Теги
                </label>
                <Input
                  value={localFilters.tags?.join(', ') || ''}
                  onChange={(e) => handleFilterChange('tags', e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : [])}
                  placeholder="Введите теги через запятую"
                />
              </div>
            </div>

            {/* Фильтры по датам */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата загрузки (от)
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                    icon={<CalendarIcon className="h-5 w-5" />}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата загрузки (до)
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                    icon={<CalendarIcon className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>

            {/* Быстрые фильтры */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('isPublic', true)}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.isPublic === true
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Публичные
              </button>
              
              <button
                onClick={() => handleFilterChange('isPublic', false)}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.isPublic === false
                    ? 'bg-gray-100 text-gray-800 border border-gray-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                Приватные
              </button>
              
              <button
                onClick={() => handleFilterChange('fileType', 'pdf')}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.fileType === 'pdf'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                PDF
              </button>
              
              <button
                onClick={() => {
                  const today = new Date()
                  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                  handleFilterChange('dateFrom', weekAgo.toISOString().split('T')[0])
                }}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.dateFrom === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                За неделю
              </button>
              
              <button
                onClick={() => {
                  const today = new Date()
                  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                  handleFilterChange('dateFrom', monthAgo.toISOString().split('T')[0])
                }}
                className={`px-3 py-1 text-sm rounded-full ${
                  localFilters.dateFrom === new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                За месяц
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
