'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { News } from '@/types/admin'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

export default function NewsPreviewPage() {
  const params = useParams()
  const newsId = params.id as string
  
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // В реальном приложении здесь был бы запрос для получения новости по ID
    // Пока используем моковые данные
    const mockNews: News = {
      id: newsId,
      title: 'Новые требования к арбитражным управляющим в 2024 году',
      content: `
        <h2>Введение</h2>
        <p>С 1 января 2024 года вступают в силу новые требования к арбитражным управляющим, которые были утверждены Министерством экономического развития Российской Федерации.</p>
        
        <h2>Основные изменения</h2>
        <p>Ключевые изменения включают в себя:</p>
        <ul>
          <li>Повышение требований к профессиональному опыту</li>
          <li>Обязательное прохождение дополнительного обучения</li>
          <li>Новые требования к страхованию ответственности</li>
          <li>Усиление контроля за деятельностью управляющих</li>
        </ul>
        
        <h2>Сроки реализации</h2>
        <p>Все арбитражные управляющие должны привести свою деятельность в соответствие с новыми требованиями до 1 июля 2024 года.</p>
        
        <h2>Заключение</h2>
        <p>Эти изменения направлены на повышение качества работы арбитражных управляющих и защиту интересов кредиторов в процедурах банкротства.</p>
      `,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'draft':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'archived':
        return <ArchiveBoxIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
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

  if (isLoading) {
    return (
      <AdminLayout title="Предварительный просмотр">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!news) {
    return (
      <AdminLayout title="Предварительный просмотр">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Новость не найдена</h3>
          <p className="text-gray-500">Запрашиваемая новость не существует или была удалена</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Предварительный просмотр">
      <div className="space-y-6">
        {/* Заголовок и действия */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/news"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Назад к списку
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Предварительный просмотр</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/news/${news.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Редактировать
            </Link>
          </div>
        </div>

        {/* Информация о новости */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{news.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Автор: {news.author.firstName} {news.author.lastName}</span>
                <span>•</span>
                <span>
                  Создано: {format(new Date(news.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                </span>
                {news.publishedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Опубликовано: {format(new Date(news.publishedAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(news.status)}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}>
                {getStatusText(news.status)}
              </span>
            </div>
          </div>

          {/* Изображение */}
          {news.imageUrl && (
            <div className="mb-6">
              <Image
                src={news.imageUrl}
                alt={news.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Краткое описание */}
          <div className="mb-6">
            <p className="text-lg text-gray-700 leading-relaxed">{news.excerpt}</p>
          </div>

          {/* Содержание */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>

          {/* SEO информация */}
          {(news.seoTitle || news.seoDescription || news.seoKeywords) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO информация</h3>
              <div className="space-y-3">
                {news.seoTitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO заголовок</label>
                    <p className="mt-1 text-sm text-gray-900">{news.seoTitle}</p>
                  </div>
                )}
                {news.seoDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SEO описание</label>
                    <p className="mt-1 text-sm text-gray-900">{news.seoDescription}</p>
                  </div>
                )}
                {news.seoKeywords && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ключевые слова</label>
                    <p className="mt-1 text-sm text-gray-900">{news.seoKeywords}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
