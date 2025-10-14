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
  
  const { updateNews, fetchNewsItem, selectedNews, newsCategories, fetchNewsCategories } = useNews()
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      try {
        await fetchNewsCategories()
        await fetchNewsItem(newsId)
      } catch (e) {
        setError('Не удалось загрузить новость')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [newsId, fetchNewsCategories, fetchNewsItem])

  useEffect(() => {
    if (selectedNews) {
      setNews(selectedNews)
    }
  }, [selectedNews])

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
