'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { DocumentsList } from '@/components/admin/documents/DocumentsList'
import { DocumentsFilters } from '@/components/admin/documents/DocumentsFilters'
import { DocumentUpload } from '@/components/admin/documents/DocumentUpload'
import { useDocuments } from '@/hooks/admin/useDocuments'
import { Document, DocumentFilters } from '@/types/admin'
import type { DocumentUpload as DocumentUploadType } from '@/types/admin'
import { 
  FunnelIcon, 
  CloudArrowUpIcon,
  DocumentIcon,
  FolderIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'

export default function DocumentsPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const {
    documents,
    documentCategories,
    isLoading,
    error,
    pagination,
    filters,
    fetchDocuments,
    deleteDocument,
    downloadDocument,
    uploadDocument,
    bulkDeleteDocuments,
    setFilters,
    clearError
  } = useDocuments()

  useEffect(() => {
    fetchDocuments(filters)
  }, [filters, fetchDocuments])

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm })
  }

  const handleFilterChange = (newFilters: Partial<DocumentFilters>) => {
    setFilters(newFilters)
  }

  const handleSelectDocument = (document: Document, selected: boolean) => {
    if (selected) {
      setSelectedDocuments(prev => [...prev, document])
    } else {
      setSelectedDocuments(prev => prev.filter(item => item.id !== document.id))
    }
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedDocuments(documents)
    } else {
      setSelectedDocuments([])
    }
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleBulkAction = async (action: string, documentIds: string[]) => {
    setIsProcessing(true)
    try {
      switch (action) {
        case 'delete':
          await bulkDeleteDocuments(documentIds)
          setSelectedDocuments([])
          break
        case 'download':
          for (const id of documentIds) {
            await downloadDocument(id)
          }
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
    fetchDocuments({ ...filters, page })
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id)
      setSelectedDocuments(prev => prev.filter(document => document.id !== id))
    } catch (error) {
      console.error('Delete document failed:', error)
    }
  }

  const handleDownloadDocument = async (id: string) => {
    try {
      await downloadDocument(id)
    } catch (error) {
      console.error('Download document failed:', error)
    }
  }

  const handleUploadDocument = async (uploadData: DocumentUploadType, onProgress?: (percent: number) => void) => {
    try {
      const result = await uploadDocument(uploadData, onProgress)
      if (result.success) {
        setShowUpload(false)
        await fetchDocuments() // Обновляем список
      }
      return result
    } catch (error) {
      console.error('Upload document failed:', error)
      return { success: false, error: 'Ошибка загрузки документа' }
    }
  }

  const getCategoryStats = () => {
    const stats = documentCategories.map(category => ({
      ...category,
      count: documents?.filter(d => d.category.id === category.id).length || 0
    }))
    return stats
  }

  const getFileTypeStats = () => {
    const typeCounts: { [key: string]: number } = {}
    documents?.forEach(doc => {
      typeCounts[doc.fileType] = (typeCounts[doc.fileType] || 0) + 1
    })
    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }))
  }

  if (showUpload) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Заголовок страницы */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Загрузка документов
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Загрузите один или несколько документов
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowUpload(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Отмена
            </button>
            </div>
          </div>

          {/* Форма загрузки */}
          <DocumentUpload
            documentCategories={documentCategories}
            onUpload={handleUploadDocument}
            isUploading={isLoading}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Управление документами
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Загрузка, редактирование и управление документами СРО АУ
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              Загрузить документы
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg flex-1 min-w-0">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Всего документов
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
                      Публичные
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {documents?.filter(d => d.isPublic).length || 0}
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
                  <div className="h-6 w-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Категории
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {documentCategories.length}
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
                  <ArrowDownTrayIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Скачиваний
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {documents?.reduce((sum, d) => sum + d.downloadCount, 0) || 0}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Документы по категориям</h3>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Типы файлов</h3>
            <div className="space-y-3">
              {getFileTypeStats().map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900 uppercase">{type}</span>
                  <span className="text-sm font-medium text-gray-500">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Переключатель вида */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border-2 text-sm font-medium rounded-lg border-primary-500 text-primary-700 bg-primary-50 shadow-sm"
            >
              <DocumentIcon className="h-4 w-4 mr-2" />
              Список
            </button>
            <button
              className="inline-flex items-center px-3 py-2 border text-sm font-medium rounded-lg border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              <FolderIcon className="h-4 w-4 mr-2" />
              Папки
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                showFilters
                  ? 'border-primary-500 text-primary-700 bg-primary-50 shadow-sm'
                  : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300'
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
          onRetry={() => fetchDocuments()}
        />

        {/* Фильтры */}
        <DocumentsFilters
          documentCategories={documentCategories}
          filters={filters}
          onFiltersChange={handleFilterChange}
          onSearch={handleSearch}
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />

        {/* Массовые действия */}
        {selectedDocuments.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-primary-900">
                  Выбрано документов: {selectedDocuments.length}
                </span>
                <button
                  onClick={() => setSelectedDocuments([])}
                  className="ml-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Очистить выбор
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('download', selectedDocuments.map(d => d.id))}
                  className="inline-flex items-center px-3 py-2 border border-primary-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Скачать
                </button>
                <button
                  onClick={() => handleBulkAction('delete', selectedDocuments.map(d => d.id))}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-all"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Список документов */}
        <DocumentsList
          documents={documents}
          documentCategories={documentCategories}
          isLoading={isLoading}
          pagination={pagination}
          selectedDocuments={selectedDocuments}
          onSelectDocument={handleSelectDocument}
          onSelectAll={handleSelectAll}
          onDeleteDocument={handleDeleteDocument}
          onDownloadDocument={handleDownloadDocument}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  )
}
