'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/admin/ui/Button';
import { disciplinaryMeasuresService } from '@/services/admin/disciplinaryMeasures';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function DisciplinaryMeasureViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [measure, setMeasure] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disciplinaryMeasuresService.get(id);
        setMeasure(data);
      } catch (e: any) {
        setError('Не удалось загрузить дисциплинарную меру');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/disciplinary-measures')} className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Просмотр дисциплинарной меры</h1>
          </div>
          {id && (
            <Button onClick={() => router.push(`/disciplinary-measures/${id}/edit`)} className="flex items-center gap-2">
              <PencilIcon className="h-4 w-4" />
              Редактировать
            </Button>
          )}
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow border p-8 text-center">Загрузка...</div>
        )}

        {error && (
          <div className="bg-white rounded-xl shadow border p-8 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && measure && (
          <div className="bg-white rounded-xl shadow border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500">Арбитражный управляющий</div>
              <div className="text-gray-900 font-medium">{measure.arbitratorName || '—'}</div>
              <div className="text-gray-500 text-sm">ИНН: {measure.arbitratorInn || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Тип меры</div>
              <div className="text-gray-900 font-medium">{measure.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Статус</div>
              <div className="text-gray-900 font-medium">{measure.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Дата применения</div>
              <div className="text-gray-900 font-medium">{new Date(measure.date).toLocaleDateString('ru-RU')}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-500">Номер решения</div>
              <div className="text-gray-900 font-medium break-words">{measure.decisionNumber || '—'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-500">Основание</div>
              <div className="text-gray-900">{measure.reason || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Статус апелляции</div>
              <div className="text-gray-900">{measure.appealStatus || 'none'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Дедлайн апелляции</div>
              <div className="text-gray-900">{measure.appealDeadline ? new Date(measure.appealDeadline).toLocaleDateString('ru-RU') : '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Дата апелляции</div>
              <div className="text-gray-900">{measure.appealDate ? new Date(measure.appealDate).toLocaleDateString('ru-RU') : '—'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Решение по апелляции</div>
              <div className="text-gray-900">{measure.appealDecision || '—'}</div>
            </div>
            {measure.appealNotes && (
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Заметки по апелляции</div>
                <div className="text-gray-900 whitespace-pre-wrap">{measure.appealNotes}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


