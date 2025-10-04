'use client';

import { useState, useEffect } from 'react';
import { AccreditedOrganizationFilters } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AccreditedOrganizationsFiltersProps {
  filters: AccreditedOrganizationFilters;
  onFiltersChange: (filters: AccreditedOrganizationFilters) => void;
  onReset: () => void;
}

export function AccreditedOrganizationsFilters({
  filters,
  onFiltersChange,
  onReset
}: AccreditedOrganizationsFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AccreditedOrganizationFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof AccreditedOrganizationFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: AccreditedOrganizationFilters = {};
    setLocalFilters(resetFilters);
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'active', label: 'Активна' },
    { value: 'suspended', label: 'Приостановлена' },
    { value: 'revoked', label: 'Отозвана' },
    { value: 'expired', label: 'Истекла' }
  ];

  const typeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'educational', label: 'Образовательная' },
    { value: 'training', label: 'Обучающая' },
    { value: 'assessment', label: 'Оценочная' },
    { value: 'other', label: 'Прочая' }
  ];

  const regionOptions = [
    { value: '', label: 'Все регионы' },
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'ekaterinburg', label: 'Екатеринбург' },
    { value: 'novosibirsk', label: 'Новосибирск' },
    { value: 'kazan', label: 'Казань' },
    { value: 'other', label: 'Другие' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Сбросить</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Скрыть' : 'Расширенные'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Поиск */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Название, ИНН, ОГРН, номер аккредитации..."
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <Select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
          />
        </div>

        {/* Тип аккредитации */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип аккредитации
          </label>
          <Select
            value={localFilters.accreditationType || ''}
            onChange={(e) => handleFilterChange('accreditationType', e.target.value)}
            options={typeOptions}
          />
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Регион */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Регион
              </label>
              <Select
                value={localFilters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                options={regionOptions}
              />
            </div>

            {/* Дата аккредитации от */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата аккредитации от
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Дата аккредитации до */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата аккредитации до
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Быстрые фильтры */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={localFilters.status === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', localFilters.status === 'active' ? '' : 'active')}
        >
          Активные
        </Button>
        <Button
          variant={localFilters.status === 'expired' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', localFilters.status === 'expired' ? '' : 'expired')}
        >
          Истекшие
        </Button>
        <Button
          variant={localFilters.accreditationType === 'educational' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('accreditationType', localFilters.accreditationType === 'educational' ? '' : 'educational')}
        >
          Образовательные
        </Button>
        <Button
          variant={localFilters.accreditationType === 'training' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('accreditationType', localFilters.accreditationType === 'training' ? '' : 'training')}
        >
          Обучающие
        </Button>
      </div>
    </div>
  );
}
