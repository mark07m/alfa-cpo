'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { useDocuments } from '@/hooks/admin/useDocuments'
import { 
  ArrowLeftIcon,
  DocumentIcon,
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
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'

export default function DocumentViewPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const {
    selectedDocument,
    isLoading,
    error,
    fetchDocument,
    deleteDocument,
    downloadDocument,
    clearError
  } = useDocuments()

  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId)
    }
  }, [documentId, fetchDocument])

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <DocumentTextIcon className="h-12 w-12 text-red-500" />
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="h-12 w-12 text-blue-500" />
      case 'xls':
      case 'xlsx':
        return <DocumentTextIcon className="h-12 w-12 text-green-500" />
      case 'ppt':
      case 'pptx':
        return <DocumentTextIcon className="h-12 w-12 text-orange-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <PhotoIcon className="h-12 w-12 text-purple-500" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <VideoCameraIcon className="h-12 w-12 text-pink-500" />
      case 'mp3':
      case 'wav':
        return <MusicalNoteIcon className="h-12 w-12 text-indigo-500" />
      case 'zip':
      case 'rar':
        return <ArchiveBoxIcon className="h-12 w-12 text-gray-500" />
      default:
        return <DocumentIcon className="h-12 w-12 text-gray-500" />
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

  const handleDelete = async () => {
    if (!selectedDocument) return

    if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
      setIsDeleting(true)
      try {
        const result = await deleteDocument(selectedDocument.id)
        if (result.success) {
          router.push('/documents')
        }
      } catch (error) {
        console.error('Error deleting document:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleDownload = async () => {
    if (!selectedDocument) return

    try {
      await downloadDocument(selectedDocument.id)
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!selectedDocument) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center py-12">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Документ не найден</h3>
            <p className="mt-1 text-sm text-gray-500">
              Запрашиваемый документ не существует или был удален
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/documents')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Вернуться к документам
              </button>
            </div>
          </div>
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
            <div className="flex items-center">
              <button
                onClick={() => router.push('/documents')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  {selectedDocument.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Просмотр документа
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Скачать
            </button>
            <Link
              href={`/documents/${selectedDocument.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Редактировать
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        </div>

        {/* Ошибки */}
        <ApiErrorBanner 
          error={error} 
          onClose={clearError}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Информация о файле */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о файле</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {getFileIcon(selectedDocument.fileType)}
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedDocument.originalName}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(selectedDocument.fileSize)} • {selectedDocument.fileType.toUpperCase()}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Категория:</span>
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: selectedDocument.category?.color + '20', 
                        color: selectedDocument.category?.color 
                      }}
                    >
                      {selectedDocument.category?.name || 'Неизвестная категория'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Статус:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDocument.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDocument.isPublic ? (
                        <>
                          <GlobeAltIcon className="h-3 w-3 mr-1" />
                          Публичный
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="h-3 w-3 mr-1" />
                          Приватный
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Скачиваний:</span>
                    <span className="font-medium">{selectedDocument.downloadCount}</span>
                  </div>

                  {selectedDocument.version && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Версия:</span>
                      <span className="font-medium">v{selectedDocument.version}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Загружен:</span>
                    <span className="font-medium">{formatDate(selectedDocument.uploadedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Автор:</span>
                    <span className="font-medium">{selectedDocument.createdBy?.name || 'Неизвестно'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Теги */}
            {selectedDocument.tags && selectedDocument.tags.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Описание документа</h3>
              </div>
              
              <div className="px-6 py-4">
                {selectedDocument.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedDocument.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Описание не указано</p>
                )}
              </div>

              {/* Метаданные */}
              {selectedDocument.metadata && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Дополнительные метаданные</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDocument.metadata.author && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Автор</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.metadata.author}</dd>
                      </div>
                    )}

                    {selectedDocument.metadata.publisher && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Издатель</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.metadata.publisher}</dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">Язык</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedDocument.metadata.language === 'ru' ? 'Русский' : 
                         selectedDocument.metadata.language === 'en' ? 'English' :
                         selectedDocument.metadata.language === 'de' ? 'Deutsch' :
                         selectedDocument.metadata.language === 'fr' ? 'Français' :
                         selectedDocument.metadata.language}
                      </dd>
                    </div>

                    {selectedDocument.metadata.pages && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Количество страниц</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.metadata.pages}</dd>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* История изменений */}
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">История изменений</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Создан: {formatDate(selectedDocument.createdAt)}
                  </div>
                  
                  {selectedDocument.updatedAt !== selectedDocument.createdAt && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Обновлен: {formatDate(selectedDocument.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
