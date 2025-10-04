import { useState, useEffect, useCallback } from 'react'
import { documentsService } from '@/services/admin/documents'
import { Document, DocumentCategory, DocumentFilters, DocumentUpload, DocumentVersion, PaginationParams, ApiResponse } from '@/types/admin'
import { mockDocuments, mockDocumentCategories } from '@/data/mockData'

interface UseDocumentsReturn {
  // Данные
  documents: Document[]
  documentCategories: DocumentCategory[]
  selectedDocument: Document | null
  documentVersions: DocumentVersion[]
  
  // Состояние загрузки
  isLoading: boolean
  isUploading: boolean
  isVersionsLoading: boolean
  error: string | null
  
  // Пагинация
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  
  // Фильтры
  filters: DocumentFilters
  
  // Методы для работы с документами
  fetchDocuments: (newFilters?: DocumentFilters & PaginationParams) => Promise<void>
  fetchDocument: (id: string) => Promise<void>
  createDocument: (documentData: Partial<Document>) => Promise<{ success: boolean; data?: Document; error?: string }>
  updateDocument: (id: string, documentData: Partial<Document>) => Promise<{ success: boolean; data?: Document; error?: string }>
  deleteDocument: (id: string) => Promise<{ success: boolean; error?: string }>
  bulkDeleteDocuments: (ids: string[]) => Promise<{ success: boolean; error?: string }>
  uploadDocument: (uploadData: DocumentUpload) => Promise<{ success: boolean; data?: Document; error?: string }>
  downloadDocument: (id: string) => Promise<void>
  
  // Методы для работы с категориями документов
  fetchDocumentCategories: () => Promise<void>
  createDocumentCategory: (categoryData: Partial<DocumentCategory>) => Promise<{ success: boolean; data?: DocumentCategory; error?: string }>
  updateDocumentCategory: (id: string, categoryData: Partial<DocumentCategory>) => Promise<{ success: boolean; data?: DocumentCategory; error?: string }>
  deleteDocumentCategory: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Методы для работы с версиями документов
  fetchDocumentVersions: (documentId: string) => Promise<void>
  uploadDocumentVersion: (documentId: string, file: File, changeLog?: string) => Promise<{ success: boolean; data?: DocumentVersion; error?: string }>
  deleteDocumentVersion: (documentId: string, versionId: string) => Promise<{ success: boolean; error?: string }>
  
  // Специальные методы
  getPublicDocuments: (category?: string) => Promise<Document[]>
  searchDocuments: (query: string) => Promise<Document[]>
  getDocumentsByCategory: (category: string) => Promise<Document[]>
  
