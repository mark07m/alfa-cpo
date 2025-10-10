'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { useAccreditedOrganizations } from '@/hooks/admin/useAccreditedOrganizations';
import { AccreditedOrganizationForm } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationForm';
import { AccreditedOrganizationFormData } from '@/types/admin';

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
    <div className="space-y-6">
      <PageHeader
        title="Добавить аккредитованную организацию"
        subtitle="Заполните форму для добавления новой аккредитованной организации в реестр"
        backUrl="/registry/accredited-organizations"
        backLabel="К организациям"
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AccreditedOrganizationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
}
