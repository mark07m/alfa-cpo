'use client';

import { useState } from 'react';
import { Table } from '@/components/admin/ui/Table';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Inspection {
  id: string;
  arbitratorName: string;
  arbitratorInn: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string;
  actualDate?: string;
  description: string;
  result?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InspectionsListProps {
  inspections: Inspection[];
  loading: boolean;
  error: string | null;
  selectedInspections: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit: (inspection: Inspection) => void;
  onDelete: (id: string) => void;
}

export function InspectionsList({
  inspections,
  loading,
  error,
  selectedInspections,
  onSelectionChange,
  onEdit,
  onDelete
}: InspectionsListProps) {
  const [sortField, setSortField] = useState<string>('plannedDate');
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
      onSelectionChange(inspections.map(inspection => inspection.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectInspection = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedInspections, id]);
    } else {
      onSelectionChange(selectedInspections.filter(selectedId => selectedId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: 'blue' as const, text: 'Запланирована', icon: ClockIcon },
      in_progress: { color: 'yellow' as const, text: 'В процессе', icon: ClockIcon },
      completed: { color: 'green' as const, text: 'Завершена', icon: CheckCircleIcon },
      cancelled: { color: 'red' as const, text: 'Отменена', icon: XCircleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge color={config.color} className="flex items-center space-x-1">
        <Icon className="h-4 w-4" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge color={type === 'planned' ? 'blue' : 'purple'}>
        {type === 'planned' ? 'Плановая' : 'Внеплановая'}
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
          <div className="text-red-600 mb-2">Ошибка загрузки проверок</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    );
  }

  if (inspections.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="text-gray-500 mb-4">Проверки не найдены</div>
          <div className="text-sm text-gray-400">
            Создайте первую проверку, нажав кнопку "Создать проверку"
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
          checked={selectedInspections.length === inspections.length && inspections.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (value: any, inspection: Inspection) => (
        <input
          type="checkbox"
          checked={selectedInspections.includes(inspection.id)}
          onChange={(e) => handleSelectInspection(inspection.id, e.target.checked)}
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
      render: (value: any, inspection: Inspection) => (
        <div>
          <div className="font-medium text-gray-900">{inspection.arbitratorName}</div>
          <div className="text-sm text-gray-500">ИНН: {inspection.arbitratorInn}</div>
        </div>
      )
    },
    {
      key: 'inspectorName',
      header: (
        <button
          onClick={() => handleSort('inspectorName')}
          className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
        >
          <span>Инспектор</span>
          {sortField === 'inspectorName' && (
            <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      ),
      render: (value: any, inspection: Inspection) => (
        <div className="text-gray-900">{inspection.inspectorName}</div>
      )
    },
    {
      key: 'type',
      header: 'Тип',
      render: (value: any, inspection: Inspection) => getTypeBadge(inspection.type)
    },
    {
      key: 'status',
      header: 'Статус',
      render: (value: any, inspection: Inspection) => getStatusBadge(inspection.status)
    },
    {
      key: 'plannedDate',
      header: (
        <button
          onClick={() => handleSort('plannedDate')}
          className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
        >
          <span>Дата проверки</span>
          {sortField === 'plannedDate' && (
            <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      ),
      render: (value: any, inspection: Inspection) => (
        <div>
          <div className="text-gray-900">{formatDate(inspection.plannedDate)}</div>
          {inspection.actualDate && (
            <div className="text-sm text-gray-500">
              Факт: {formatDate(inspection.actualDate)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Описание',
      render: (value: any, inspection: Inspection) => (
        <div className="max-w-xs truncate text-gray-900" title={inspection.description}>
          {inspection.description}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Действия',
      render: (value: any, inspection: Inspection) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(inspection)}
            className="flex items-center space-x-1"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Изменить</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(inspection.id)}
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
        data={inspections}
        className="min-w-full divide-y divide-gray-200"
      />
    </div>
  );
}
