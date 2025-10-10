'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { NewsForm } from '@/components/admin/news/NewsForm'
import { useNews } from '@/hooks/admin/useNews'
import { News } from '@/types/admin'

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const newsId = params.id as string
  
  const { updateNews, newsCategories, fetchNewsCategories } = useNews()
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsCategories()
    // В реальном приложении здесь был бы запрос для получения новости по ID
    // Пока используем моковые данные
    const mockNews: News = {
      id: newsId,
      title: 'Новые требования к арбитражным управляющим в 2024 году',
      content: 'Полный текст новости о новых требованиях...',
      excerpt: 'С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим...',
      category: {
        id: '1',
        name: 'Законодательство',
        slug: 'legislation',
        color: '#3B82F6',
        icon: 'document-text',
        sortOrder: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      status: 'published',
      publishedAt: '2024-01-15T10:00:00Z',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z',
      author: {
        id: '1',
        email: 'admin@sro-au.ru',
        firstName: 'Администратор',
        lastName: 'СРО',
        role: 'super_admin' as const,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      imageUrl: '/images/news-1.svg',
      seoTitle: 'Новые требования к арбитражным управляющим 2024',
      seoDescription: 'Обзор новых требований к арбитражным управляющим с 1 января 2024 года',
      seoKeywords: 'арбитражные управляющие, требования, 2024, СРО'
    }
    
    setNews(mockNews)
    setIsLoading(false)
  }, [newsId])

  const handleSubmit = async (newsData: Partial<News>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await updateNews(newsId, newsData)
      
      if (response.success) {
        router.push('/news')
      } else {
        setError(response.message || 'Ошибка обновления новости')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/news')
  }

  if (isLoading) {
    return (
      <AdminLayout title="Редактирование новости">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!news) {
    return (
      <AdminLayout title="Редактирование новости">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Новость не найдена</h3>
          <p className="text-gray-500">Запрашиваемая новость не существует или была удалена</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Редактирование новости">
      <div className="space-y-6">
        <PageHeader
          title="Редактирование новости"
          subtitle={news.title}
          backUrl="/news"
          backLabel="К новостям"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка обновления новости
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <NewsForm
          news={news}
          categories={newsCategories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}
