'use client';

import { useState } from 'react';
import { Table } from '@/components/admin/ui/Table';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DisciplinaryMeasure {
  id: string;
  arbitratorName: string;
  arbitratorInn: string;
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension';
  status: 'active' | 'appealed' | 'cancelled' | 'expired';
  date: string;
  reason: string;
  description: string;
  duration?: string;
  appealDate?: string;
  appealResult?: string;
  createdAt: string;
  updatedAt: string;
}

interface DisciplinaryMeasuresListProps {
  measures: DisciplinaryMeasure[];
  loading: boolean;
  error: string | null;
  selectedMeasures: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (measure: DisciplinaryMeasure) => void;
  onDelete: (id: string) => void;
}

export function DisciplinaryMeasuresList({
  measures,
  loading,
  error,
  selectedMeasures,
  onSelectionChange,
  onEdit,
  onDelete
}: DisciplinaryMeasuresListProps) {
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(measures.map(measure => measure.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectMeasure = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedMeasures, id]);
    } else {
      onSelectionChange(selectedMeasures.filter(selectedId => selectedId !== id));
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      warning: { color: 'yellow' as const, text: 'Предупреждение', icon: ExclamationTriangleIcon },
      reprimand: { color: 'purple' as const, text: 'Выговор', icon: ExclamationTriangleIcon },
      suspension: { color: 'red' as const, text: 'Приостановление', icon: XCircleIcon },
      exclusion: { color: 'red' as const, text: 'Исключение', icon: XCircleIcon }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.warning;
    const Icon = config.icon;

    return (
      <Badge color={config.color} className="flex items-center space-x-1">
        <Icon className="h-4 w-4" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'red' as const, text: 'Действует', icon: CheckCircleIcon },
      appealed: { color: 'yellow' as const, text: 'Обжалуется', icon: ExclamationTriangleIcon },
      cancelled: { color: 'green' as const, text: 'Отменена', icon: CheckCircleIcon },
      expired: { color: 'gray' as const, text: 'Истекла', icon: XCircleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge color={config.color} className="flex items-center space-x-1">
        <Icon className="h-4 w-4" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="text-red-600 mb-2">Ошибка загрузки дисциплинарных мер</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (measures.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-4">Дисциплинарные меры не найдены</div>
          <div className="text-sm text-gray-400">
            Создайте первую дисциплинарную меру, нажав кнопку "Создать меру"
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedMeasures.length === measures.length && measures.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (value: any, measure: DisciplinaryMeasure) => (
        <input
          type="checkbox"
          checked={selectedMeasures.includes(measure.id)}
          onChange={(e) => handleSelectMeasure(measure.id, e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    {
      key: 'arbitratorName',
      header: (
        <button
          onClick={() => handleSort('arbitratorName')}
          className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
        >
          <span>Арбитражный управляющий</span>
          {sortField === 'arbitratorName' && (
            <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      ),
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div>
          <div className="font-medium text-gray-900">{measure.arbitratorName}</div>
          <div className="text-sm text-gray-500">ИНН: {measure.arbitratorInn}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Тип меры',
      render: (value: any, measure: DisciplinaryMeasure) => getTypeBadge(measure.type)
    },
    {
      key: 'status',
      header: 'Статус',
      render: (value: any, measure: DisciplinaryMeasure) => getStatusBadge(measure.status)
    },
    {
      key: 'date',
      header: (
        <button
          onClick={() => handleSort('date')}
          className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
        >
          <span>Дата применения</span>
          {sortField === 'date' && (
            <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      ),
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div>
          <div className="text-gray-900">{formatDate(measure.date)}</div>
          {measure.duration && (
            <div className="text-sm text-gray-500">
              Срок: {measure.duration}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'reason',
      header: 'Основание',
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div className="max-w-xs truncate text-gray-900" title={measure.reason}>
          {measure.reason}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Описание',
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div className="max-w-xs truncate text-gray-900" title={measure.description}>
          {measure.description}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Действия',
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(measure)}
            className="flex items-center space-x-1"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Изменить</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(measure.id)}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Удалить</span>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Table
        columns={columns}
        data={measures}
        className="min-w-full divide-y divide-gray-200"
      />
    </div>
  );
}
