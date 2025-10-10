'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';
import { inspectionsService } from '@/services/admin/inspections';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon
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

export default function InspectionViewPage() {
  const router = useRouter();
  const params = useParams();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await inspectionsService.getById(params.id as string);
        if (!mounted) return;
        // Приводим к локальной форме
        setInspection({
          id: data.id,
          arbitratorName: data.arbitratorName,
          arbitratorInn: data.arbitratorInn,
          inspectorName: data.inspectorName,
          type: data.type,
          status: data.status,
          plannedDate: data.plannedDate,
          actualDate: data.actualDate || undefined,
          description: data.description,
          result: data.result,
          notes: data.notes,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } catch (e) {
        if (mounted) setError('Не удалось загрузить данные проверки');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [params.id]);

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
      <Badge color={config.color} size="md" className="flex items-center space-x-1.5">
        <Icon className="h-4 w-4" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge color={type === 'planned' ? 'blue' : 'purple'} size="md">
        {type === 'planned' ? 'Плановая' : 'Внеплановая'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.push('/inspections')} className="mt-4">
            Вернуться к списку
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (!inspection) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Проверка не найдена</p>
          <Button onClick={() => router.push('/inspections')} className="mt-4">
            Вернуться к списку
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <PageHeader
          title={`Проверка #${inspection.id}`}
          subtitle={`Создано: ${formatDateTime(inspection.createdAt)} • Обновлено: ${formatDateTime(inspection.updatedAt)}`}
          backUrl="/inspections"
          backLabel="К проверкам"
          badge={
            <div className="flex items-center gap-2">
              {getStatusBadge(inspection.status)}
              {getTypeBadge(inspection.type)}
            </div>
          }
          primaryAction={{
            label: 'Редактировать',
            onClick: () => router.push(`/inspections/${inspection.id}/edit`),
            variant: 'primary'
          }}
        />

        {/* Основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Арбитражный управляющий */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <UserIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Арбитражный управляющий</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">ФИО</span>
                <p className="text-base font-medium text-gray-900">{inspection.arbitratorName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">ИНН</span>
                <p className="text-base font-medium text-gray-900">{inspection.arbitratorInn}</p>
              </div>
            </div>
          </div>

          {/* Инспектор */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <UserIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Инспектор</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">ФИО</span>
                <p className="text-base font-medium text-gray-900">{inspection.inspectorName}</p>
              </div>
            </div>
          </div>

          {/* Даты */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Даты проверки</h2>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Плановая дата</span>
                <p className="text-base font-medium text-gray-900">{formatDate(inspection.plannedDate)}</p>
              </div>
              {inspection.actualDate && (
                <div>
                  <span className="text-sm text-gray-500">Фактическая дата</span>
                  <p className="text-base font-medium text-gray-900">{formatDate(inspection.actualDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Описание */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DocumentTextIcon className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-900">Описание</h2>
            </div>
            <p className="text-base text-gray-700">{inspection.description}</p>
          </div>
        </div>

        {/* Примечания и результаты */}
        {(inspection.notes || inspection.result) && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Дополнительная информация</h2>
            <div className="space-y-4">
              {inspection.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Примечания</span>
                  <p className="text-base text-gray-700 mt-1">{inspection.notes}</p>
                </div>
              )}
              {inspection.result && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Результат</span>
                  <p className="text-base text-gray-700 mt-1">{inspection.result}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

