'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { News, NewsCategory } from '@/types/admin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const newsSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок слишком длинный'),
  excerpt: z.string().min(1, 'Краткое описание обязательно').max(500, 'Описание слишком длинное'),
  content: z.string().min(1, 'Содержание обязательно'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  status: z.enum(['draft', 'published', 'archived']),
  imageUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional()
})

type NewsFormData = z.infer<typeof newsSchema>

interface NewsFormProps {
  news?: News
  categories: NewsCategory[]
  onSubmit: (data: Partial<News>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function NewsForm({
  news,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false
}: NewsFormProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content')
  const [imagePreview, setImagePreview] = useState<string | null>(news?.imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: news?.title || '',
      excerpt: news?.excerpt || '',
      content: news?.content || '',
      categoryId: news?.category.id || '',
      status: news?.status || 'draft',
      imageUrl: news?.imageUrl || '',
      seoTitle: news?.seoTitle || '',
      seoDescription: news?.seoDescription || '',
      seoKeywords: news?.seoKeywords || ''
    }
  })


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // В реальном приложении здесь была бы загрузка на сервер
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setValue('imageUrl', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = (data: NewsFormData) => {
    const selectedCategory = categories.find(cat => cat.id === data.categoryId)
    if (!selectedCategory) {
      return
    }

    const newsData: Partial<News> = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: selectedCategory,
      status: data.status,
      imageUrl: data.imageUrl,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords
    }

    onSubmit(newsData)
  }

  const tabs = [
    { id: 'content', name: 'Содержание', icon: DocumentTextIcon },
    { id: 'seo', name: 'SEO', icon: DocumentTextIcon },
    { id: 'media', name: 'Медиа', icon: PhotoIcon }
  ]

  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Вкладки */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'content' | 'seo' | 'media')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-6 pb-6">
          {/* Основная информация */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Заголовок *
                </label>
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Введите заголовок новости"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Категория *
                </label>
                <select
                  {...register('categoryId')}
                  id="categoryId"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Краткое описание *
              </label>
              <textarea
                {...register('excerpt')}
                id="excerpt"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                placeholder="Краткое описание новости для анонса"
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Статус
              </label>
              <select
                {...register('status')}
                id="status"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              >
                <option value="draft">Черновик</option>
                <option value="published">Опубликовано</option>
                <option value="archived">Архив</option>
              </select>
            </div>
          </div>

          {/* Содержание */}
          {activeTab === 'content' && (
            <div className="mt-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Содержание *
              </label>
              <div className="mt-1">
                <textarea
                  {...register('content')}
                  id="content"
                  rows={12}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Введите содержание новости..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Используйте простой текст. HTML теги будут экранированы для безопасности.
              </p>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                  SEO заголовок
                </label>
                <input
                  {...register('seoTitle')}
                  type="text"
                  id="seoTitle"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="SEO заголовок (если отличается от основного)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Если не указан, будет использован основной заголовок
                </p>
              </div>

              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                  SEO описание
                </label>
                <textarea
                  {...register('seoDescription')}
                  id="seoDescription"
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Краткое описание для поисковых систем"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Рекомендуется 150-160 символов
                </p>
              </div>

              <div>
                <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
                  Ключевые слова
                </label>
                <input
                  {...register('seoKeywords')}
                  type="text"
                  id="seoKeywords"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  placeholder="Ключевые слова через запятую"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ключевые слова для SEO оптимизации
                </p>
              </div>
            </div>
          )}

          {/* Медиа */}
          {activeTab === 'media' && (
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Изображение новости
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <Image
                          src={imagePreview}
                          alt="Предварительный просмотр"
                          width={128}
                          height={128}
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setValue('imageUrl', '')
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Удалить изображение
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                          >
                            <span>Загрузить изображение</span>
                            <input
                              ref={fileInputRef}
                              id="image-upload"
                              name="image-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">или перетащите сюда</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF до 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Сохранение...' : news ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  )
}
