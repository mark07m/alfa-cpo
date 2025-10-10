'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { PageForm } from '@/components/admin/pages/PageForm';
import { Button } from '@/components/admin/ui/Button';
import { LoadingSpinner } from '@/components/admin/ui/LoadingSpinner';
import { Page } from '@/types/admin';
import { pagesService } from '@/services/admin/pages';

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;
  
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await pagesService.getPage(pageId);
        setPage(pageData);
      } catch (err) {
        setError('Ошибка загрузки страницы');
        console.error('Error fetching page:', err);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const handleSuccess = () => {
    router.push('/pages');
  };

  const handleCancel = () => {
    router.push('/pages');
  };

  if (loading) {
    return (
      <AdminLayout title="Редактирование страницы">
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !page) {
    return (
      <AdminLayout title="Редактирование страницы">
        <div className="p-6">
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error || 'Страница не найдена'}</p>
            <Button onClick={() => router.push('/pages')}>
              Вернуться к списку страниц
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Редактирование страницы">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Редактирование страницы"
          subtitle={page.title}
          backUrl="/pages"
          backLabel="К страницам"
        />

        <div className="max-w-4xl">
          <PageForm
            page={page}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
