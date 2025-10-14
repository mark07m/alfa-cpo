import api from '@/lib/api'
import { ApiResponse, SiteSettings } from '@/types'

export const settingsService = {
  async get(): Promise<ApiResponse<SiteSettings>> {
    return api.get<SiteSettings>('/settings')
  }
}

export type SettingsService = typeof settingsService


