'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { PageForm } from '@/components/admin/pages/PageForm';

export default function CreatePagePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/pages');
  };

  const handleCancel = () => {
    router.push('/pages');
  };

  return (
    <AdminLayout title="Создание страницы">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Создание страницы"
          subtitle="Создайте новую страницу для вашего сайта"
          backUrl="/pages"
          backLabel="К страницам"
        />

        <div className="max-w-4xl">
          <PageForm
            page={null}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
