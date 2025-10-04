'use client'

import React, { useState } from 'react'
import { NewsCategory } from '@/types/admin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
  slug: z.string().min(1, 'Slug обязателен').max(100, 'Slug слишком длинный'),
  color: z.string().min(1, 'Цвет обязателен'),
  icon: z.string().min(1, 'Иконка обязательна'),
  sortOrder: z.number().min(0, 'Порядок не может быть отрицательным')
})

type CategoryFormData = z.infer<typeof categorySchema>

interface NewsCategoryFormProps {
  category?: NewsCategory | null
  onSubmit: (data: Partial<NewsCategory>) => void
  onCancel: () => void
}

const predefinedColors = [
  { name: 'Синий', value: '#3B82F6' },
  { name: 'Зеленый', value: '#10B981' },
  { name: 'Желтый', value: '#F59E0B' },
  { name: 'Красный', value: '#EF4444' },
  { name: 'Фиолетовый', value: '#8B5CF6' },
  { name: 'Розовый', value: '#EC4899' },
  { name: 'Серый', value: '#6B7280' },
  { name: 'Индиго', value: '#6366F1' }
]

const predefinedIcons = [
  { name: 'Документ', value: 'document-text' },
  { name: 'Календарь', value: 'calendar' },
  { name: 'Пользователи', value: 'users' },
  { name: 'Мегафон', value: 'megaphone' },
  { name: 'Папка', value: 'folder' },
  { name: 'Звезда', value: 'star' },
  { name: 'Флаг', value: 'flag' },
  { name: 'Тег', value: 'tag' }
]

export function NewsCategoryForm({
  category,
  onSubmit,
  onCancel
}: NewsCategoryFormProps) {
  const [customColor, setCustomColor] = useState('')
  const [isCustomColor, setIsCustomColor] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      color: category?.color || '#3B82F6',
      icon: category?.icon || 'document-text',
      sortOrder: category?.sortOrder || 0
    }
  })

  const watchedColor = watch('color')
  const watchedName = watch('name')

  // Автоматическое создание slug из названия
  React.useEffect(() => {
    if (!category && watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9а-я\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [watchedName, category, setValue])

  const handleFormSubmit = (data: CategoryFormData) => {
    const categoryData: Partial<NewsCategory> = {
      name: data.name,
      slug: data.slug,
      color: isCustomColor ? customColor : data.color,
      icon: data.icon,
      sortOrder: data.sortOrder
    }

    onSubmit(categoryData)
  }

  const handleColorChange = (color: string) => {
    if (color === 'custom') {
      setIsCustomColor(true)
      setValue('color', customColor || '#3B82F6')
    } else {
      setIsCustomColor(false)
      setValue('color', color)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {category ? 'Редактирование категории' : 'Создание категории'}
        </h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Название *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="Введите название категории"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              {...register('slug')}
              type="text"
              id="slug"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="url-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Используется в URL. Только латинские буквы, цифры и дефисы
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Цвет *
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorChange(color.value)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      watchedColor === color.value ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleColorChange('custom')}
                  className={`w-8 h-8 rounded-full border-2 ${
                    isCustomColor ? 'border-gray-900' : 'border-gray-300'
                  } bg-gradient-to-r from-red-500 via-yellow-500 to-green-500`}
                  title="Пользовательский цвет"
                />
              </div>
              
              {isCustomColor && (
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value)
                      setValue('color', e.target.value)
                    }}
                    className="h-8 w-16 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value)
                      setValue('color', e.target.value)
                    }}
                    placeholder="#3B82F6"
                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              )}
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Иконка *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {predefinedIcons.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setValue('icon', icon.value)}
                  className={`p-2 border rounded-md text-sm ${
                    watch('icon') === icon.value
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  title={icon.name}
                >
                  {icon.name}
                </button>
              ))}
            </div>
            {errors.icon && (
              <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
            Порядок сортировки
          </label>
          <input
            {...register('sortOrder', { valueAsNumber: true })}
            type="number"
            id="sortOrder"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            placeholder="0"
          />
          {errors.sortOrder && (
            <p className="mt-1 text-sm text-red-600">{errors.sortOrder.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Чем меньше число, тем выше в списке
          </p>
        </div>

        {/* Предварительный просмотр */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Предварительный просмотр</h4>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: isCustomColor ? customColor : watchedColor }}
            ></div>
            <span className="text-sm font-medium text-gray-900">
              {watchedName || 'Название категории'}
            </span>
            <span className="text-xs text-gray-500">
              ({watch('slug') || 'slug'})
            </span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            {category ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  )
}
