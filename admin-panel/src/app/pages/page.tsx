'use client';

import { useState, useEffect } from 'react';
import { usePages } from '@/hooks/admin/usePages';
import { Page, PageFilters, PageTemplate } from '@/types/admin';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  HomeIcon,
  DocumentTextIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/admin/ui/Card';
import { Select } from '@/components/admin/ui/Select';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Badge } from '@/components/admin/ui/Badge';
import { Table } from '@/components/admin/ui/Table';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function PagesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<PageFilters>({});
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    pages,
    loading,
    error,
    pagination,
    createPage,
    updatePage,
    deletePage,
    updatePageStatus,
    bulkUpdateStatus,
    bulkDeletePages,
    fetchPages
  } = usePages();

  useEffect(() => {
    fetchPages();
  }, []);

  // Handle filter changes
  useEffect(() => {
    fetchPages();
  }, [filters, fetchPages]);

  const handleFilterChange = (key: keyof PageFilters, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    // Update page in the hook
    // This would typically be handled by the hook itself
  };

  const handleSelectPage = (id: string, isSelected: boolean) => {
    setSelectedPages(prev => 
      isSelected 
        ? [...prev, id]
        : prev.filter(pageId => pageId !== id)
    );
  };

  const handleSelectAllPages = (isSelected: boolean) => {
    setSelectedPages(isSelected ? pages.map(page => page.id) : []);
  };

  const handleCreatePage = () => {
    router.push('/pages/create');
  };

  const handleEditPage = (page: Page) => {
    router.push(`/pages/${page.id}/edit`);
  };

  const handlePreviewPage = (page: Page) => {
    router.push(`/pages/${page.id}/view`);
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
      await deletePage(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPages.length === 0) return;
    
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedPages.length} страниц?`)) {
      try {
        await bulkDeletePages(selectedPages);
        setSelectedPages([]);
      } catch (error) {
        console.error('Error bulk deleting pages:', error);
      }
    }
  };

  const handleBulkStatusUpdate = async (status: 'draft' | 'published' | 'archived') => {
    if (selectedPages.length === 0) return;
    
    try {
      await bulkUpdateStatus(selectedPages, status);
      setSelectedPages([]);
    } catch (error) {
      console.error('Error bulk updating status:', error);
    }
  };

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

  const columns = [
    {
      key: 'select' as const,
      title: 'Выбор',
      render: (value: unknown, page: Page) => (
        <Checkbox
          checked={selectedPages.includes(page.id)}
          onChange={(e) => handleSelectPage(page.id, (e.target as HTMLInputElement).checked)}
          size="sm"
        />
      ),
      width: 'w-16',
    },
    {
      key: 'title' as const,
      title: 'Заголовок',
      sortable: true,
      render: (title: string, page: Page) => (
        <div className="flex items-center min-w-0">
          {page.isHomePage && <HomeIcon className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" title="Главная страница" />}
          {page.showInMenu && <LinkIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" title="Отображается в меню" />}
          <span className="font-medium truncate">{title}</span>
        </div>
      ),
      width: 'w-1/4',
    },
    {
      key: 'slug' as const,
      title: 'URL (slug)',
      sortable: true,
      render: (slug: string) => (
        <code className="text-sm bg-neutral-100 px-2 py-1 rounded truncate block">/{slug}</code>
      ),
      width: 'w-1/6',
    },
    {
      key: 'template' as const,
      title: 'Шаблон',
      sortable: true,
      render: (template: PageTemplate) => (
        <Badge color="blue">
          {PageTemplate[template] || template}
        </Badge>
      ),
      width: 'w-20',
    },
    {
      key: 'status' as const,
      title: 'Статус',
      sortable: true,
      render: (status: string) => (
        <Badge color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Badge>
      ),
      width: 'w-24',
    },
    {
      key: 'updatedAt' as const,
      title: 'Обновлено',
      sortable: true,
      render: (date: string) => (
        <span className="text-sm text-neutral-600">
          {new Date(date).toLocaleDateString('ru-RU')}
        </span>
      ),
      width: 'w-20',
    },
    {
      key: 'actions' as const,
      title: 'Действия',
      render: (value: unknown, page: Page) => (
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreviewPage(page)}
            title="Предпросмотр"
            className="p-1"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditPage(page)}
            title="Редактировать"
            className="p-1"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeletePage(page.id)}
            title="Удалить"
            className="p-1"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: 'w-28',
    },
  ];

  if (error) {
    return (
      <AdminLayout title="Управление страницами">
        <div className="p-6">
          <div className="text-center py-10 text-red-500">
            <p>Ошибка загрузки страниц: {error.message}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Управление страницами">
      <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Управление страницами</h1>
            <p className="text-neutral-600 mt-1">Создание, редактирование и удаление страниц сайта</p>
          </div>
          <Button onClick={handleCreatePage}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Создать страницу
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Фильтры и поиск</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Поиск по заголовку или URL"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                icon={<MagnifyingGlassIcon className="h-4 w-4" />}
              />
              
              <Select
                options={[
                  { value: '', label: 'Все статусы' },
                  { value: 'published', label: 'Опубликовано' },
                  { value: 'draft', label: 'Черновик' },
                  { value: 'archived', label: 'Архив' },
                ]}
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                placeholder="Выберите статус"
              />
              
              <Select
                options={[
                  { value: '', label: 'Все шаблоны' },
                  ...Object.values(PageTemplate).map(template => ({ 
                    value: template, 
                    label: PageTemplate[template] || template 
                  }))
                ]}
                value={filters.template || ''}
                onChange={(e) => handleFilterChange('template', e.target.value)}
                placeholder="Выберите шаблон"
              />
              
              <div className="flex space-x-4">
                <Checkbox
                  label="Главная страница"
                  checked={filters.isHomePage || false}
                  onChange={(e) => handleFilterChange('isHomePage', e.target.checked)}
                />
                <Checkbox
                  label="В меню"
                  checked={filters.showInMenu || false}
                  onChange={(e) => handleFilterChange('showInMenu', e.target.checked)}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedPages.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                Выбрано {selectedPages.length} страниц
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPages([])}
                >
                  Отменить выбор
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('published')}
                >
                  Опубликовать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('draft')}
                >
                  В черновик
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('archived')}
                >
                  В архив
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages Table */}
      <Table
        data={pages}
        columns={columns}
        loading={loading}
        pagination={pagination ? {
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          totalItems: pagination.total,
          itemsPerPage: 10,
          onPageChange: handlePageChange
        } : undefined}
        emptyMessage="Нет страниц для отображения. Создайте первую страницу."
      />

      </div>
    </AdminLayout>
  );
}