import api from '@/lib/api'
import { ApiResponse, PaginatedResponse, Document } from '@/types'
import { API_BASE_URL } from '@/constants'

export interface DocumentFilters {
  search?: string
  category?: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other'
  page?: number
  limit?: number
  sortBy?: 'uploadedAt' | 'title' | 'downloadCount' | 'fileSize'
  sortOrder?: 'asc'|'desc'
}

export const documentsService = {
  async getById(id: string): Promise<ApiResponse<Document>> {
    const res = await api.get<any>(`/documents/${encodeURIComponent(id)}`)
    const d = (res as any).data || (res as any)
    const mapped: Document = {
      id: d.id || d._id,
      title: d.title,
      description: d.description,
      category: d.category,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
      fileType: d.fileType,
      uploadedAt: d.uploadedAt,
      updatedAt: d.updatedAt || d.uploadedAt,
      version: d.version,
    }
    return { success: true, data: mapped }
  },
  async listPublic(filters: DocumentFilters = {}): Promise<ApiResponse<PaginatedResponse<Document>>> {
    const params: any = {}
    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    if (filters.sortBy) params.sortBy = filters.sortBy
    if (filters.sortOrder) params.sortOrder = filters.sortOrder
    const res = await api.get(`/documents/public`, { params })
    const data = Array.isArray(res.data) ? res.data.map((d: any) => ({
      id: d.id || d._id,
      title: d.title,
      description: d.description,
      category: d.category,
      fileUrl: d.fileUrl,
      fileSize: d.fileSize,
      fileType: d.fileType,
      uploadedAt: d.uploadedAt,
      updatedAt: d.updatedAt || d.uploadedAt,
      version: d.version,
    })) : []
    const pagination = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    return { success: true, data: { data, pagination } }
  },

  async categories(): Promise<ApiResponse<Array<{ value: string; label: string; count: number }>>> {
    const res = await api.get<Array<{ value: string; label: string; count: number }>>(`/documents/categories`)
    // Backend already returns envelope; just return as-is
    return res
  },

  getPreviewUrl(documentId: string): string {
    return `${API_BASE_URL}/documents/${encodeURIComponent(documentId)}/preview`
  },

  getDownloadUrl(documentId: string): string {
    return `${API_BASE_URL}/documents/${encodeURIComponent(documentId)}/download`
  }
}

export type DocumentsService = typeof documentsService


