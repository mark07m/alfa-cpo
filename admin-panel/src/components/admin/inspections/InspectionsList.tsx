'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
      <Badge color={config.color} size="sm" className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge color={type === 'planned' ? 'blue' : 'purple'} size="sm">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded-lg w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-lg font-semibold text-red-600 mb-2">Ошибка загрузки проверок</div>
          <div className="text-base text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (inspections.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <ClockIcon className="h-10 w-10 text-gray-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">Проверки не найдены</div>
          <div className="text-base text-gray-500">
            Создайте первую проверку, нажав кнопку "Создать проверку"
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedInspections.length === inspections.length && inspections.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
      ),
      render: (value: any, inspection: Inspection) => (
        <input
          type="checkbox"
          checked={selectedInspections.includes(inspection.id)}
          onChange={(e) => handleSelectInspection(inspection.id, e.target.checked)}
          className="w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
      ),
      width: 'w-10'
    },
    {
      key: 'arbitratorName',
      title: 'Арбитражный управляющий',
      sortable: true,
      render: (value: any, inspection: Inspection) => (
        <div>
          <div className="font-medium text-sm text-gray-900">{inspection.arbitratorName || 'Не указано'}</div>
          <div className="text-xs text-gray-500">ИНН: {inspection.arbitratorInn || '—'}</div>
        </div>
      ),
      width: 'w-48'
    },
    {
      key: 'inspectorName',
      title: 'Инспектор',
      sortable: true,
      render: (value: any, inspection: Inspection) => (
        <div className="flex items-center space-x-1.5">
          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-amber-700">{inspection.inspectorName?.charAt(0) || '?'}</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{inspection.inspectorName}</span>
        </div>
      ),
      width: 'w-36'
    },
    {
      key: 'type',
      title: 'Тип',
      render: (value: any, inspection: Inspection) => getTypeBadge(inspection.type),
      width: 'w-28'
    },
    {
      key: 'status',
      title: 'Статус',
      render: (value: any, inspection: Inspection) => getStatusBadge(inspection.status),
      width: 'w-36'
    },
    {
      key: 'plannedDate',
      title: 'Дата',
      sortable: true,
      render: (value: any, inspection: Inspection) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{formatDate(inspection.plannedDate)}</div>
          {inspection.actualDate && (
            <div className="text-xs text-gray-500">
              Факт: {formatDate(inspection.actualDate)}
            </div>
          )}
        </div>
      ),
      width: 'w-24'
    },
    {
      key: 'description',
      title: 'Описание',
      render: (value: any, inspection: Inspection) => (
        <div className="max-w-xs truncate text-sm text-gray-700" title={inspection.description}>
          {inspection.description || 'Нет описания'}
        </div>
      ),
      width: 'w-64'
    },
    {
      key: 'actions',
      title: 'Действия',
      render: (value: any, inspection: Inspection) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => router.push(`/inspections/${inspection.id}`)}
            className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-400 text-gray-600 hover:text-blue-700 transition-all duration-150"
            title="Просмотр"
          >
            <EyeIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => router.push(`/inspections/${inspection.id}/edit`)}
            className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-amber-50 hover:border-amber-400 text-gray-600 hover:text-amber-700 transition-all duration-150"
            title="Редактировать"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(inspection.id)}
            className="p-1.5 rounded-md border border-gray-300 bg-white hover:bg-red-50 hover:border-red-400 text-red-600 hover:text-red-700 transition-all duration-150"
            title="Удалить"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      width: 'w-28'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={inspections}
          onSort={handleSort}
          sortKey={sortField}
          sortDirection={sortDirection}
          className="min-w-full"
        />
      </div>
      {inspections.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Показано <span className="font-semibold text-gray-900">{inspections.length}</span> {inspections.length === 1 ? 'проверка' : inspections.length < 5 ? 'проверки' : 'проверок'}
            </span>
            {selectedInspections.length > 0 && (
              <span className="text-amber-600 font-semibold">
                Выбрано: {selectedInspections.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
