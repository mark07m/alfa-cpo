'use client';

import { useState, useCallback } from 'react';
import { SiteSettings } from '@/types/admin';
import { siteSettingsService } from '@/services/admin/siteSettings';
import { toast } from 'react-toastify';

export const useSiteSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await siteSettingsService.getSettings();
      setSettings(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка загрузки настроек');
      setError(error);
      toast.error(`Ошибка загрузки настроек: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: Partial<SiteSettings>) => {
    try {
      const updatedSettings = await siteSettingsService.updateSettings(data);
      setSettings(updatedSettings);
      toast.success('Настройки сайта успешно обновлены!');
      return updatedSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка обновления настроек');
      toast.error(`Ошибка обновления настроек: ${error.message}`);
      throw error;
    }
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      const defaultSettings = await siteSettingsService.resetSettings();
      setSettings(defaultSettings);
      toast.success('Настройки сброшены к значениям по умолчанию!');
      return defaultSettings;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка сброса настроек');
      toast.error(`Ошибка сброса настроек: ${error.message}`);
      throw error;
    }
  }, []);

  return {
    // Data
    settings,
    loading,
    error,
    
    // Actions
    fetchSettings,
    updateSettings,
    resetSettings,
  };
};