  // Утилиты
  setFilters: (filters: Partial<DocumentFilters>) => void
  setSelectedDocument: (document: Document | null) => void
  clearError: () => void
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([])
  const [documentCategories, setDocumentCategories] = useState<DocumentCategory[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documentVersions, setDocumentVersions] = useState<DocumentVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isVersionsLoading, setIsVersionsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [filters, setFiltersState] = useState<DocumentFilters>({})

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchDocuments = useCallback(async (newFilters?: DocumentFilters & PaginationParams) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const currentFilters = newFilters || filters
      const response = await documentsService.getDocuments({
        ...currentFilters,
        page: newFilters?.page || pagination.page,
        limit: newFilters?.limit || pagination.limit
      })
      
      console.log('Documents response:', response) // Debug log
      
      if (response && response.success) {
        setDocuments(response.data.documents)
        setPagination(response.data.pagination)
        setError(null)
      } else if (!response || response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for documents')
        setDocuments(mockDocuments)
        setPagination({ page: 1, limit: 10, total: mockDocuments.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Не удалось загрузить документы')
      }
    } catch (err: unknown) {
      console.error('Error fetching documents:', err)
      if (err instanceof Error && (err.message === 'API_UNAVAILABLE' || err.message === 'API unavailable')) {
        // API недоступен, используем моковые данные
        console.info('Using mock data for documents')
        setDocuments(mockDocuments)
        setPagination({ page: 1, limit: 10, total: mockDocuments.length, totalPages: 1 })
        setError(null)
      } else {
        setError('Ошибка при загрузке документов')
      }
    } finally {
      setIsLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  const fetchDocument = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await documentsService.getDocument(id)
      
      if (response && response.success) {
        setSelectedDocument(response.data)
        setError(null)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for document')
        setSelectedDocument(null)
        setError(null)
      } else {
        setError('Не удалось загрузить документ')
      }
    } catch (err) {
      console.error('Error fetching document:', err)
      setError('Ошибка при загрузке документа')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createDocument = useCallback(async (documentData: Partial<Document>) => {
    setError(null)
    
    try {
      const response = await documentsService.createDocument(documentData)
      
      if (response && response.success) {
        await fetchDocuments() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось создать документ' }
      }
    } catch (err) {
      console.error('Error creating document:', err)
      return { success: false, error: 'Ошибка при создании документа' }
    }
  }, [fetchDocuments])

  const updateDocument = useCallback(async (id: string, documentData: Partial<Document>) => {
    setError(null)
    
    try {
      const response = await documentsService.updateDocument(id, documentData)
      
      if (response && response.success) {
        await fetchDocuments() // Обновляем список
        if (selectedDocument?.id === id) {
          setSelectedDocument(response.data)
        }
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить документ' }
      }
    } catch (err) {
      console.error('Error updating document:', err)
      return { success: false, error: 'Ошибка при обновлении документа' }
    }
  }, [fetchDocuments, selectedDocument])

  const deleteDocument = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await documentsService.deleteDocument(id)
      
      if (response && response.success) {
        await fetchDocuments() // Обновляем список
        if (selectedDocument?.id === id) {
          setSelectedDocument(null)
        }
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить документ' }
      }
    } catch (err) {
      console.error('Error deleting document:', err)
      return { success: false, error: 'Ошибка при удалении документа' }
    }
  }, [fetchDocuments, selectedDocument])

  const bulkDeleteDocuments = useCallback(async (ids: string[]) => {
    setError(null)
    
    try {
      const response = await documentsService.bulkDeleteDocuments(ids)
      
      if (response && response.success) {
        await fetchDocuments() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить документы' }
      }
    } catch (err) {
      console.error('Error bulk deleting documents:', err)
      return { success: false, error: 'Ошибка при удалении документов' }
    }
  }, [fetchDocuments])

