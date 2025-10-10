'use client';

import { useState } from 'react';
import { Arbitrator, ArbitratorFilters } from '@/types/admin';
import { Button } from '@/components/admin/ui/Button';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ArbitratorsListProps {
  arbitrators?: Arbitrator[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onFiltersChange: (filters: Partial<ArbitratorFilters>) => void;
}

export function ArbitratorsList({
  arbitrators,
  loading,
  error,
  pagination,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onView,
  onDelete,
  onFiltersChange,
}: ArbitratorsListProps) {
  const [sortField, setSortField] = useState<keyof Arbitrator>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Arbitrator) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    onFiltersChange({ sortBy: field, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' });
  };

  const getStatusBadge = (status: Arbitrator['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Действительный' },
      excluded: { color: 'bg-red-100 text-red-800', label: 'Исключен' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Приостановлен' },
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const isAllSelected = arbitrators && arbitrators.length > 0 && selectedIds.length === arbitrators.length;
  const isPartiallySelected = arbitrators && selectedIds.length > 0 && selectedIds.length < arbitrators.length;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="text-red-500 mb-2">Ошибка загрузки данных</div>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!arbitrators || arbitrators.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center">
          <div className="text-gray-500 mb-2">Арбитражные управляющие не найдены</div>
          <p className="text-sm text-gray-400">Попробуйте изменить фильтры поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Заголовок таблицы */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div className="flex items-center">
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => onSelectAll((e.target as HTMLInputElement).checked)}
              size="sm"
            />
            <span className="ml-2 text-sm font-medium text-gray-900">
              Выбрать все ({arbitrators?.length || 0})
            </span>
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('fullName')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>ФИО</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('inn')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>ИНН</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('registryNumber')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Номер в реестре</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Статус</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('region')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Регион</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('joinDate')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Дата включения</span>
                  <ChevronUpDownIcon className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {arbitrators?.map((arbitrator) => (
              <tr key={arbitrator.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedIds.includes(arbitrator.id)}
                      onChange={(e) => onSelectOne(arbitrator.id, (e.target as HTMLInputElement).checked)}
                      size="sm"
                      className="mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {arbitrator.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {arbitrator.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {arbitrator.inn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {arbitrator.registryNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(arbitrator.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {arbitrator.region && (
                      <div>{arbitrator.region}</div>
                    )}
                    {arbitrator.city && (
                      <div className="text-gray-500">{arbitrator.city}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(arbitrator.joinDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(arbitrator.id)}
                      className="flex items-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Просмотр</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(arbitrator.id)}
                      className="flex items-center space-x-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Редактировать</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(arbitrator.id)}
                      className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Удалить</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total} записей
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFiltersChange({ page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="flex items-center space-x-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Предыдущая</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  const isActive = page === pagination.page;
                  
                  return (
                    <Button
                      key={page}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => onFiltersChange({ page })}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFiltersChange({ page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.pages}
                className="flex items-center space-x-1"
              >
                <span>Следующая</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
