import { apiService } from './api'
import { Document, DocumentCategory, DocumentFilters, DocumentUpload, DocumentVersion, PaginationParams, ApiResponse, PaginationResponse } from '@/types/admin'

export interface DocumentsService {
  getDocuments(filters?: DocumentFilters & PaginationParams): Promise<ApiResponse<{ documents: Document[]; pagination: any }>>
  getDocument(id: string): Promise<ApiResponse<Document>>
  createDocument(documentData: Partial<Document>): Promise<ApiResponse<Document>>
  updateDocument(id: string, documentData: Partial<Document>): Promise<ApiResponse<Document>>
  deleteDocument(id: string): Promise<ApiResponse<void>>
  bulkDeleteDocuments(ids: string[]): Promise<ApiResponse<void>>
  uploadDocument(uploadData: DocumentUpload): Promise<ApiResponse<Document>>
  downloadDocument(id: string): Promise<Blob>
  getDocumentCategories(): Promise<ApiResponse<DocumentCategory[]>>
  createDocumentCategory(categoryData: Partial<DocumentCategory>): Promise<ApiResponse<DocumentCategory>>
  updateDocumentCategory(id: string, categoryData: Partial<DocumentCategory>): Promise<ApiResponse<DocumentCategory>>
  deleteDocumentCategory(id: string): Promise<ApiResponse<void>>
  getDocumentVersions(documentId: string): Promise<ApiResponse<DocumentVersion[]>>
  uploadDocumentVersion(documentId: string, file: File, changeLog?: string): Promise<ApiResponse<DocumentVersion>>
  deleteDocumentVersion(documentId: string, versionId: string): Promise<ApiResponse<void>>
  getPublicDocuments(category?: string): Promise<ApiResponse<Document[]>>
  searchDocuments(query: string): Promise<ApiResponse<Document[]>>
  getDocumentsByCategory(category: string): Promise<ApiResponse<Document[]>>
}

