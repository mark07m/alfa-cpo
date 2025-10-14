import api from '@/lib/api'
import { ApiResponse } from '@/types'

export interface PageData {
  id: string
  title: string
  slug: string
  content: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export const pagesService = {
  async getBySlug(slug: string): Promise<ApiResponse<PageData>> {
    return api.get<PageData>(`/pages/slug/${encodeURIComponent(slug)}`)
  },
  async getSlugs(): Promise<ApiResponse<string[]>> {
    return api.get<string[]>(`/pages/slugs`)
  }
}

export type PagesService = typeof pagesService


