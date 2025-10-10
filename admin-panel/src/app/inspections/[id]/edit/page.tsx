'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { FormField } from '@/components/admin/ui/FormField';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { CheckIcon } from '@heroicons/react/24/outline';
import { inspectionsService } from '@/services/admin/inspections';
import { arbitratorsService } from '@/services/admin/arbitrators';

interface InspectionFormData {
  arbitratorId: string;
  arbitratorName: string;
  arbitratorInn: string;
  inspectorName: string;
  type: 'planned' | 'unplanned';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  plannedDate: string;
  actualDate?: string;
  description: string;
  result?: 'passed' | 'failed' | 'needs_improvement' | '';
  notes?: string;
}

export default function InspectionEditPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<InspectionFormData>({
    arbitratorId: '',
    arbitratorName: '',
    arbitratorInn: '',
    inspectorName: '',
    type: 'planned',
    status: 'scheduled',
    plannedDate: '',
    description: '',
    notes: ''
  });
  const [arbitratorOptions, setArbitratorOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // load inspection
        const data = await inspectionsService.getById(params.id as string);
        if (!mounted) return;
        setFormData({
          arbitratorId: data.arbitratorId,
          arbitratorName: data.arbitratorName,
          arbitratorInn: data.arbitratorInn,
          inspectorName: data.inspectorName,
          type: data.type,
          status: data.status,
          plannedDate: data.plannedDate.split('T')[0],
          actualDate: data.actualDate ? data.actualDate.split('T')[0] : undefined,
          description: data.description,
          result: (data.result as any) || '',
          notes: data.notes,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params.id]);

  useEffect(() => {
    // preload arbitrators minimal list for select
    (async () => {
      try {
        const resp = await arbitratorsService.getArbitrators({ limit: 50 });
        const opts = resp.data.map((a: any) => ({
          value: a.id,
          label: `${a.fullName} (ИНН: ${a.inn || '—'})`,
        }));
        setArbitratorOptions([{ value: '', label: 'Выберите арбитражного управляющего' }, ...opts]);
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Отправка данных на API
      console.log('Сохранение проверки:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push(`/inspections/${params.id}`);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof InspectionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statusOptions = [
    { value: 'scheduled', label: 'Запланирована' },
    { value: 'in_progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершена' },
    { value: 'cancelled', label: 'Отменена' }
  ];

  const typeOptions = [
    { value: 'planned', label: 'Плановая' },
    { value: 'unplanned', label: 'Внеплановая' }
  ];

  const resultOptions = [
    { value: '', label: '—' },
    { value: 'passed', label: 'Пройдено' },
    { value: 'failed', label: 'Не пройдено' },
    { value: 'needs_improvement', label: 'Нуждается в улучшении' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title={`Редактирование проверки #${params.id}`}
          subtitle={formData.arbitratorName}
          backUrl={`/inspections/${params.id}`}
          backLabel="К проверке"
          primaryAction={{
            label: saving ? 'Сохранение...' : 'Сохранить',
            onClick: handleSubmit,
            icon: <CheckIcon className="h-4 w-4" />,
            variant: 'primary',
            disabled: saving
          }}
        />

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Основная форма */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Арбитражный управляющий */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Арбитражный управляющий <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.arbitratorId}
                onChange={(e) => {
                  const value = e.target.value;
                  const found = arbitratorOptions.find(o => o.value === value);
                  setFormData(prev => ({
                    ...prev,
                    arbitratorId: value,
                    arbitratorName: found ? found.label.split(' (ИНН:')[0] : prev.arbitratorName,
                    arbitratorInn: found ? (found.label.match(/ИНН: ([^)]+)/)?.[1] || '') : prev.arbitratorInn,
                  }));
                }}
                options={arbitratorOptions}
                required
              />
            </div>

            {/* Инспектор */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Инспектор <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.inspectorName}
                onChange={(e) => handleChange('inspectorName', e.target.value)}
                required
              />
            </div>

            {/* Тип проверки */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип проверки <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as any)}
                options={typeOptions}
                required
              />
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as any)}
                options={statusOptions}
                required
              />
            </div>

            {/* Плановая дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Плановая дата <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.plannedDate}
                onChange={(e) => handleChange('plannedDate', e.target.value)}
                required
              />
            </div>

            {/* Фактическая дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фактическая дата
              </label>
              <Input
                type="date"
                value={formData.actualDate || ''}
                onChange={(e) => handleChange('actualDate', e.target.value)}
              />
            </div>
          </div>

          {/* Описание */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
              required
            />
          </div>

          {/* Примечания */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Примечания
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          {/* Результат */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Результат проверки
            </label>
            <Select
              value={formData.result || ''}
              onChange={(e) => handleChange('result', e.target.value as any)}
              options={resultOptions}
            />
          </div>
        </div>

        {/* Нижняя панель действий */}
        <div className="flex items-center justify-end space-x-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/inspections/${params.id}`)}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={saving}
            variant="primary"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>
      </div>
    </AdminLayout>
  );
}

