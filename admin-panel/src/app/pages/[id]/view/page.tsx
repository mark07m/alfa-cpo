'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { PageHeader } from '@/components/admin/ui/PageHeader';
import { PagePreview } from '@/components/admin/pages/PagePreview';
import { LoadingSpinner } from '@/components/admin/ui/LoadingSpinner';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Page } from '@/types/admin';
import { pagesService } from '@/services/admin/pages';

export default function ViewPagePage() {
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

  const handleEdit = () => {
    router.push(`/pages/${pageId}/edit`);
  };

  const handleBack = () => {
    router.push('/pages');
  };

  if (loading) {
    return (
      <AdminLayout title="Просмотр страницы">
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
      <AdminLayout title="Просмотр страницы">
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
    <AdminLayout title="Просмотр страницы">
      <div className="p-6">
        <PageHeader
          title="Просмотр страницы"
          subtitle={`Предпросмотр: ${page.title}`}
          backUrl="/pages"
          backLabel="К страницам"
          secondaryActions={[
            {
              label: 'Открыть на сайте',
              onClick: () => window.open(`/${page.slug}`, '_blank'),
              icon: <EyeIcon className="h-4 w-4" />,
              variant: 'outline'
            }
          ]}
          primaryAction={{
            label: 'Редактировать',
            onClick: handleEdit,
            variant: 'primary'
          }}
        />

        <div className="max-w-6xl mt-6">
          <PagePreview page={page} />
        </div>
      </div>
    </AdminLayout>
  );
}
