'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Document, DocumentCategory } from '@/types/admin'
import { Button } from '@/components/admin/ui/Button'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { 
  DocumentIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  GlobeAltIcon,
  LockClosedIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface DocumentsListProps {
  documents: Document[]
  documentCategories: DocumentCategory[]
  isLoading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  selectedDocuments: Document[]
  onSelectDocument: (document: Document, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onDeleteDocument: (id: string) => void
  onDownloadDocument: (id: string) => void
  onPageChange: (page: number) => void
}

export function DocumentsList({
  documents,
  documentCategories,
  isLoading,
  pagination,
  selectedDocuments,
  onSelectDocument,
  onSelectAll,
  onDeleteDocument,
  onDownloadDocument,
  onPageChange
}: DocumentsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
      setDeletingId(id)
      try {
        await onDeleteDocument(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <DocumentTextIcon className="h-8 w-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <DocumentTextIcon className="h-8 w-8 text-green-500" />
      case 'ppt':
      case 'pptx':
        return <DocumentTextIcon className="h-8 w-8 text-orange-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <PhotoIcon className="h-8 w-8 text-purple-500" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoCameraIcon className="h-8 w-8 text-pink-500" />
      case 'mp3':
      case 'wav':
        return <MusicalNoteIcon className="h-8 w-8 text-indigo-500" />
      case 'zip':
      case 'rar':
        return <ArchiveBoxIcon className="h-8 w-8 text-gray-500" />
      default:
        return <DocumentIcon className="h-8 w-8 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru })
    } catch {
      return dateString
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const category = documentCategories.find(c => c.id === categoryId)
    return category?.color || '#6B7280'
  }

  const getCategoryName = (categoryId: string) => {
    const category = documentCategories.find(c => c.id === categoryId)
    return category?.name || 'Неизвестная категория'
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Нет документов</h3>
          <p className="mt-1 text-sm text-gray-500">
            Начните с загрузки нового документа
          </p>
          <div className="mt-6">
            <Link
              href="/documents/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-150"
            >
              Загрузить документ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* Заголовок с чекбоксом "Выбрать все" */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Checkbox
              checked={selectedDocuments.length === documents.length && documents.length > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              size="md"
            />
            <span className="ml-2 text-sm text-gray-700">
              Выбрать все ({selectedDocuments.length} из {documents.length})
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Всего: {pagination.total} документов
          </div>
        </div>

        {/* Список документов */}
        <div className="space-y-4">
          {documents.map((document, index) => {
            const isSelected = selectedDocuments.some(selected => selected.id === document.id)
            const isDeleting = deletingId === document.id
            // Ensure we have a unique key - use id if available, otherwise use index
            const uniqueKey = document.id || `document-${index}`

            return (
              <div
                key={uniqueKey}
                className={`border rounded-lg p-4 transition-all duration-150 ${
                  isSelected ? 'border-primary-500 bg-primary-50/30 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'
                } ${isDeleting ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Чекбокс выбора */}
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectDocument(document, e.target.checked)}
                      className="mt-1"
                      size="md"
                    />

                    {/* Иконка файла */}
                    <div className="flex-shrink-0">
                      {getFileIcon(document.fileType)}
                    </div>

                    {/* Основная информация */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {document.title}
                          </h3>
                          
                          {document.description && (
                            <p className="mt-1 text-sm text-gray-600 truncate">
                              {document.description}
                            </p>
                          )}

                          {/* Метаинформация */}
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <span 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{ 
                                  backgroundColor: getCategoryColor(document.category.id) + '20', 
                                  color: getCategoryColor(document.category.id) 
                                }}
                              >
                                {getCategoryName(document.category.id)}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <DocumentIcon className="h-4 w-4 mr-1" />
                              {document.originalName}
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-400">•</span>
                              <span className="ml-1">{formatFileSize(document.fileSize)}</span>
                            </div>

                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {formatDate(document.uploadedAt)}
                            </div>

                            <div className="flex items-center">
                              <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                              {document.downloadCount} скачиваний
                            </div>

                            {document.version && (
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                v{document.version}
                              </div>
                            )}
                          </div>

                          {/* Теги и статус */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            {document.tags?.slice(0, 3).map((tag, index) => (
                              <span
                                key={`${uniqueKey}-tag-${index}-${tag}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}

                            {document.isPublic ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <GlobeAltIcon className="h-3 w-3 mr-1" />
                                Публичный
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <LockClosedIcon className="h-3 w-3 mr-1" />
                                Приватный
                              </span>
                            )}
                          </div>

                          {/* Метаданные */}
                          {document.metadata && (
                            <div className="mt-2 text-xs text-gray-500">
                              {document.metadata.author && (
                                <span className="flex items-center">
                                  <UserIcon className="h-3 w-3 mr-1" />
                                  {document.metadata.author}
                                  {document.metadata.pages && ` • ${document.metadata.pages} стр.`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Статус публичности */}
                        <div className="ml-4 flex-shrink-0">
                          {document.isPublic ? (
                            <GlobeAltIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <Button
                      onClick={() => onDownloadDocument(document.id)}
                      variant="ghost"
                      size="sm"
                      icon={<ArrowDownTrayIcon className="h-4 w-4" />}
                      title="Скачать"
                      aria-label="Скачать"
                      iconOnly
                    />
                    
                    <Link
                      href={`/documents/${document.id}`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Просмотр"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    
                    <Link
                      href={`/documents/${document.id}/edit`}
                      className="text-gray-400 hover:text-blue-600"
                      title="Редактировать"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>

                    <Button
                      onClick={() => handleDelete(document.id)}
                      disabled={isDeleting}
                      variant="ghost"
                      size="sm"
                      icon={<TrashIcon className="h-4 w-4" />}
                      title="Удалить"
                      aria-label="Удалить"
                      iconOnly
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Пагинация */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total}
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="outline"
                size="sm"
              >
                Предыдущая
              </Button>
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1
                const isCurrentPage = page === pagination.page
                
                return (
                  <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={isCurrentPage ? 'primary' : 'outline'}
                    size="sm"
                  >
                    {page}
                  </Button>
                )
              })}
              
              <Button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                Следующая
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
