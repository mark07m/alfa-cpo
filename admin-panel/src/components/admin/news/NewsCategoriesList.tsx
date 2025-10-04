'use client'

import React from 'react'
import { NewsCategory } from '@/types/admin'
import { PencilIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface NewsCategoriesListProps {
  categories: NewsCategory[]
  onEditCategory: (category: NewsCategory) => void
  onDeleteCategory: (id: string) => void
}

export function NewsCategoriesList({
  categories,
  onEditCategory,
  onDeleteCategory
}: NewsCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-12 sm:px-6 text-center">
          <div className="text-gray-400 mb-4">
            <Bars3Icon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Категории не найдены</h3>
          <p className="text-gray-500">Создайте первую категорию для новостей</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {category.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Slug: {category.slug}
                  </p>
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <span>Порядок: {category.sortOrder}</span>
                    <span className="mx-2">•</span>
                    <span>
                      Создано: {new Date(category.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditCategory(category)}
                    className="text-gray-400 hover:text-amber-600"
                    title="Редактировать"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Удалить"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
