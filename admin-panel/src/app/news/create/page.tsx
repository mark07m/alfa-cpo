'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { NewsForm } from '@/components/admin/news/NewsForm'
import { useNews } from '@/hooks/admin/useNews'
import { News } from '@/types/admin'

export default function CreateNewsPage() {
  const router = useRouter()
  const { createNews, newsCategories, fetchNewsCategories } = useNews()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsCategories()
  }, [fetchNewsCategories])

  const handleSubmit = async (newsData: Partial<News>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await createNews(newsData)
      
      if (response.success) {
        router.push('/news')
      } else {
        setError(response.message || 'Ошибка создания новости')
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

  return (
    <AdminLayout title="Создание новости">
      <div className="space-y-6">
        <PageHeader
          title="Создание новости"
          subtitle="Заполните форму для создания новой новости"
          backUrl="/news"
          backLabel="К новостям"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка создания новости
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <NewsForm
          categories={newsCategories}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </AdminLayout>
  )
}
