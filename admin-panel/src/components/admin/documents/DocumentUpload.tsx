'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Input } from '@/components/admin/ui/Input'
import { Textarea } from '@/components/admin/ui/Textarea'
import { Select } from '@/components/admin/ui/Select'
import { Button } from '@/components/admin/ui/Button'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { DocumentCategory, DocumentUpload as DocumentUploadType, DocumentMetadata } from '@/types/admin'
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

interface DocumentUploadProps {
  documentCategories: DocumentCategory[]
  onUpload: (uploadData: DocumentUploadType) => Promise<{ success: boolean; error?: string }>
  isUploading: boolean
  onCancel: () => void
}

interface UploadFile {
  file: File
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  metadata: DocumentMetadata
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function DocumentUpload({
  documentCategories,
  onUpload,
  isUploading,
  onCancel
}: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="h-8 w-8 text-blue-500" />
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      addFiles(droppedFiles)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      category: documentCategories[0]?.id || '',
      tags: [],
      isPublic: true,
      metadata: {
        author: '',
        publisher: '',
        language: 'ru',
        pages: undefined
      },
      status: 'pending'
    }))

    setFiles(prev => [...prev, ...uploadFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ))
  }

  const addTag = (fileId: string, tag: string) => {
    const file = files.find(f => f.id === fileId)
    if (file && tag && !file.tags.includes(tag)) {
      updateFile(fileId, { tags: [...file.tags, tag] })
    }
  }

  const removeTag = (fileId: string, tagToRemove: string) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      updateFile(fileId, { tags: file.tags.filter(tag => tag !== tagToRemove) })
    }
  }

  const handleUpload = async () => {
    for (const file of files) {
      if (file.status === 'pending') {
        updateFile(file.id, { status: 'uploading' })
        
        const uploadData: DocumentUploadType = {
          file: file.file,
          title: file.title,
          description: file.description,
          category: file.category,
          tags: file.tags,
          isPublic: file.isPublic,
          metadata: file.metadata
        }

        try {
          const result = await onUpload(uploadData)
          if (result.success) {
            updateFile(file.id, { status: 'success' })
          } else {
            updateFile(file.id, { status: 'error', error: result.error })
          }
        } catch (error) {
          updateFile(file.id, { status: 'error', error: 'Ошибка загрузки' })
        }
      }
    }
  }

  const canUpload = files.length > 0 && files.every(f => f.title.trim() !== '' && f.category !== '')

  return (
    <div className="space-y-6">
      {/* Область загрузки */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Перетащите файлы сюда или
                <span className="text-blue-600 hover:text-blue-500"> выберите файлы</span>
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              className="sr-only"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.mp3,.wav,.zip,.rar"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, MP4, MP3, ZIP и другие
          </p>
        </div>
      </div>

      {/* Список файлов */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Файлы для загрузки ({files.length})
          </h3>
          
          {files.map((file) => (
            <div key={file.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                {/* Иконка файла */}
                <div className="flex-shrink-0">
                  {getFileIcon(file.file.type)}
                </div>

                {/* Информация о файле */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.file.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.file.size)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Статус загрузки */}
                  <div className="mb-4">
                    {file.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Ожидает загрузки
                      </span>
                    )}
                    {file.status === 'uploading' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Загружается...
                      </span>
                    )}
                    {file.status === 'success' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Загружено
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Ошибка: {file.error}
                      </span>
                    )}
                  </div>

                  {/* Форма для каждого файла */}
                  {file.status === 'pending' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название *
                          </label>
                          <Input
                            value={file.title}
                            onChange={(e) => updateFile(file.id, { title: e.target.value })}
                            placeholder="Название документа"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Категория *
                          </label>
                          <Select
                            value={file.category}
                            onChange={(e) => updateFile(file.id, { category: (e.target as HTMLSelectElement).value })}
                            options={[{ value: '', label: 'Выберите категорию' }, ...documentCategories.map(c => ({ value: c.id, label: c.name }))]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <Textarea
                          value={file.description}
                          onChange={(e) => updateFile(file.id, { description: e.target.value })}
                          rows={2}
                          placeholder="Краткое описание документа"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Теги
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {file.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(file.id, tag)}
                                className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <Input
                          placeholder="Введите тег и нажмите Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const input = e.target as HTMLInputElement
                              addTag(file.id, input.value.trim())
                              input.value = ''
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={file.isPublic}
                          onChange={(e) => updateFile(file.id, { isPublic: (e.target as HTMLInputElement).checked })}
                          label="Публичный документ"
                          size="sm"
                        />
                      </div>

                      {/* Метаданные */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Автор
                          </label>
                          <Input
                            value={file.metadata.author || ''}
                            onChange={(e) => updateFile(file.id, { metadata: { ...file.metadata, author: (e.target as HTMLInputElement).value } })}
                            placeholder="Автор документа"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Издатель
                          </label>
                          <Input
                            value={file.metadata.publisher || ''}
                            onChange={(e) => updateFile(file.id, { metadata: { ...file.metadata, publisher: (e.target as HTMLInputElement).value } })}
                            placeholder="Издатель"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Количество страниц
                          </label>
                          <Input
                            type="number"
                            value={file.metadata.pages || ''}
                            onChange={(e) => updateFile(file.id, { metadata: { ...file.metadata, pages: (e.target as HTMLInputElement).value ? parseInt((e.target as HTMLInputElement).value) : undefined } })}
                            placeholder="Количество страниц"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={handleUpload} disabled={!canUpload || isUploading}>
          {isUploading ? 'Загрузка...' : `Загрузить ${files.length} файлов`}
        </Button>
      </div>
    </div>
  )
}
