'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/components/admin/ui/Table';
import { Checkbox } from '@/components/admin/ui/Checkbox';
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
  status: 'active' | 'cancelled' | 'expired';
  date: string;
  reason: string;
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
  const router = useRouter();
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
      <Badge color={config.color} size="sm" className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'red' as const, text: 'Действует', icon: CheckCircleIcon },
      cancelled: { color: 'green' as const, text: 'Отменена', icon: CheckCircleIcon },
      expired: { color: 'gray' as const, text: 'Истекла', icon: XCircleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge color={config.color} size="sm" className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
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
          <div className="text-lg font-semibold text-red-600 mb-2">Ошибка загрузки дисциплинарных мер</div>
          <div className="text-base text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (measures.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-gray-400" />
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">Дисциплинарные меры не найдены</div>
          <div className="text-base text-gray-500">
            Создайте первую дисциплинарную меру, нажав кнопку "Создать меру"
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: 'select',
      title: (
        <Checkbox
          checked={selectedMeasures.length === measures.length && measures.length > 0}
          onChange={(e) => handleSelectAll((e.target as HTMLInputElement).checked)}
          size="sm"
          className="cursor-pointer"
        />
      ),
      render: (value: any, measure: DisciplinaryMeasure) => (
        <Checkbox
          checked={selectedMeasures.includes(measure.id)}
          onChange={(e) => handleSelectMeasure(measure.id, (e.target as HTMLInputElement).checked)}
          size="sm"
          className="cursor-pointer"
        />
      ),
      width: 'w-10'
    },
    {
      key: 'arbitratorName',
      title: 'Арбитражный управляющий',
      sortable: true,
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div>
          <div className="font-medium text-sm text-gray-900">{measure.arbitratorName || 'Не указано'}</div>
          <div className="text-xs text-gray-500">ИНН: {measure.arbitratorInn || '—'}</div>
        </div>
      ),
      width: 'w-48'
    },
    {
      key: 'type',
      title: 'Тип меры',
      render: (value: any, measure: DisciplinaryMeasure) => getTypeBadge(measure.type),
      width: 'w-40'
    },
    {
      key: 'status',
      title: 'Статус',
      render: (value: any, measure: DisciplinaryMeasure) => getStatusBadge(measure.status),
      width: 'w-28'
    },
    {
      key: 'date',
      title: 'Дата',
      sortable: true,
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{formatDate(measure.date)}</div>
        </div>
      ),
      width: 'w-24'
    },
    {
      key: 'reason',
      title: 'Основание',
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div className="max-w-xs truncate text-sm text-gray-700" title={measure.reason}>
          {measure.reason || 'Нет описания'}
        </div>
      ),
      width: 'w-64'
    },
    {
      key: 'actions',
      title: 'Действия',
      render: (value: any, measure: DisciplinaryMeasure) => (
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" onClick={() => router.push(`/disciplinary-measures/${measure.id}`)} title="Просмотр">
            <EyeIcon className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/disciplinary-measures/${measure.id}/edit`)} title="Редактировать">
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(measure.id)} title="Удалить" className="text-red-600 hover:text-red-700">
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
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
          data={measures}
          onSort={handleSort}
          sortKey={sortField}
          sortDirection={sortDirection}
          className="min-w-full"
        />
      </div>
      {measures.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              Показано <span className="font-semibold text-gray-900">{measures.length}</span> {measures.length === 1 ? 'мера' : measures.length < 5 ? 'меры' : 'мер'}
            </span>
            {selectedMeasures.length > 0 && (
              <span className="text-red-600 font-semibold">
                Выбрано: {selectedMeasures.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
