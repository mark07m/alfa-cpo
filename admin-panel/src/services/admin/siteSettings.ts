import { apiService } from './api'
import { SiteSettings, ApiResponse } from '@/types/admin'

function mapFromBackend(payload: any): SiteSettings {
  const id = payload?._id || payload?.id || '1'
  const seo = payload?.seoSettings || {}
  const theme = payload?.themeSettings || {}
  const social = payload?.socialLinks || {}

  return {
    id,
    siteName: payload?.siteName || '',
    siteDescription: payload?.siteDescription || '',
    contactEmail: payload?.contactEmail || '',
    contactPhone: payload?.contactPhone || '',
    address: payload?.address || '',
    logoUrl: theme?.logoUrl ?? '',
    faviconUrl: theme?.faviconUrl ?? '',
    seoTitle: seo?.defaultTitle || '',
    seoDescription: seo?.defaultDescription || '',
    seoKeywords: seo?.defaultKeywords || '',
    theme: {
      primaryColor: theme?.primaryColor || '#D4B89A',
      secondaryColor: theme?.secondaryColor || '#F5F5DC',
      accentColor: theme?.accentColor || '#8B4513',
    },
    socialMedia: {
      facebook: social?.facebook || '',
      twitter: social?.twitter || '',
      linkedin: social?.linkedin || '',
      instagram: '',
    },
    footerText: payload?.footerText || '',
    copyrightText: payload?.copyrightText || '',
    createdAt: payload?.createdAt || new Date().toISOString(),
    updatedAt: payload?.updatedAt || new Date().toISOString(),
  }
}

function isValidEmail(email?: string): boolean {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function buildFullDto(current: SiteSettings, patch: Partial<SiteSettings>) {
  const merged: SiteSettings = {
    ...current,
    ...patch,
    theme: { ...current.theme, ...(patch.theme || {}) },
    socialMedia: { ...(current.socialMedia || {}), ...(patch.socialMedia || {}) },
  }
  return {
    siteName: merged.siteName,
    siteDescription: merged.siteDescription,
    contactEmail: isValidEmail(merged.contactEmail) ? merged.contactEmail : undefined,
    contactPhone: merged.contactPhone || undefined,
    address: merged.address || undefined,
    seoSettings: {
      defaultTitle: merged.seoTitle,
      defaultDescription: merged.seoDescription,
      defaultKeywords: merged.seoKeywords,
    },
    themeSettings: {
      primaryColor: merged.theme.primaryColor,
      secondaryColor: merged.theme.secondaryColor,
      accentColor: merged.theme.accentColor,
      logoUrl: merged.logoUrl || undefined,
      faviconUrl: merged.faviconUrl || undefined,
    },
    socialLinks: {
      facebook: merged.socialMedia?.facebook || undefined,
      twitter: merged.socialMedia?.twitter || undefined,
      linkedin: merged.socialMedia?.linkedin || undefined,
      telegram: undefined,
      vk: undefined,
    },
    footerText: merged.footerText || undefined,
    copyrightText: merged.copyrightText || undefined,
  }
}

function extractErrorMessage(err: any): string {
  const msg = err?.response?.data?.message || err?.message || 'Не удалось сохранить настройки'
  return Array.isArray(msg) ? msg.join(', ') : String(msg)
}

export const siteSettingsService = {
  async getSettings(): Promise<SiteSettings> {
    const response = (await apiService.get<any>('/settings')) as ApiResponse<any>
    const payload = response?.data ?? response
    return mapFromBackend(payload)
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    try {
      const current = await this.getSettings()
      const dto = buildFullDto(current, data)
      const response = (await apiService.put<any>('/settings', dto)) as ApiResponse<any>
      const payload = response?.data ?? response
      return mapFromBackend(payload)
    } catch (err: any) {
      throw new Error(extractErrorMessage(err))
    }
  },

  async resetSettings(): Promise<SiteSettings> {
    try {
      const response = (await apiService.put<any>('/settings/reset')) as ApiResponse<any>
      const payload = response?.data ?? response
      return mapFromBackend(payload)
    } catch (err: any) {
      throw new Error(extractErrorMessage(err))
    }
  },
}
