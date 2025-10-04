'use client';

import { useRouter } from 'next/navigation';
import { useAccreditedOrganizations } from '@/hooks/admin/useAccreditedOrganizations';
import { AccreditedOrganizationForm } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationForm';
import { AccreditedOrganizationFormData } from '@/types/admin';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function CreateAccreditedOrganizationPage() {
  const router = useRouter();
  const { createOrganization, loading } = useAccreditedOrganizations();

  const handleSubmit = async (data: AccreditedOrganizationFormData) => {
    try {
      await createOrganization(data);
      router.push('/registry/accredited-organizations');
    } catch (error) {
      console.error('Ошибка создания организации:', error);
    }
  };

  const handleCancel = () => {
    router.push('/registry/accredited-organizations');
  };

  return (
    <AdminLayout
      title="Добавить аккредитованную организацию"
      breadcrumbs={[
        { label: 'Дашборд', href: '/' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Аккредитованные организации', href: '/registry/accredited-organizations' }
      ]}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500">
            Заполните форму для добавления новой аккредитованной организации в реестр
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <AccreditedOrganizationForm
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
