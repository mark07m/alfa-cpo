'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { FormField } from '@/components/admin/ui/FormField'
import { Input } from '@/components/admin/ui/Input'
import { Select } from '@/components/admin/ui/Select'
import { Textarea } from '@/components/admin/ui/Textarea'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { Button } from '@/components/admin/ui/Button'
import { useDocuments } from '@/hooks/admin/useDocuments'
import { Document, DocumentCategory } from '@/types/admin'
import { 
  DocumentIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  TagIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'

export default function DocumentEditPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const {
    selectedDocument,
    documentCategories,
    isLoading,
    error,
    fetchDocument,
    updateDocument,
    clearError
  } = useDocuments()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    isPublic: true,
    version: '',
    metadata: {
      author: '',
      publisher: '',
      language: 'ru',
      pages: undefined as number | undefined
    }
  })

  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId)
    }
  }, [documentId, fetchDocument])

  useEffect(() => {
    if (selectedDocument) {
      setFormData({
        title: selectedDocument.title || '',
        description: selectedDocument.description || '',
        category: selectedDocument.category?.id || '',
        tags: selectedDocument.tags || [],
        isPublic: selectedDocument.isPublic || false,
        version: selectedDocument.version || '',
        metadata: {
          author: selectedDocument.metadata?.author || '',
          publisher: selectedDocument.metadata?.publisher || '',
          language: selectedDocument.metadata?.language || 'ru',
          pages: selectedDocument.metadata?.pages
        }
      })
    }
  }, [selectedDocument])

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMetadataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSave = async () => {
    if (!selectedDocument) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const updateData: Partial<Document> = {
        title: formData.title,
        description: formData.description,
        category: documentCategories.find(c => c.id === formData.category),
        tags: formData.tags,
        isPublic: formData.isPublic,
        version: formData.version,
        metadata: formData.metadata
      }

      const result = await updateDocument(selectedDocument.id, updateData)
      
      if (result.success) {
        router.push('/documents')
      } else {
        setSaveError(result.error || 'Ошибка при сохранении документа')
      }
    } catch (err) {
      console.error('Error saving document:', err)
      setSaveError('Ошибка при сохранении документа')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/documents')
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
                <Button
                  variant="primary"
                  onClick={() => router.push('/documents')}
                >
                  Вернуться к документам
                </Button>
              </div>
            </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Редактирование документа"
          subtitle={selectedDocument.title}
          backUrl="/documents"
          backLabel="К документам"
          secondaryActions={[
            {
              label: 'Отмена',
              onClick: handleCancel,
              variant: 'outline'
            }
          ]}
          primaryAction={{
            label: isSaving ? 'Сохранение...' : 'Сохранить изменения',
            onClick: handleSave,
            variant: 'primary',
            disabled: isSaving || !formData.title.trim() || !formData.category
          }}
        />

        {/* Ошибки */}
        <ApiErrorBanner 
          error={error} 
          onClose={clearError}
        />

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка сохранения
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {saveError}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setSaveError(null)}
                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Информация о файле */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о файле</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedDocument.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedDocument.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(selectedDocument.fileSize)} • {selectedDocument.fileType.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Загружен: {formatDate(selectedDocument.uploadedAt)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Автор: {selectedDocument.createdBy?.name || 'Неизвестно'}
                  </div>

                  {selectedDocument.version && (
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Версия: {selectedDocument.version}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    {selectedDocument.isPublic ? (
                      <>
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-green-500" />
                        Публичный документ
                      </>
                    ) : (
                      <>
                        <LockClosedIcon className="h-4 w-4 mr-2 text-gray-400" />
                        Приватный документ
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Форма редактирования */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Название */}
                <FormField
                  label="Название документа"
                  htmlFor="title"
                  required
                >
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Введите название документа"
                  />
                </FormField>

                {/* Описание */}
                <FormField
                  label="Описание"
                  htmlFor="description"
                >
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    placeholder="Краткое описание документа"
                  />
                </FormField>

                {/* Категория */}
                <FormField
                  label="Категория"
                  htmlFor="category"
                  required
                >
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={[
                      { value: '', label: 'Выберите категорию' },
                      ...documentCategories.map(cat => ({ value: cat.id, label: cat.name }))
                    ]}
                  />
                </FormField>

                {/* Теги */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Теги
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Введите тег и нажмите Enter"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                    >
                      Добавить
                    </Button>
                  </div>
                </div>

                {/* Версия */}
                <FormField
                  label="Версия"
                  htmlFor="version"
                >
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="Например: 1.0, 2.1, 2024.1"
                  />
                </FormField>

                {/* Публичность */}
                <Checkbox
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  label="Публичный документ (доступен для всех пользователей)"
                />
              </div>

              {/* Метаданные */}
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Дополнительные метаданные</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Автор"
                    htmlFor="author"
                  >
                    <Input
                      id="author"
                      value={formData.metadata.author}
                      onChange={(e) => handleMetadataChange('author', e.target.value)}
                      placeholder="Автор документа"
                    />
                  </FormField>

                  <FormField
                    label="Издатель"
                    htmlFor="publisher"
                  >
                    <Input
                      id="publisher"
                      value={formData.metadata.publisher}
                      onChange={(e) => handleMetadataChange('publisher', e.target.value)}
                      placeholder="Издатель"
                    />
                  </FormField>

                  <FormField
                    label="Язык"
                    htmlFor="language"
                  >
                    <Select
                      id="language"
                      value={formData.metadata.language}
                      onChange={(e) => handleMetadataChange('language', e.target.value)}
                      options={[
                        { value: 'ru', label: 'Русский' },
                        { value: 'en', label: 'English' },
                        { value: 'de', label: 'Deutsch' },
                        { value: 'fr', label: 'Français' }
                      ]}
                    />
                  </FormField>

                  <FormField
                    label="Количество страниц"
                    htmlFor="pages"
                  >
                    <Input
                      id="pages"
                      type="number"
                      value={formData.metadata.pages || ''}
                      onChange={(e) => handleMetadataChange('pages', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Количество страниц"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
