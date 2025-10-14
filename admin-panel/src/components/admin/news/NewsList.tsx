'use client'

import React from 'react'
import Image from 'next/image'
import { News, NewsCategory, PaginationParams } from '@/types/admin'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/admin/ui/Button'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface NewsListProps {
  news: News[]
  categories: NewsCategory[]
  isLoading: boolean
  pagination?: PaginationParams
  selectedNews: News[]
  onSelectNews: (news: News, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onDeleteNews: (newsId: string) => void
  onStatusChange: (newsId: string, status: 'draft' | 'published' | 'archived') => void
  onPageChange: (page: number) => void
}

export function NewsList({
  news,
  categories,
  isLoading,
  pagination,
  selectedNews,
  onSelectNews,
  onSelectAll,
  onDeleteNews,
  onStatusChange,
  onPageChange
}: NewsListProps) {
  const router = useRouter()
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'draft':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      case 'archived':
        return <ArchiveBoxIcon className="h-4 w-4 text-gray-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Опубликовано'
      case 'draft':
        return 'Черновик'
      case 'archived':
        return 'Архив'
      default:
        return 'Неизвестно'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Без категории'
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.color || '#6B7280'
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-12 sm:px-6 text-center">
          <div className="text-gray-400 mb-4">
            <EyeIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Новостей не найдено</h3>
          <p className="text-gray-500">Создайте первую новость или измените фильтры поиска</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-hidden">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-1 py-3 text-left w-8">
                <Checkbox
                  checked={selectedNews.length === (news?.length || 0) && (news?.length || 0) > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  size="sm"
                />
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                Новость
              </th>
              <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Категория
              </th>
              <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Статус
              </th>
              <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 hidden sm:table-cell">
                Автор
              </th>
              <th className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Дата
              </th>
              <th className="px-1 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(news || []).map((newsItem) => (
              <tr
                key={newsItem.id}
                className={`hover:bg-gray-50 ${
                  selectedNews.some(item => item.id === newsItem.id) ? 'bg-amber-50' : ''
                }`}
              >
                <td className="px-1 py-2 whitespace-nowrap">
                  <Checkbox
                    checked={selectedNews.some(item => item.id === newsItem.id)}
                    onChange={(e) => onSelectNews(newsItem, e.target.checked)}
                    size="sm"
                  />
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-start">
                    {newsItem.imageUrl && (
                      <div className="flex-shrink-0 h-10 w-12 mr-2">
                        <Image
                          className="h-10 w-12 rounded object-cover"
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          width={48}
                          height={40}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium text-gray-900 truncate flex items-center gap-1">
                        {newsItem.title}
                        {newsItem.featured && (
                          <span title="Важная новость" className="inline-flex items-center text-yellow-500">
                            <StarIcon className="h-3 w-3" />
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {newsItem.excerpt}
                      </p>
                      <div className="mt-0.5 text-xs text-gray-400 truncate">
                        ID: {newsItem.id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-1 py-2 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium truncate"
                    style={{
                      backgroundColor: getCategoryColor(newsItem.category.id) + '20',
                      color: getCategoryColor(newsItem.category.id)
                    }}
                  >
                    {getCategoryName(newsItem.category.id).slice(0, 8)}
                  </span>
                </td>
                <td className="px-1 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(newsItem.status)}
                    <span className={`ml-1 inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(newsItem.status)}`}>
                      {getStatusText(newsItem.status).slice(0, 3)}
                    </span>
                  </div>
                </td>
                <td className="px-1 py-2 whitespace-nowrap text-xs text-gray-900 hidden sm:table-cell">
                  <div className="truncate">
                    {newsItem.author?.name?.slice(0, 8) || 'Неизв.'}
                  </div>
                </td>
                <td className="px-1 py-2 whitespace-nowrap text-xs text-gray-500">
                  <div>
                    <div className="text-xs">
                      {newsItem.publishedAt
                        ? format(new Date(newsItem.publishedAt), 'dd.MM', { locale: ru })
                        : 'Не опубл.'
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(newsItem.createdAt), 'dd.MM', { locale: ru })}
                    </div>
                  </div>
                </td>
                <td className="px-1 py-2 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end space-x-0.5">
                    <Button
                      onClick={() => window.open(`/news/${newsItem.id}`, '_blank')}
                      variant="ghost"
                      size="xs"
                      icon={<EyeIcon className="h-3 w-3" />}
                      title="Предварительный просмотр"
                      aria-label="Предварительный просмотр"
                      iconOnly
                      className="p-0.5"
                    />
                    <Button
                      onClick={() => router.push(`/news/${newsItem.id}/edit`)}
                      variant="ghost"
                      size="xs"
                      icon={<PencilIcon className="h-3 w-3" />}
                      title="Редактировать"
                      aria-label="Редактировать"
                      iconOnly
                      className="text-amber-600 hover:text-amber-900 p-0.5"
                    />
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={<CheckCircleIcon className="h-3 w-3" />}
                        title="Изменить статус"
                        aria-label="Изменить статус"
                        iconOnly
                        className="p-0.5"
                      />
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          <Button
                            onClick={() => onStatusChange(newsItem.id, 'published')}
                            variant="ghost"
                            size="xs"
                            className="block w-full justify-start px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            Опубликовать
                          </Button>
                          <Button
                            onClick={() => onStatusChange(newsItem.id, 'draft')}
                            variant="ghost"
                            size="xs"
                            className="block w-full justify-start px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            В черновики
                          </Button>
                          <Button
                            onClick={() => onStatusChange(newsItem.id, 'archived')}
                            variant="ghost"
                            size="xs"
                            className="block w-full justify-start px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            Архивировать
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => onDeleteNews(newsItem.id)}
                      variant="ghost"
                      size="xs"
                      icon={<TrashIcon className="h-3 w-3" />}
                      title="Удалить"
                      aria-label="Удалить"
                      iconOnly
                      className="text-red-600 hover:text-red-900 p-0.5"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white px-2 py-1 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              variant="outline"
              size="xs"
            >
              ←
            </Button>
            <span className="text-xs text-gray-500 px-2">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              variant="outline"
              size="xs"
            >
              →
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-gray-700">
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>
                -
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>
                из
                <span className="font-medium">{pagination.total}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  variant="outline"
                  size="xs"
                  className="rounded-l-md"
                >
                  ←
                </Button>
                {[...Array(Math.min(pagination.totalPages, 3))].map((_, i) => {
                  const pageNum = pagination.page <= 2 ? i + 1 : pagination.page - 1 + i;
                  if (pageNum > pagination.totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      variant={pagination.page === pageNum ? 'primary' : 'outline'}
                      size="xs"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  variant="outline"
                  size="xs"
                  className="rounded-r-md"
                >
                  →
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
