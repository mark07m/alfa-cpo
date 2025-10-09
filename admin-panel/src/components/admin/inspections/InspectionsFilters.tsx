'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface InspectionsFiltersProps {
  filters: {
    search: string;
    status: string;
    type: string;
    inspector: string;
    dateFrom: string;
    dateTo: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function InspectionsFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: InspectionsFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'scheduled', label: 'Запланирована' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершена' },
    { value: 'cancelled', label: 'Отменена' }
  ];

  const typeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'planned', label: 'Плановая' },
    { value: 'unplanned', label: 'Внеплановая' }
  ];

  const inspectorOptions = [
    { value: '', label: 'Все инспекторы' },
    { value: 'Иванов И.И.', label: 'Иванов И.И.' },
    { value: 'Петров П.П.', label: 'Петров П.П.' },
    { value: 'Сидоров С.С.', label: 'Сидоров С.С.' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <FunnelIcon className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Фильтры поиска</h3>
            {hasActiveFilters && (
              <p className="text-sm text-gray-500 mt-0.5">
                Активно фильтров: <span className="font-medium text-amber-600">{activeFiltersCount}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200"
          >
            <FunnelIcon className="h-4 w-4" />
            <span className="font-medium">{showAdvanced ? 'Скрыть расширенные' : 'Расширенные'}</span>
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="font-medium">Очистить все</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Поиск */}
        <div className="lg:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <MagnifyingGlassIcon className="h-4 w-4 text-amber-600" />
            <span>Поиск</span>
          </label>
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Введите ФИО, ИНН или описание проверки..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Статус */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <CheckCircleIcon className="h-4 w-4 text-amber-600" />
            <span>Статус</span>
          </label>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
            className="h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        {/* Тип */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <ClipboardDocumentListIcon className="h-4 w-4 text-amber-600" />
            <span>Тип проверки</span>
          </label>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={typeOptions}
            className="h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        {/* Инспектор */}
        <div className="lg:col-span-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
            <UserIcon className="h-4 w-4 text-amber-600" />
            <span>Инспектор</span>
          </label>
          <Select
            value={filters.inspector}
            onChange={(e) => handleFilterChange('inspector', e.target.value)}
            options={inspectorOptions}
            className="h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvanced && (
        <div className="mt-7 pt-7 border-t-2 border-gray-200 animate-in slide-in-from-top duration-300">
          <h4 className="text-base font-semibold text-gray-900 mb-5 flex items-center space-x-2">
            <span className="h-1 w-1 bg-amber-600 rounded-full"></span>
            <span>Период проверки</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <span>Дата начала</span>
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <span>Дата окончания</span>
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="h-11 text-base border-gray-200 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-semibold text-gray-600 flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span>Активные фильтры:</span>
            </span>
            {filters.search && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                <MagnifyingGlassIcon className="h-3.5 w-3.5 mr-1.5" />
                Поиск: <span className="font-semibold ml-1">{filters.search.substring(0, 20)}{filters.search.length > 20 ? '...' : ''}</span>
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-md text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-all duration-150"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                Статус: <span className="font-semibold ml-1">{statusOptions.find(opt => opt.value === filters.status)?.label}</span>
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-md text-green-600 hover:bg-green-200 hover:text-green-800 transition-all duration-150"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                <ClipboardDocumentListIcon className="h-3.5 w-3.5 mr-1.5" />
                Тип: <span className="font-semibold ml-1">{typeOptions.find(opt => opt.value === filters.type)?.label}</span>
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-md text-purple-600 hover:bg-purple-200 hover:text-purple-800 transition-all duration-150"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {filters.inspector && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-200">
                <UserIcon className="h-3.5 w-3.5 mr-1.5" />
                Инспектор: <span className="font-semibold ml-1">{filters.inspector}</span>
                <button
                  onClick={() => handleFilterChange('inspector', '')}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-md text-amber-600 hover:bg-amber-200 hover:text-amber-800 transition-all duration-150"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <span className="font-medium">Период:</span> 
                <span className="font-semibold ml-1">{filters.dateFrom || '...'}</span>
                <span className="mx-1">—</span>
                <span className="font-semibold">{filters.dateTo || '...'}</span>
                <button
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-150"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