  const uploadDocument = useCallback(async (uploadData: DocumentUpload) => {
    setIsUploading(true)
    setError(null)
    
    try {
      const response = await documentsService.uploadDocument(uploadData)
      
      if (response && response.success) {
        await fetchDocuments() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось загрузить документ' }
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      return { success: false, error: 'Ошибка при загрузке документа' }
    } finally {
      setIsUploading(false)
    }
  }, [fetchDocuments])

  const downloadDocument = useCallback(async (id: string) => {
    try {
      const blob = await documentsService.downloadDocument(id)
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Получаем имя файла из документа
      const document = documents.find(d => d.id === id)
      link.download = document?.originalName || `document-${id}`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading document:', err)
      setError('Ошибка при скачивании документа')
    }
  }, [documents])

  const fetchDocumentCategories = useCallback(async () => {
    try {
      const response = await documentsService.getDocumentCategories()
      
      if (response && response.success) {
        setDocumentCategories(response.data)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for document categories')
        setDocumentCategories(mockDocumentCategories)
      }
    } catch (err) {
      console.error('Error fetching document categories:', err)
      // Используем моковые данные при ошибке
      setDocumentCategories(mockDocumentCategories)
    }
  }, [])

  const createDocumentCategory = useCallback(async (categoryData: Partial<DocumentCategory>) => {
    setError(null)
    
    try {
      const response = await documentsService.createDocumentCategory(categoryData)
      
      if (response && response.success) {
        await fetchDocumentCategories() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось создать категорию документов' }
      }
    } catch (err) {
      console.error('Error creating document category:', err)
      return { success: false, error: 'Ошибка при создании категории документов' }
    }
  }, [fetchDocumentCategories])

  const updateDocumentCategory = useCallback(async (id: string, categoryData: Partial<DocumentCategory>) => {
    setError(null)
    
    try {
      const response = await documentsService.updateDocumentCategory(id, categoryData)
      
      if (response && response.success) {
        await fetchDocumentCategories() // Обновляем список
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось обновить категорию документов' }
      }
    } catch (err) {
      console.error('Error updating document category:', err)
      return { success: false, error: 'Ошибка при обновлении категории документов' }
    }
  }, [fetchDocumentCategories])

  const deleteDocumentCategory = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const response = await documentsService.deleteDocumentCategory(id)
      
      if (response && response.success) {
        await fetchDocumentCategories() // Обновляем список
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить категорию документов' }
      }
    } catch (err) {
      console.error('Error deleting document category:', err)
      return { success: false, error: 'Ошибка при удалении категории документов' }
    }
  }, [fetchDocumentCategories])

  const fetchDocumentVersions = useCallback(async (documentId: string) => {
    setIsVersionsLoading(true)
    setError(null)
    
    try {
      const response = await documentsService.getDocumentVersions(documentId)
      
      if (response && response.success) {
        setDocumentVersions(response.data)
        setError(null)
      } else if (response && response.message === 'API unavailable') {
        // API недоступен, используем моковые данные
        console.info('Using mock data for document versions')
        setDocumentVersions([])
        setError(null)
      } else {
        setError('Не удалось загрузить версии документа')
      }
    } catch (err) {
      console.error('Error fetching document versions:', err)
      setError('Ошибка при загрузке версий документа')
    } finally {
      setIsVersionsLoading(false)
    }
  }, [])

  const uploadDocumentVersion = useCallback(async (documentId: string, file: File, changeLog?: string) => {
    setError(null)
    
    try {
      const response = await documentsService.uploadDocumentVersion(documentId, file, changeLog)
      
      if (response && response.success) {
        await fetchDocumentVersions(documentId) // Обновляем список версий
        return { success: true, data: response.data }
      } else {
        return { success: false, error: 'Не удалось загрузить версию документа' }
      }
    } catch (err) {
      console.error('Error uploading document version:', err)
      return { success: false, error: 'Ошибка при загрузке версии документа' }
    }
  }, [fetchDocumentVersions])

  const deleteDocumentVersion = useCallback(async (documentId: string, versionId: string) => {
    setError(null)
    
    try {
      const response = await documentsService.deleteDocumentVersion(documentId, versionId)
      
      if (response && response.success) {
        await fetchDocumentVersions(documentId) // Обновляем список версий
        return { success: true }
      } else {
        return { success: false, error: 'Не удалось удалить версию документа' }
      }
    } catch (err) {
      console.error('Error deleting document version:', err)
      return { success: false, error: 'Ошибка при удалении версии документа' }
    }
  }, [fetchDocumentVersions])

  const getPublicDocuments = useCallback(async (category?: string) => {
    try {
      const response = await documentsService.getPublicDocuments(category)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching public documents:', err)
      return []
    }
  }, [])

  const searchDocuments = useCallback(async (query: string) => {
    try {
      const response = await documentsService.searchDocuments(query)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error searching documents:', err)
      return []
    }
  }, [])

  const getDocumentsByCategory = useCallback(async (category: string) => {
    try {
      const response = await documentsService.getDocumentsByCategory(category)
      return response && response.success ? response.data : []
    } catch (err) {
      console.error('Error fetching documents by category:', err)
      return []
    }
  }, [])

  const setFilters = useCallback((newFilters: Partial<DocumentFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchDocuments()
    fetchDocumentCategories()
  }, [fetchDocuments, fetchDocumentCategories])

  return {
    // Данные
    documents,
    documentCategories,
    selectedDocument,
    documentVersions,
    
    // Состояние загрузки
    isLoading,
    isUploading,
    isVersionsLoading,
    error,
    
    // Пагинация
    pagination,
    
    // Фильтры
    filters,
    
    // Методы для работы с документами
    fetchDocuments,
    fetchDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    bulkDeleteDocuments,
    uploadDocument,
    downloadDocument,
    
    // Методы для работы с категориями документов
    fetchDocumentCategories,
    createDocumentCategory,
    updateDocumentCategory,
    deleteDocumentCategory,
    
    // Методы для работы с версиями документов
    fetchDocumentVersions,
    uploadDocumentVersion,
    deleteDocumentVersion,
    
    // Специальные методы
    getPublicDocuments,
    searchDocuments,
    getDocumentsByCategory,
    
    // Утилиты
    setFilters,
    setSelectedDocument,
    clearError
  }
}
