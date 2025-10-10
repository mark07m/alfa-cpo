'use client';

import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { Button } from '@/components/admin/ui/Button';
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
        <PageHeader
          title="Редактирование арбитражного управляющего"
          subtitle="Загрузка данных..."
          backUrl="/registry/arbitrators"
          backLabel="К арбитражным управляющим"
        />
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
        <PageHeader
          title="Арбитражный управляющий не найден"
          subtitle="Запрашиваемый арбитражный управляющий не существует"
          backUrl="/registry/arbitrators"
          backLabel="К арбитражным управляющим"
        />
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Button
            variant="primary"
            onClick={() => router.push('/registry/arbitrators')}
          >
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Редактирование арбитражного управляющего"
        subtitle={arbitrator.fullName}
        backUrl="/registry/arbitrators"
        backLabel="К арбитражным управляющим"
      />

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
