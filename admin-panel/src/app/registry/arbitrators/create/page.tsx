'use client';

import { useRouter } from 'next/navigation';
import { useArbitrators } from '@/hooks/admin/useArbitrators';
import { ArbitratorForm } from '@/components/admin/arbitrators/ArbitratorForm';
import { ArbitratorFormData } from '@/services/admin/arbitrators';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

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
    <AdminLayout
      title="Добавить арбитражного управляющего"
      breadcrumbs={[
        { label: 'Дашборд', href: '/' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Арбитражные управляющие', href: '/registry/arbitrators' }
      ]}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
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
    </AdminLayout>
  );
}
