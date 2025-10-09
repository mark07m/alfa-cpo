'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/admin/ui/Button';
import { DisciplinaryMeasureForm } from '@/components/admin/disciplinary/DisciplinaryMeasureForm';
import { disciplinaryMeasuresService } from '@/services/admin/disciplinaryMeasures';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function DisciplinaryMeasureNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      const created = await disciplinaryMeasuresService.create(data);
      router.push(`/disciplinary-measures/${created.id}`);
    } catch (e: any) {
      setError('Не удалось создать дисциплинарную меру');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/disciplinary-measures')} className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Назад
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Создать дисциплинарную меру</h1>
          </div>
        </div>

        {error && (
          <div className="bg-white rounded-xl shadow border p-8 text-center text-red-600">{error}</div>
        )}

        <DisciplinaryMeasureForm
          onSave={handleSave}
          onCancel={() => router.push('/disciplinary-measures')}
          isModal={false}
        />

        {saving && (
          <div className="text-sm text-gray-500 text-center">Сохранение...</div>
        )}
      </div>
    </AdminLayout>
  );
}


