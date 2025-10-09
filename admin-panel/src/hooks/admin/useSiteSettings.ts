import { useState, useCallback } from 'react';
import { siteSettingsService } from '@/services/admin/siteSettings';
import { SiteSettings } from '@/types/admin';

const defaultSettings: SiteSettings = {
  id: '1',
  siteName: '',
  siteDescription: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  logoUrl: '',
  faviconUrl: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  theme: {
    primaryColor: '#D4B89A',
    secondaryColor: '#F5F5DC',
    accentColor: '#8B4513',
  },
  socialMedia: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
  footerText: '',
  copyrightText: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await siteSettingsService.getSettings();
      setSettings(data);
    } catch (e: any) {
      console.error('Ошибка загрузки настроек:', e);
      setError(e?.message || 'Не удалось загрузить настройки');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: Partial<SiteSettings>) => {
    try {
      setError(null);
      const updated = await siteSettingsService.updateSettings(data);
      setSettings(updated);
      return true;
    } catch (e: any) {
      console.error('Ошибка сохранения настроек:', e);
      setError(e?.message || 'Не удалось сохранить настройки');
      return false;
    }
  }, []);

  const resetToDefault = useCallback(async () => {
    try {
      setError(null);
      const reset = await siteSettingsService.resetSettings();
      setSettings(reset);
      return true;
    } catch (e: any) {
      console.error('Ошибка сброса настроек:', e);
      setError(e?.message || 'Не удалось сбросить настройки');
      return false;
    }
  }, []);

  return {
    settings,
    updateSettings,
    resetToDefault,
    // Backward-compatible names used by pages
    fetchSettings,
    loading,
    error,
  };
}