'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageForm } from '@/components/admin/pages/PageForm';
import { Button } from '@/components/admin/ui/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/pages')}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Назад к списку</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Создание страницы</h1>
              <p className="text-neutral-600 mt-1">Создайте новую страницу для вашего сайта</p>
            </div>
          </div>
        </div>

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
