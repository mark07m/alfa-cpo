'use client';

import { useRouter } from 'next/navigation';
import { useArbitrators } from '@/hooks/admin/useArbitrators';
import { ArbitratorForm } from '@/components/admin/arbitrators/ArbitratorForm';
import { ArbitratorFormData } from '@/services/admin/arbitrators';

export default function CreateArbitratorPage() {
  const router = useRouter();
  const { createArbitrator, loading } = useArbitrators();

  const handleSubmit = async (data: ArbitratorFormData) => {
    try {
      await createArbitrator(data);
      router.push('/registry/arbitrators');
    } catch (error) {
      console.error('Ошибка создания арбитражного управляющего:', error);
    }
  };

  const handleCancel = () => {
    router.push('/registry/arbitrators');
  };

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавить арбитражного управляющего</h1>
        <p className="text-sm text-gray-500 mt-1">
          Заполните форму для добавления нового арбитражного управляющего в реестр
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ArbitratorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
}