class DocumentsServiceImpl implements DocumentsService {
  async getDocuments(filters: DocumentFilters & PaginationParams = {}): Promise<ApiResponse<{ documents: Document[]; pagination: any }>> {
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.fileType) params.append('fileType', filters.fileType)
      if (filters.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString())
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.append('dateTo', filters.dateTo)
      if (filters.tags) params.append('tags', filters.tags.join(','))
      if (filters.author) params.append('author', filters.author)
      if (filters.minSize) params.append('minSize', filters.minSize.toString())
      if (filters.maxSize) params.append('maxSize', filters.maxSize.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

      const response = await apiService.get(`/documents?${params.toString()}`)
      console.log('Documents service response:', response) // Debug log
      
      // Ensure we always return a valid response
      if (!response || !response.data) {
        return {
          success: false,
          data: { documents: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
          message: 'API unavailable'
        }
      }
      
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch documents:', error)
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        throw error // Re-throw to be caught by Proxy fallback
      }
      return {
        success: false,
        data: { documents: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } },
        message: 'API unavailable'
      }
    }
  }

  async getDocument(id: string): Promise<ApiResponse<Document>> {
    try {
      const response = await apiService.get(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async createDocument(documentData: Partial<Document>): Promise<ApiResponse<Document>> {
    try {
      const response = await apiService.post('/documents', documentData)
      return response.data
    } catch (error) {
      console.error('Failed to create document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateDocument(id: string, documentData: Partial<Document>): Promise<ApiResponse<Document>> {
    try {
      const response = await apiService.put(`/documents/${id}`, documentData)
      return response.data
    } catch (error) {
      console.error('Failed to update document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async bulkDeleteDocuments(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete('/documents/bulk', { data: { ids } })
      return response.data
    } catch (error) {
      console.error('Failed to bulk delete documents:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async uploadDocument(uploadData: DocumentUpload): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData()
      formData.append('file', uploadData.file)
      formData.append('title', uploadData.title)
      if (uploadData.description) formData.append('description', uploadData.description)
      formData.append('category', uploadData.category)
      if (uploadData.tags) formData.append('tags', uploadData.tags.join(','))
      if (uploadData.isPublic !== undefined) formData.append('isPublic', uploadData.isPublic.toString())
      if (uploadData.metadata) formData.append('metadata', JSON.stringify(uploadData.metadata))

      const response = await apiService.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to upload document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async downloadDocument(id: string): Promise<Blob> {
    try {
      const response = await apiService.get(`/documents/${id}/download`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Failed to download document:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getDocumentCategories(): Promise<ApiResponse<DocumentCategory[]>> {
    try {
      const response = await apiService.get('/documents/categories')
      return response.data
    } catch (error: any) {
      console.error('Failed to fetch document categories:', error)
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        throw error // Re-throw to be caught by Proxy fallback
      }
      return {
        success: false,
        data: [],
        message: 'API unavailable'
      }
    }
  }

  async createDocumentCategory(categoryData: Partial<DocumentCategory>): Promise<ApiResponse<DocumentCategory>> {
    try {
      const response = await apiService.post('/documents/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Failed to create document category:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async updateDocumentCategory(id: string, categoryData: Partial<DocumentCategory>): Promise<ApiResponse<DocumentCategory>> {
    try {
      const response = await apiService.put(`/documents/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error('Failed to update document category:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async deleteDocumentCategory(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/documents/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete document category:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getDocumentVersions(documentId: string): Promise<ApiResponse<DocumentVersion[]>> {
    try {
      const response = await apiService.get(`/documents/${documentId}/versions`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch document versions:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async uploadDocumentVersion(documentId: string, file: File, changeLog?: string): Promise<ApiResponse<DocumentVersion>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (changeLog) formData.append('changeLog', changeLog)

      const response = await apiService.post(`/documents/${documentId}/versions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to upload document version:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async deleteDocumentVersion(documentId: string, versionId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiService.delete(`/documents/${documentId}/versions/${versionId}`)
      return response.data
    } catch (error) {
      console.error('Failed to delete document version:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getPublicDocuments(category?: string): Promise<ApiResponse<Document[]>> {
    try {
      const params = category ? `?category=${category}` : ''
      const response = await apiService.get(`/documents/public${params}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch public documents:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async searchDocuments(query: string): Promise<ApiResponse<Document[]>> {
    try {
      const response = await apiService.get(`/documents/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Failed to search documents:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }

  async getDocumentsByCategory(category: string): Promise<ApiResponse<Document[]>> {
    try {
      const response = await apiService.get(`/documents/category/${category}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch documents by category:', error)
      return {
        success: false,
        data: null,
        message: 'API unavailable'
      }
    }
  }
}

// Моковые данные для демонстрации
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Устав СРО АУ',
    description: 'Устав саморегулируемой организации арбитражных управляющих',
    category: {
      id: '1',
      name: 'Нормативные документы',
      slug: 'regulatory',
      description: 'Учредительные и нормативные документы',
      color: '#3B82F6',
      icon: 'document-text',
      isActive: true,
      sortOrder: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    fileUrl: '/documents/ustav-sro-au.pdf',
    fileName: 'ustav-sro-au.pdf',
    originalName: 'Устав СРО АУ.pdf',
    fileSize: 2048576,
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2024-01-15T10:00:00Z',
    version: '1.0',
    isPublic: true,
    downloadCount: 156,
    tags: ['устав', 'нормативные', 'учредительные'],
    metadata: {
      author: 'СРО АУ',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 25
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    },
    updatedBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  },
  {
    id: '2',
    title: 'Правила профессиональной деятельности',
    description: 'Правила профессиональной деятельности арбитражных управляющих',
    category: {
      id: '2',
      name: 'Правила деятельности',
      slug: 'rules',
      description: 'Правила и стандарты профессиональной деятельности',
      color: '#10B981',
      icon: 'clipboard-document-list',
      isActive: true,
      sortOrder: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    fileUrl: '/documents/pravila-prof-deyatelnosti.pdf',
    fileName: 'pravila-prof-deyatelnosti.pdf',
    originalName: 'Правила профессиональной деятельности.pdf',
    fileSize: 1536000,
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2024-01-20T14:30:00Z',
    version: '2.1',
    isPublic: true,
    downloadCount: 89,
    tags: ['правила', 'профессиональная деятельность', 'стандарты'],
    metadata: {
      author: 'СРО АУ',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 18
    },
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    },
    updatedBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  },
  {
    id: '3',
    title: 'Отчет о деятельности за 2023 год',
    description: 'Годовой отчет о деятельности СРО АУ за 2023 год',
    category: {
      id: '3',
      name: 'Отчеты',
      slug: 'reports',
      description: 'Отчеты о деятельности организации',
      color: '#8B5CF6',
      icon: 'chart-bar',
      isActive: true,
      sortOrder: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    fileUrl: '/documents/otchet-2023.pdf',
    fileName: 'otchet-2023.pdf',
    originalName: 'Отчет о деятельности за 2023 год.pdf',
    fileSize: 5120000,
    fileType: 'pdf',
    mimeType: 'application/pdf',
    uploadedAt: '2024-02-01T09:00:00Z',
    version: '1.0',
    isPublic: true,
    downloadCount: 45,
    tags: ['отчет', '2023', 'деятельность'],
    metadata: {
      author: 'СРО АУ',
      publisher: 'СРО АУ',
      language: 'ru',
      pages: 42
    },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
    createdBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    },
    updatedBy: {
      id: '1',
      email: 'admin@sro-au.ru',
      firstName: 'Админ',
      lastName: 'Админов',
      role: 'ADMIN'
    }
  }
]

const mockDocumentCategories: DocumentCategory[] = [
  {
    id: '1',
    name: 'Нормативные документы',
    slug: 'regulatory',
    description: 'Учредительные и нормативные документы',
    color: '#3B82F6',
    icon: 'document-text',
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Правила деятельности',
    slug: 'rules',
    description: 'Правила и стандарты профессиональной деятельности',
    color: '#10B981',
    icon: 'clipboard-document-list',
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Отчеты',
    slug: 'reports',
    description: 'Отчеты о деятельности организации',
    color: '#8B5CF6',
    icon: 'chart-bar',
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Компенсационный фонд',
    slug: 'compensation-fund',
    description: 'Документы по компенсационному фонду',
    color: '#F59E0B',
    icon: 'banknotes',
    isActive: true,
    sortOrder: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Трудовая деятельность',
    slug: 'labor-activity',
    description: 'Документы по трудовой деятельности',
    color: '#EF4444',
    icon: 'briefcase',
    isActive: true,
    sortOrder: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Аккредитация',
    slug: 'accreditation',
    description: 'Документы по аккредитации',
    color: '#06B6D4',
    icon: 'academic-cap',
    isActive: true,
    sortOrder: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'Прочие',
    slug: 'other',
    description: 'Прочие документы',
    color: '#6B7280',
    icon: 'document',
    isActive: true,
    sortOrder: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Создаем экземпляр сервиса с fallback на моковые данные
export const documentsService: DocumentsService = new Proxy(new DocumentsServiceImpl(), {
  get(target, prop) {
    const originalMethod = target[prop as keyof DocumentsService]
    
    if (typeof originalMethod === 'function') {
      return async (...args: any[]) => {
        try {
          return await originalMethod.apply(target, args)
        } catch (error) {
          console.warn(`API call failed, using mock data for ${String(prop)}:`, error)
          
          // Fallback на моковые данные
          switch (prop) {
            case 'getDocuments':
              return {
                success: true,
                data: {
                  documents: mockDocuments,
                  pagination: {
                    page: 1,
                    limit: 10,
                    total: mockDocuments.length,
                    totalPages: 1
                  }
                }
              }
            case 'getDocument':
              const documentId = args[0]
              const document = mockDocuments.find(d => d.id === documentId)
              return {
                success: true,
                data: document || mockDocuments[0]
              }
            case 'getDocumentCategories':
              return {
                success: true,
                data: mockDocumentCategories
              }
            case 'getPublicDocuments':
              return {
                success: true,
                data: mockDocuments.filter(d => d.isPublic)
              }
            case 'searchDocuments':
              const query = args[0]?.toLowerCase() || ''
              const searchResults = mockDocuments.filter(d => 
                d.title.toLowerCase().includes(query) ||
                d.description?.toLowerCase().includes(query) ||
                d.tags.some(tag => tag.toLowerCase().includes(query))
              )
              return {
                success: true,
                data: searchResults
              }
            case 'getDocumentsByCategory':
              const category = args[0]
              const categoryResults = mockDocuments.filter(d => d.category.slug === category)
              return {
                success: true,
                data: categoryResults
              }
            default:
              return {
                success: true,
                data: null
              }
          }
        }
      }
    }
    
    return originalMethod
  }
})
