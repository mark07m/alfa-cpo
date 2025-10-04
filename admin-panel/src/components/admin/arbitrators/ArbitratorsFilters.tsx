'use client';

import { useState } from 'react';
import { ArbitratorFilters } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ArbitratorsFiltersProps {
  filters: ArbitratorFilters;
  onFiltersChange: (filters: Partial<ArbitratorFilters>) => void;
  onReset: () => void;
}

export function ArbitratorsFilters({ filters, onFiltersChange, onReset }: ArbitratorsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ status: value as ArbitratorFilters['status'] || undefined });
  };

  const handleRegionChange = (value: string) => {
    onFiltersChange({ region: value || undefined });
  };

  const handleCityChange = (value: string) => {
    onFiltersChange({ city: value || undefined });
  };

  const handleInnChange = (value: string) => {
    onFiltersChange({ inn: value || undefined });
  };

  const handleRegistryNumberChange = (value: string) => {
    onFiltersChange({ registryNumber: value || undefined });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ dateFrom: value || undefined });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ dateTo: value || undefined });
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({ sortBy: value as ArbitratorFilters['sortBy'] || undefined });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({ sortOrder: value as ArbitratorFilters['sortOrder'] || undefined });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Фильтры и поиск</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center space-x-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Сбросить</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </Button>
        </div>
      </div>

      {/* Основные фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по ФИО, ИНН, номеру..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          placeholder="Статус"
        >
          <option value="">Все статусы</option>
          <option value="active">Действительный</option>
          <option value="excluded">Исключен</option>
          <option value="suspended">Приостановлен</option>
        </Select>

        <Input
          placeholder="Регион"
          value={filters.region || ''}
          onChange={(e) => handleRegionChange(e.target.value)}
        />

        <Input
          placeholder="Населенный пункт"
          value={filters.city || ''}
          onChange={(e) => handleCityChange(e.target.value)}
        />
      </div>

      {/* Дополнительные фильтры */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="ИНН"
              value={filters.inn || ''}
              onChange={(e) => handleInnChange(e.target.value)}
            />

            <Input
              placeholder="Номер в реестре"
              value={filters.registryNumber || ''}
              onChange={(e) => handleRegistryNumberChange(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Дата с"
              value={filters.dateFrom || ''}
              onChange={(e) => handleDateFromChange(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Дата по"
              value={filters.dateTo || ''}
              onChange={(e) => handleDateToChange(e.target.value)}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filters.sortBy || ''}
              onChange={(e) => handleSortByChange(e.target.value)}
              placeholder="Сортировка"
            >
              <option value="">По умолчанию</option>
              <option value="fullName">По ФИО</option>
              <option value="joinDate">По дате включения</option>
              <option value="status">По статусу</option>
              <option value="region">По региону</option>
              <option value="createdAt">По дате создания</option>
            </Select>

            <Select
              value={filters.sortOrder || ''}
              onChange={(e) => handleSortOrderChange(e.target.value)}
              placeholder="Порядок"
            >
              <option value="">По умолчанию</option>
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </Select>
          </div>
        </div>
      )}

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Активные фильтры:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Поиск: {filters.search}
                <button
                  onClick={() => onFiltersChange({ search: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Статус: {filters.status === 'active' ? 'Действительный' : filters.status === 'excluded' ? 'Исключен' : 'Приостановлен'}
                <button
                  onClick={() => onFiltersChange({ status: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.region && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Регион: {filters.region}
                <button
                  onClick={() => onFiltersChange({ region: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Город: {filters.city}
                <button
                  onClick={() => onFiltersChange({ city: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.inn && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ИНН: {filters.inn}
                <button
                  onClick={() => onFiltersChange({ inn: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-red-400 hover:bg-red-200 hover:text-red-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.registryNumber && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Номер: {filters.registryNumber}
                <button
                  onClick={() => onFiltersChange({ registryNumber: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                С: {filters.dateFrom}
                <button
                  onClick={() => onFiltersChange({ dateFrom: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                По: {filters.dateTo}
                <button
                  onClick={() => onFiltersChange({ dateTo: undefined })}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
