'use client';

import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon
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
}

interface InspectionDetailsProps {
  inspection: Inspection | null;
  selectedDate: Date | null;
  onCreateInspection: () => void;
}

export function InspectionDetails({
  inspection,
  selectedDate,
  onCreateInspection
}: InspectionDetailsProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      scheduled: { color: 'blue', text: 'Запланирована', icon: ClockIcon },
      in_progress: { color: 'yellow', text: 'В процессе', icon: ClockIcon },
      completed: { color: 'green', text: 'Завершена', icon: CheckCircleIcon },
      cancelled: { color: 'red', text: 'Отменена', icon: XCircleIcon }
    };
    return configs[status as keyof typeof configs] || configs.scheduled;
  };

  const getTypeConfig = (type: string) => {
    return {
      planned: { color: 'blue', text: 'Плановая' },
      unplanned: { color: 'purple', text: 'Внеплановая' }
    }[type as keyof { planned: any; unplanned: any }] || { color: 'gray', text: 'Неизвестно' };
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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!selectedDate) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Выберите дату
          </h3>
          <p className="text-gray-500 mb-4">
            Выберите дату в календаре для просмотра проверок
          </p>
          <Button onClick={onCreateInspection} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Создать проверку</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {formatDateShort(selectedDate.toISOString())}
          </h3>
          <p className="text-gray-500 mb-4">
            На эту дату проверок не запланировано
          </p>
          <Button onClick={onCreateInspection} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Создать проверку</span>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(inspection.status);
  const typeConfig = getTypeConfig(inspection.type);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Детали проверки
          </h3>
          <div className="flex space-x-2">
            <Badge color={statusConfig.color as any} className="flex items-center space-x-1">
              <StatusIcon className="h-4 w-4" />
              <span>{statusConfig.text}</span>
            </Badge>
            <Badge color={typeConfig.color as any}>
              {typeConfig.text}
            </Badge>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {formatDateShort(inspection.plannedDate)}
        </div>
      </div>

      {/* Содержимое */}
      <div className="p-6 space-y-6">
        {/* Арбитражный управляющий */}
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

        {/* Инспектор */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Инспектор
          </h4>
          <div className="text-gray-900">{inspection.inspectorName}</div>
        </div>

        {/* Даты */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Планируемая дата
            </h4>
            <div className="text-gray-900">{formatDate(inspection.plannedDate)}</div>
          </div>
          {inspection.actualDate && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Фактическая дата
              </h4>
              <div className="text-gray-900">{formatDate(inspection.actualDate)}</div>
            </div>
          )}
        </div>

        {/* Описание */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Описание проверки
          </h4>
          <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {inspection.description}
          </div>
        </div>

        {/* Результат */}
        {inspection.result && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Результат проверки
            </h4>
            <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
              {inspection.result}
            </div>
          </div>
        )}

        {/* Примечания */}
        {inspection.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Примечания
            </h4>
            <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
              {inspection.notes}
            </div>
          </div>
        )}

        {/* Действия */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Редактировать
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Дублировать
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
