'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { useAccreditedOrganizations, useAccreditedOrganization } from '@/hooks/admin/useAccreditedOrganizations';
import { AccreditedOrganizationForm } from '@/components/admin/accreditedOrganizations/AccreditedOrganizationForm';
import { AccreditedOrganizationFormData } from '@/types/admin';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EditAccreditedOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const { updateOrganization, loading: updateLoading } = useAccreditedOrganizations();
  const { organization, loading: fetchLoading, error } = useAccreditedOrganization(params.id as string);

  const handleSubmit = async (data: AccreditedOrganizationFormData) => {
    try {
      await updateOrganization(params.id as string, data);
      router.push(`/registry/accredited-organizations/${params.id}`);
    } catch (error) {
      console.error('Ошибка обновления организации:', error);
    }
  };

  const handleCancel = () => {
    router.push(`/registry/accredited-organizations/${params.id}`);
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-sm text-gray-500">Загрузка организации...</p>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Ошибка загрузки</h3>
        <p className="mt-1 text-sm text-gray-500">{error || 'Организация не найдена'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Редактирование аккредитованной организации"
        subtitle={organization.name}
        backUrl="/registry/accredited-organizations"
        backLabel="К организациям"
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AccreditedOrganizationForm
          initialData={organization}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={updateLoading}
          isEdit={true}
        />
      </div>
    </div>
  );
}
