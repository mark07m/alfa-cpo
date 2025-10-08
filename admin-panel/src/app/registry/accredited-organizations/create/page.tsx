'use client';

import { useRouter } from 'next/navigation';
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
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавить аккредитованную организацию</h1>
        <p className="text-sm text-gray-500 mt-1">
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
  );
}
