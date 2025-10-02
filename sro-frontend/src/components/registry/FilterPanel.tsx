'use client';

import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  FunnelIcon, 
  XMarkIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { SearchFilters } from './SearchForm';

interface FilterPanelProps {
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  activeFilters: SearchFilters;
  stats: {
    total: number;
    active: number;
    excluded: number;
    suspended: number;
  };
}

export default function FilterPanel({ onFilterChange, activeFilters, stats }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusFilter = (status: SearchFilters['status']) => {
    onFilterChange({ status });
  };

  const handleRegionFilter = (region: string) => {
    onFilterChange({ region: region || undefined });
  };

  const clearAllFilters = () => {
    onFilterChange({
      status: 'active',
      region: undefined
    });
  };

  const hasActiveFilters = activeFilters.status !== 'active' || activeFilters.region;

  return (
    <div className="space-y-6">
      {/* Основные фильтры */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Фильтры
            </h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Сбросить
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Статус
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="all"
                    checked={activeFilters.status === 'all'}
                    onChange={() => handleStatusFilter('all')}
                    className="h-4 w-4 text-beige-600 focus:ring-beige-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700">Все</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={activeFilters.status === 'active'}
                    onChange={() => handleStatusFilter('active')}
                    className="h-4 w-4 text-beige-600 focus:ring-beige-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                    Действующие ({stats.active})
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="excluded"
                    checked={activeFilters.status === 'excluded'}
                    onChange={() => handleStatusFilter('excluded')}
                    className="h-4 w-4 text-beige-600 focus:ring-beige-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700 flex items-center">
                    <XMarkIcon className="h-4 w-4 mr-1 text-red-500" />
                    Исключенные ({stats.excluded})
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="suspended"
                    checked={activeFilters.status === 'suspended'}
                    onChange={() => handleStatusFilter('suspended')}
                    className="h-4 w-4 text-beige-600 focus:ring-beige-500 border-neutral-300"
                  />
                  <span className="ml-2 text-sm text-neutral-700 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1 text-yellow-500" />
                    Приостановленные ({stats.suspended})
                  </span>
                </label>
              </div>
            </div>

            {/* Регион */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Регион
              </label>
              <select
                value={activeFilters.region || ''}
                onChange={(e) => handleRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-beige-500 focus:border-beige-500 text-sm"
              >
                <option value="">Все регионы</option>
                <option value="Москва">Москва</option>
                <option value="Санкт-Петербург">Санкт-Петербург</option>
                <option value="Московская область">Московская область</option>
                <option value="Ленинградская область">Ленинградская область</option>
                <option value="Краснодарский край">Краснодарский край</option>
                <option value="Свердловская область">Свердловская область</option>
                <option value="Новосибирская область">Новосибирская область</option>
                <option value="Республика Татарстан">Республика Татарстан</option>
                <option value="Нижегородская область">Нижегородская область</option>
                <option value="Челябинская область">Челябинская область</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Статистика
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600 flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Всего в реестре:
              </span>
              <span className="text-sm font-medium text-neutral-900">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600 flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                Действующие:
              </span>
              <span className="text-sm font-medium text-green-600">{stats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600 flex items-center">
                <XMarkIcon className="h-4 w-4 mr-2 text-red-500" />
                Исключенные:
              </span>
              <span className="text-sm font-medium text-red-600">{stats.excluded}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-500" />
                Приостановленные:
              </span>
              <span className="text-sm font-medium text-yellow-600">{stats.suspended}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
