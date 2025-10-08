'use client';

import { useRouter, useParams } from 'next/navigation';
import { useArbitrator, useArbitrators } from '@/hooks/admin/useArbitrators';
import { ArbitratorForm } from '@/components/admin/arbitrators/ArbitratorForm';
import { ArbitratorFormData } from '@/services/admin/arbitrators';

export default function EditArbitratorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { arbitrator, loading: loadingArbitrator } = useArbitrator(id);
  const { updateArbitrator, loading: updating } = useArbitrators();

  const handleSubmit = async (data: ArbitratorFormData) => {
    try {
      await updateArbitrator(id, data);
      router.push('/registry/arbitrators');
    } catch (error) {
      console.error('Ошибка обновления арбитражного управляющего:', error);
    }
  };

  const handleCancel = () => {
    router.push('/registry/arbitrators');
  };

  if (loadingArbitrator) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Редактирование арбитражного управляющего</h1>
          <p className="text-sm text-gray-500 mt-1">Загрузка данных...</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!arbitrator) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Арбитражный управляющий не найден</h1>
          <p className="text-sm text-gray-500 mt-1">Запрашиваемый арбитражный управляющий не существует</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <button
            onClick={() => router.push('/registry/arbitrators')}
            className="text-blue-600 hover:text-blue-500"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Редактирование арбитражного управляющего</h1>
        <p className="text-sm text-gray-500 mt-1">
          Редактирование данных арбитражного управляющего: {arbitrator.fullName}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ArbitratorForm
          initialData={arbitrator}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updating}
          isEdit={true}
        />
      </div>
    </div>
  );
}
