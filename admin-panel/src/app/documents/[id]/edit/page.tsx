'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import { Input } from '@/components/admin/ui/Input'
import { Textarea } from '@/components/admin/ui/Textarea'
import { Select } from '@/components/admin/ui/Select'
import { Checkbox } from '@/components/admin/ui/Checkbox'
import { Button } from '@/components/admin/ui/Button'
import { ApiErrorBanner } from '@/components/admin/ui/ApiErrorBanner'
import { useDocuments } from '@/hooks/admin/useDocuments'

export default function EditDocumentPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const {
    selectedDocument,
    documentCategories,
    isLoading,
    error,
    fetchDocument,
    fetchDocumentCategories,
    updateDocument,
    clearError
  } = useDocuments()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchDocumentCategories()
  }, [fetchDocumentCategories])

  useEffect(() => {
    if (documentId) fetchDocument(documentId)
  }, [documentId, fetchDocument])

  useEffect(() => {
    if (!selectedDocument) return
    setTitle(selectedDocument.title || '')
    setDescription(selectedDocument.description || '')
    setCategory(selectedDocument.category?.slug || selectedDocument.category?.id || '')
    setIsPublic(!!selectedDocument.isPublic)
    setTagsInput((selectedDocument.tags || []).join(', '))
  }, [selectedDocument])

  const categoryOptions = useMemo(() => {
    const options = documentCategories.map(c => ({ value: c.slug, label: c.name }))
    return [{ value: '', label: 'Выберите категорию' }, ...options]
  }, [documentCategories])

  const handleSave = async () => {
    if (!selectedDocument) return
    setSaving(true)
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      const result = await updateDocument(selectedDocument.id, {
        title,
        description,
        category,
        isPublic,
        tags
      })
      if (result.success) {
        router.push(`/documents/${selectedDocument.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Редактировать документ</h2>
            <p className="mt-1 text-sm text-gray-500">Измените атрибуты документа и сохраните</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.push(`/documents/${documentId}`)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving || isLoading}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </div>

        <ApiErrorBanner error={error} onClose={clearError} />

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
              <Input value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} placeholder="Название документа" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория *</label>
              <Select value={category} onChange={(e) => setCategory((e.target as HTMLSelectElement).value)} options={categoryOptions} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <Textarea value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} rows={4} placeholder="Краткое описание" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Теги (через запятую)</label>
              <Input value={tagsInput} onChange={(e) => setTagsInput((e.target as HTMLInputElement).value)} placeholder="например: отчет, 2024" />
            </div>

            <div className="flex items-end">
              <Checkbox checked={isPublic} onChange={(e) => setIsPublic((e.target as HTMLInputElement).checked)} label="Публичный" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// duplicate component removed
