'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { NewsList } from '@/components/admin/news/NewsList'
import { NewsFilters } from '@/components/admin/news/NewsFilters'
import { NewsActions } from '@/components/admin/news/NewsActions'
import { useNews } from '@/hooks/admin/useNews'
import { News, NewsFilters as NewsFiltersType } from '@/types/admin'
import { PlusIcon, FunnelIcon, NewspaperIcon, EyeIcon } from '@heroicons/react/24/outline'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'

export default function NewsPage() {
  const [selectedNews, setSelectedNews] = useState<News[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    news,
    newsCategories,
    isLoading,
    error,
    pagination,
    filters,
    fetchNews,
    deleteNews,
    updateNewsStatus,
    bulkDeleteNews,
    setFilters,
    clearError
  } = useNews()

  useEffect(() => {
    fetchNews(filters)
  }, [filters, fetchNews])

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
  }

  const handleFilterChange = (newFilters: Partial<NewsFiltersType>) => {
    setFilters(newFilters)
  }

  const handleSelectNews = (newsItem: News, selected: boolean) => {
    if (selected) {
      setSelectedNews(prev => [...prev, newsItem])
    } else {
      setSelectedNews(prev => prev.filter(item => item.id !== newsItem.id))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedNews(news)
    } else {
      setSelectedNews([])
    }
  }

  const handleBulkAction = async (action: string, newsIds: string[]) => {
    setIsProcessing(true)
    try {
      switch (action) {
        case 'delete':
          await bulkDeleteNews(newsIds)
          setSelectedNews([])
          break
        case 'publish':
          for (const id of newsIds) {
            await updateNewsStatus(id, 'published')
          }
          setSelectedNews([])
          break
        case 'draft':
          for (const id of newsIds) {
            await updateNewsStatus(id, 'draft')
          }
          setSelectedNews([])
          break
        case 'archive':
          for (const id of newsIds) {
            await updateNewsStatus(id, 'archived')
          }
          setSelectedNews([])
          break
        default:
          console.warn('Unknown bulk action:', action)
      }
    } catch (error) {
      console.error('Bulk action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchNews({ ...filters, page })
  }

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id)
      setSelectedNews(prev => prev.filter(newsItem => newsItem.id !== id))
    } catch (error) {
      console.error('Delete news failed:', error)
    }
  }

  const handleUpdateNewsStatus = async (id: string, status: News['status']) => {
    try {
      await updateNewsStatus(id, status)
    } catch (error) {
      console.error('Update news status failed:', error)
    }
  }

  const getStatusStats = () => {
    const stats = {
      total: news.length,
      published: news.filter(n => n.status === 'published').length,
      draft: news.filter(n => n.status === 'draft').length,
      archived: news.filter(n => n.status === 'archived').length
    }
    return stats
  }

  const getCategoryStats = () => {
    const stats = newsCategories.map(category => ({
      ...category,
      count: news?.filter(n => n.category.id === category.id).length || 0
    }))
    return stats
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Управление новостями
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Создание, редактирование и управление новостями СРО АУ
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/news/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Создать новость
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <NewspaperIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Всего новостей
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {pagination?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Опубликовано
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getStatusStats().published}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Черновики
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {getStatusStats().draft}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Категории
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {newsCategories.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика по категориям */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Новости по категориям</h3>
            <div className="space-y-3">
              {getCategoryStats().map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm text-gray-900">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{category.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Статусы новостей</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-3 bg-green-500"></div>
                  <span className="text-sm text-gray-900">Опубликовано</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{getStatusStats().published}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-3 bg-yellow-500"></div>
                  <span className="text-sm text-gray-900">Черновики</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{getStatusStats().draft}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full mr-3 bg-gray-500"></div>
                  <span className="text-sm text-gray-900">Архив</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{getStatusStats().archived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Переключатель вида */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md border-blue-500 text-blue-700 bg-blue-50"
            >
              <NewspaperIcon className="h-4 w-4 mr-2" />
              Список
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Превью
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                showFilters
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Фильтры
            </button>
          </div>
        </div>

        {/* Ошибки API */}
        <ApiErrorBanner 
          error={error} 
          onClose={clearError}
          onRetry={() => fetchNews()}
        />

        {/* Фильтры */}
        <NewsFilters
          filters={filters}
          categories={newsCategories}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Массовые действия */}
        {selectedNews.length > 0 && (
          <NewsActions
            selectedCount={selectedNews.length}
            onBulkAction={(action) => handleBulkAction(action, selectedNews.map(n => n.id))}
            onClearSelection={() => setSelectedNews([])}
            isProcessing={isProcessing}
          />
        )}

        {/* Список новостей */}
        <NewsList
          news={news}
          categories={newsCategories}
          isLoading={isLoading}
          pagination={pagination}
          selectedNews={selectedNews}
          onSelectNews={handleSelectNews}
          onSelectAll={handleSelectAll}
          onDeleteNews={handleDeleteNews}
          onStatusChange={handleUpdateNewsStatus}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  )
}