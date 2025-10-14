import api from '@/lib/api'
import { ApiResponse, PaginatedResponse, Document } from '@/types'

export interface DocumentFilters {
  search?: string
  category?: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other'
  page?: number
  limit?: number
  sortBy?: 'uploadedAt' | 'title' | 'downloadCount' | 'fileSize'
  sortOrder?: 'asc'|'desc'
}

export const documentsService = {
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
      updatedAt: d.updatedAt,
      version: d.version,
    })) : []
    const pagination = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
    return { success: true, data: { data, pagination } }
  }
}

export type DocumentsService = typeof documentsService


