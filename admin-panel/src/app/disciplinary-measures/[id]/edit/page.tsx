'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { DisciplinaryMeasureForm } from '@/components/admin/disciplinary/DisciplinaryMeasureForm';
import { disciplinaryMeasuresService } from '@/services/admin/disciplinaryMeasures';

export default function DisciplinaryMeasureEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [measure, setMeasure] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disciplinaryMeasuresService.get(id);
        // Форме нужны поля: arbitratorId, arbitratorName, arbitratorInn, type, status, date, reason, decisionNumber, апелляция*
        const mapped = {
          arbitratorId: '',
          arbitratorName: data.arbitratorName || '',
          arbitratorInn: data.arbitratorInn || '',
          type: data.type,
          status: (data.status as any) || 'active',
          date: data.date,
          reason: data.reason || '',
          decisionNumber: (data as any).decisionNumber || '',
          appealDeadline: (data as any).appealDeadline || '',
          appealStatus: (data as any).appealStatus || 'none',
          appealNotes: (data as any).appealNotes || '',
          appealDate: (data as any).appealDate || '',
          appealDecision: (data as any).appealDecision || ''
        };
        setMeasure(mapped);
      } catch (e: any) {
        setError('Не удалось загрузить дисциплинарную меру');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      await disciplinaryMeasuresService.update(id, data);
      router.push(`/disciplinary-measures/${id}`);
    } catch (e: any) {
      setError('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Редактирование дисциплинарной меры"
          subtitle={measure?.arbitratorName}
          backUrl={`/disciplinary-measures/${id}`}
          backLabel="К дисциплинарной мере"
        />

        {loading && (
          <div className="bg-white rounded-xl shadow border p-8 text-center">Загрузка...</div>
        )}

        {error && (
          <div className="bg-white rounded-xl shadow border p-8 text-center text-red-600">{error}</div>
        )}

        {!loading && !error && measure && (
          <DisciplinaryMeasureForm
            measure={measure as any}
            onSave={handleSave}
            onCancel={() => router.push(`/disciplinary-measures/${id}`)}
            isModal={false}
          />
        )}

        {saving && (
          <div className="text-sm text-gray-500 text-center">Сохранение...</div>
        )}
      </div>
    </AdminLayout>
  );
}


