'use client';

import React from 'react';
import { Page } from '@/types/admin';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  UserIcon,
  EyeIcon,
  LinkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface PagePreviewProps {
  page: Page;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'green';
      case 'draft':
        return 'yellow';
      case 'archived':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Опубликовано';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-beige-600" />
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">{page.title}</h1>
                <p className="text-sm text-neutral-600 mt-1">
                  URL: <code className="bg-neutral-100 px-1 rounded">/{page.slug}</code>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge color={getStatusColor(page.status)}>
                {getStatusLabel(page.status)}
              </Badge>
              {page.isHomePage && (
                <Badge color="blue">
                  <HomeIcon className="h-3 w-3 mr-1" />
                  Главная
                </Badge>
              )}
              {page.showInMenu && (
                <Badge color="purple">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  В меню
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-neutral-700">Шаблон:</span>
              <span className="ml-2 text-neutral-600">{page.template}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Порядок в меню:</span>
              <span className="ml-2 text-neutral-600">{page.menuOrder}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Создано:</span>
              <span className="ml-2 text-neutral-600">{formatDate(page.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Обновлено:</span>
              <span className="ml-2 text-neutral-600">{formatDate(page.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Preview */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Содержимое страницы</h2>
        </CardHeader>
        <CardContent>
          {page.imageUrl && (
            <div className="mb-4">
              <img
                src={page.imageUrl}
                alt={page.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          
          {page.excerpt && (
            <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
              <p className="text-sm font-medium text-neutral-700 mb-1">Краткое описание:</p>
              <p className="text-sm text-neutral-600">{page.excerpt}</p>
            </div>
          )}
          
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">SEO Информация</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-neutral-700">SEO Title:</span>
              <p className="text-sm text-neutral-600 mt-1">
                {page.seoTitle || 'Не указан'}
              </p>
            </div>
            <div>
              <span className="font-medium text-neutral-700">SEO Description:</span>
              <p className="text-sm text-neutral-600 mt-1">
                {page.seoDescription || 'Не указано'}
              </p>
            </div>
            <div>
              <span className="font-medium text-neutral-700">SEO Keywords:</span>
              <p className="text-sm text-neutral-600 mt-1">
                {page.seoKeywords || 'Не указаны'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-neutral-900">Дополнительная информация</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-neutral-700">Автор:</span>
              <span className="ml-2 text-neutral-600">
                {page.createdBy?.name || 'Неизвестно'}
              </span>
            </div>
            <div>
              <span className="font-medium text-neutral-700">Редактор:</span>
              <span className="ml-2 text-neutral-600">
                {page.updatedBy?.name || 'Неизвестно'}
              </span>
            </div>
            {page.publishedAt && (
              <div>
                <span className="font-medium text-neutral-700">Дата публикации:</span>
                <span className="ml-2 text-neutral-600">
                  {formatDate(page.publishedAt)}
                </span>
              </div>
            )}
            {page.parentId && (
              <div>
                <span className="font-medium text-neutral-700">Родительская страница:</span>
                <span className="ml-2 text-neutral-600">
                  {page.parentId}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PagePreview;