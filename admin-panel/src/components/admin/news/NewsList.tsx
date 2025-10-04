'use client'

import React from 'react'
import Image from 'next/image'
import { News, NewsCategory, PaginationParams } from '@/types/admin'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon
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

  if (news.length === 0) {
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedNews.length === news.length && news.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Новость
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((newsItem) => (
              <tr
                key={newsItem.id}
                className={`hover:bg-gray-50 ${
                  selectedNews.some(item => item.id === newsItem.id) ? 'bg-amber-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedNews.some(item => item.id === newsItem.id)}
                    onChange={(e) => onSelectNews(newsItem, e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start">
                    {newsItem.imageUrl && (
                      <div className="flex-shrink-0 h-16 w-24 mr-4">
                        <Image
                          className="h-16 w-24 rounded-lg object-cover"
                          src={newsItem.imageUrl}
                          alt={newsItem.title}
                          width={96}
                          height={64}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {newsItem.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {newsItem.excerpt}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-gray-400">
                        <span>ID: {newsItem.id}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: getCategoryColor(newsItem.category.id) + '20',
                      color: getCategoryColor(newsItem.category.id)
                    }}
                  >
                    {getCategoryName(newsItem.category.id)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(newsItem.status)}
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(newsItem.status)}`}>
                      {getStatusText(newsItem.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {newsItem.author.firstName} {newsItem.author.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div>
                      {newsItem.publishedAt
                        ? format(new Date(newsItem.publishedAt), 'dd.MM.yyyy HH:mm', { locale: ru })
                        : 'Не опубликовано'
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      Создано: {format(new Date(newsItem.createdAt), 'dd.MM.yyyy', { locale: ru })}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => window.open(`/news/${newsItem.id}`, '_blank')}
                      className="text-gray-400 hover:text-gray-600"
                      title="Предварительный просмотр"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <a
                      href={`/news/${newsItem.id}/edit`}
                      className="text-amber-600 hover:text-amber-900"
                      title="Редактировать"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </a>
                    <div className="relative group">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="Изменить статус"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          <button
                            onClick={() => onStatusChange(newsItem.id, 'published')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Опубликовать
                          </button>
                          <button
                            onClick={() => onStatusChange(newsItem.id, 'draft')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            В черновики
                          </button>
                          <button
                            onClick={() => onStatusChange(newsItem.id, 'archived')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Архивировать
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteNews(newsItem.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Удалить"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Предыдущая
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Следующая
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                -{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                из{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                результатов
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Предыдущая
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.page === i + 1
                        ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Следующая
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
