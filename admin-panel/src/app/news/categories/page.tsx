'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { NewsCategoriesList } from '@/components/admin/news/NewsCategoriesList'
import { NewsCategoryForm } from '@/components/admin/news/NewsCategoryForm'
import { useNews } from '@/hooks/admin/useNews'
import { NewsCategory } from '@/types/admin'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function NewsCategoriesPage() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useNews()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    setIsLoading(false)
  }, [])

  const handleCreateCategory = async (categoryData: Partial<NewsCategory>) => {
    try {
      const response = await createCategory(categoryData)
      if (response.success) {
        setIsFormOpen(false)
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const handleUpdateCategory = async (id: string, categoryData: Partial<NewsCategory>) => {
    try {
      const response = await updateCategory(id, categoryData)
      if (response.success) {
        setEditingCategory(null)
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        const response = await deleteCategory(id)
        if (response.success) {
          fetchCategories()
        }
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleEditCategory = (category: NewsCategory) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  if (isLoading) {
    return (
      <AdminLayout title="Категории новостей">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Категории новостей">
      <div className="space-y-6">
        {/* Заголовок и действия */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Категории новостей</h1>
            <p className="mt-1 text-sm text-gray-500">
              Управление категориями для новостей и объявлений
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Создать категорию
            </button>
          </div>
        </div>

        {/* Форма создания/редактирования */}
        {isFormOpen && (
          <NewsCategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? 
              (data) => handleUpdateCategory(editingCategory.id, data) : 
              handleCreateCategory
            }
            onCancel={handleCloseForm}
          />
        )}

        {/* Список категорий */}
        <NewsCategoriesList
          categories={categories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>
    </AdminLayout>
  )
}
