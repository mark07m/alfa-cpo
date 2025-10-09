'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface DisciplinaryMeasuresFiltersProps {
  filters: {
    search: string;
    type: string;
    status: string;
    arbitrator: string;
    dateFrom: string;
    dateTo: string;
    appealStatus?: string;
    managerId?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function DisciplinaryMeasuresFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: DisciplinaryMeasuresFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const typeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'warning', label: 'Предупреждение' },
    { value: 'reprimand', label: 'Выговор' },
    { value: 'suspension', label: 'Приостановление' },
    { value: 'exclusion', label: 'Исключение' }
  ];

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Действует' },
    { value: 'cancelled', label: 'Отменена' },
    { value: 'expired', label: 'Истекла' }
  ];

  const appealStatusOptions = [
    { value: '', label: 'Статус апелляции' },
    { value: 'none', label: 'Нет' },
    { value: 'submitted', label: 'Подана' },
    { value: 'reviewed', label: 'Рассмотрена' },
    { value: 'approved', label: 'Удовлетворена' },
    { value: 'rejected', label: 'Отклонена' }
  ];

  const arbitratorOptions = [
    { value: '', label: 'Все арбитражные управляющие' },
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-1"
          >
            <FunnelIcon className="h-4 w-4" />
            <span>{showAdvanced ? 'Скрыть' : 'Расширенные'}</span>
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Очистить</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Поиск */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по ФИО, ИНН, основанию, описанию..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Тип меры */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип меры
          </label>
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            options={typeOptions}
          />
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>

        {/* Арбитражный управляющий */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Арбитражный управляющий
          </label>
          <Select
            value={filters.arbitrator}
            onChange={(e) => handleFilterChange('arbitrator', e.target.value)}
            options={arbitratorOptions}
          />
        </div>

        {/* Статус апелляции */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Апелляция
          </label>
          <Select
            value={filters.appealStatus || ''}
            onChange={(e) => handleFilterChange('appealStatus', e.target.value)}
            options={appealStatusOptions}
          />
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Период применения меры</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
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
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Тип: {typeOptions.find(opt => opt.value === filters.type)?.label}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-orange-400 hover:bg-orange-200 hover:text-orange-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Статус: {statusOptions.find(opt => opt.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.appealStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Апелляция: {appealStatusOptions.find(opt => opt.value === filters.appealStatus)?.label}
                <button
                  onClick={() => handleFilterChange('appealStatus', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.arbitrator && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                АУ: {filters.arbitrator}
                <button
                  onClick={() => handleFilterChange('arbitrator', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {(filters.dateFrom || filters.dateTo) && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Период: {filters.dateFrom || '...'} - {filters.dateTo || '...'}
                <button
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
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
