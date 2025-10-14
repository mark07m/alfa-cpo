import api from '@/lib/api'
import { ApiResponse, PaginatedResponse, NewsItem, NewsCategory } from '@/types'

export interface NewsFilters {
  search?: string
  category?: string
  status?: 'published' | 'draft' | 'archived'
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc'|'desc'
}

function normalizeAuthor(author: any): string {
  if (!author) return 'Администрация СРО'
  if (typeof author === 'string') return author
  return author.name || author.email || 'Администрация СРО'
}

function normalizeCategory(c: any): NewsCategory {
  return {
    id: c.id || c._id || c.slug || '',
    name: c.name || '',
    slug: c.slug || '',
    description: c.description,
    color: c.color,
    icon: c.icon,
    order: c.order || 0,
  }
}

function normalizeNews(n: any): NewsItem {
  return {
    id: n.id || n._id,
    title: n.title,
    content: n.content,
    excerpt: n.excerpt || '',
    publishedAt: n.publishedAt,
    updatedAt: n.updatedAt,
    author: normalizeAuthor(n.author),
    category: n.category ? normalizeCategory(n.category) : { id: '', name: '', slug: '', order: 0 },
    tags: n.tags,
    featured: n.featured,
    imageUrl: n.imageUrl,
    cover: n.cover,
    views: n.views,
    status: n.status || 'published',
  }
}

export const newsService = {
  async list(filters: NewsFilters = {}): Promise<ApiResponse<PaginatedResponse<NewsItem>>> {
    const params: any = {
      status: filters.status || 'published',
      page: filters.page || 1,
      limit: filters.limit || 9,
      sortBy: filters.sortBy || 'publishedAt',
      sortOrder: filters.sortOrder || 'desc',
    }
    if (filters.search) params.search = filters.search
    if (filters.category) params.category = filters.category

    const res = await api.get(`/news`, { params })
    const items = Array.isArray(res.data) ? res.data.map(normalizeNews) : []
    const pagination = res.pagination || { page: params.page, limit: params.limit, total: 0, totalPages: 0 }
    return { success: true, data: { data: items, pagination } }
  },

  async categories(): Promise<ApiResponse<NewsCategory[]>> {
    const res = await api.get<any[]>(`/news/categories`)
    const categories = Array.isArray(res.data) ? res.data.map(normalizeCategory) : []
    return { success: true, data: categories }
  },

  async featured(limit = 3): Promise<ApiResponse<NewsItem[]>> {
    const res = await api.get<any[]>(`/news/featured?limit=${limit}`)
    const items = Array.isArray(res.data) ? res.data.map(normalizeNews) : []
    return { success: true, data: items }
  },
}

export type NewsService = typeof newsService


