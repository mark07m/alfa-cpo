import { useState, useEffect } from 'react';
import { apiService } from '@/services/admin/api';

export interface SiteSettings {
  // Общие настройки
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;

  // Контакты
  organizationName: string;
  ogrn: string;
  inn: string;
  kpp: string;
  legalAddress: string;
  phone: string;
  email: string;
  workingHours: string;
  website: string;

  // SEO настройки
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  googleAnalyticsId: string;
  yandexMetrikaId: string;

  // Тема и дизайн
  primaryColor: string;
  secondaryColor: string;
  primaryFont: string;
  fontSize: string;

  // Социальные сети
  socialVk: string;
  socialTelegram: string;
  socialYoutube: string;
  socialOdnoklassniki: string;
}

const defaultSettings: SiteSettings = {
  siteName: 'СРО арбитражных управляющих',
  siteDescription: 'Саморегулируемая организация арбитражных управляющих',
  logo: '',
  favicon: '',
  maintenanceMode: false,
  allowRegistration: false,
  organizationName: '',
  ogrn: '',
  inn: '',
  kpp: '',
  legalAddress: '',
  phone: '',
  email: '',
  workingHours: '',
  website: '',
  seoTitle: 'СРО арбитражных управляющих',
  seoDescription: 'Официальный сайт саморегулируемой организации арбитражных управляющих',
  seoKeywords: 'СРО, арбитражные управляющие, банкротство, несостоятельность',
  ogTitle: 'СРО арбитражных управляющих',
  ogDescription: 'Официальный сайт саморегулируемой организации арбитражных управляющих',
  ogImage: '',
  googleAnalyticsId: '',
  yandexMetrikaId: '',
  primaryColor: '#D4C4A8',
  secondaryColor: '#8B7355',
  primaryFont: 'Inter',
  fontSize: '16px',
  socialVk: '',
  socialTelegram: '',
  socialYoutube: '',
  socialOdnoklassniki: '',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка настроек
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.get('/settings/site');
      const data = response.data;
      
      // Объединяем с настройками по умолчанию
      setSettings({ ...defaultSettings, ...(data || {}) });
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err);
      setError('Не удалось загрузить настройки');
      // Используем настройки по умолчанию
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление настроек
  const updateSettings = async (section: string, newSettings: Partial<SiteSettings>) => {
    try {
      setError(null);
      
      // Обновляем локальное состояние
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Отправляем на сервер
      await apiService.put('/settings/site', {
        section,
        settings: newSettings
      });
      
      return true;
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      setError('Не удалось сохранить настройки');
      return false;
    }
  };

  // Сброс к настройкам по умолчанию
  const resetToDefault = async () => {
    try {
      setError(null);
      
      await apiService.post('/settings/site/reset');
      setSettings(defaultSettings);
      
      return true;
    } catch (err) {
      console.error('Ошибка сброса настроек:', err);
      setError('Не удалось сбросить настройки');
      return false;
    }
  };

  // Предварительный просмотр настроек
  const previewSettings = (previewSettings: Partial<SiteSettings>) => {
    // Применяем настройки для предварительного просмотра
    setSettings(prev => ({ ...prev, ...previewSettings }));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    updateSettings,
    resetToDefault,
    previewSettings,
    loadSettings,
    isLoading,
    error,
  };
}