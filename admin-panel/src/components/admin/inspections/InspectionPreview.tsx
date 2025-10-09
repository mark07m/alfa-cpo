'use client';

import { useEffect, useState } from 'react';
import { inspectionsService, UiInspection } from '@/services/admin/inspections';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import {
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface InspectionPreviewProps {
  inspectionId: string;
  onClose: () => void;
}

export function InspectionPreview({ inspectionId, onClose }: InspectionPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspection, setInspection] = useState<UiInspection | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await inspectionsService.getById(inspectionId);
        if (mounted) setInspection(data);
      } catch (e) {
        if (mounted) setError('Не удалось загрузить проверку');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [inspectionId]);

  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { color: 'blue', text: 'Запланирована', icon: ClockIcon },
      in_progress: { color: 'yellow', text: 'В процессе', icon: ClockIcon },
      completed: { color: 'green', text: 'Завершена', icon: CheckCircleIcon },
      cancelled: { color: 'red', text: 'Отменена', icon: XCircleIcon }
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Просмотр проверки</h2>
          <Button variant="outline" size="sm" onClick={onClose} className="flex items-center space-x-1">
            <XMarkIcon className="h-4 w-4" />
            <span>Закрыть</span>
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="text-gray-500">Загрузка...</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}
          {!loading && !error && inspection && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge color={getStatusConfig(inspection.status).color as any} className="flex items-center space-x-1">
                    {(() => {
                      const Icon = getStatusConfig(inspection.status).icon;
                      return <Icon className="h-4 w-4" />;
                    })()}
                    <span>{getStatusConfig(inspection.status).text}</span>
                  </Badge>
                  <Badge color={inspection.type === 'planned' ? 'blue' : 'purple'}>
                    {inspection.type === 'planned' ? 'Плановая' : 'Внеплановая'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(inspection.plannedDate)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Арбитражный управляющий
                </h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-900">{inspection.arbitratorName}</div>
                  <div className="text-sm text-gray-500">ИНН: {inspection.arbitratorInn}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Инспектор</h4>
                <div className="text-gray-900">{inspection.inspectorName}</div>
              </div>

              {inspection.actualDate && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Фактическая дата</h4>
                  <div className="text-gray-900">{formatDate(inspection.actualDate)}</div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Описание проверки</h4>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{inspection.description}</div>
              </div>

              {inspection.result && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Результат</h4>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{inspection.result}</div>
                </div>
              )}

              {inspection.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Примечания</h4>
                  <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{inspection.notes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


