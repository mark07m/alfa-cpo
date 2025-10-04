import { SiteSettings } from '@/types/admin';

// Mock data for development
const mockSettings: SiteSettings = {
  id: '1',
  siteName: 'СРО Арбитражных Управляющих',
  siteDescription: 'Официальный сайт СРО Арбитражных Управляющих',
  contactEmail: 'info@sro-arbitrazh.ru',
  contactPhone: '+7 (495) 123-45-67',
  address: 'г. Москва, ул. Примерная, д. 1',
  logoUrl: null,
  faviconUrl: null,
  seoTitle: 'СРО Арбитражных Управляющих - Официальный сайт',
  seoDescription: 'Официальный сайт СРО Арбитражных Управляющих. Информация о деятельности, документах, новостях.',
  seoKeywords: 'СРО, арбитражные управляющие, банкротство, официальный сайт',
  theme: {
    primaryColor: '#D4B89A',
    secondaryColor: '#F5F5DC',
    accentColor: '#8B4513'
  },
  socialMedia: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  },
  footerText: '© 2024 СРО Арбитражных Управляющих. Все права защищены.',
  copyrightText: '© 2024 СРО Арбитражных Управляющих',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

export const siteSettingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { ...mockSettings };
  },

  updateSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedSettings = {
      ...mockSettings,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Update the mock data
    Object.assign(mockSettings, updatedSettings);
    
    return updatedSettings;
  },

  resetSettings: async (): Promise<SiteSettings> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const defaultSettings: SiteSettings = {
      id: '1',
      siteName: 'СРО Арбитражных Управляющих',
      siteDescription: 'Официальный сайт СРО Арбитражных Управляющих',
      contactEmail: 'info@sro-arbitrazh.ru',
      contactPhone: '+7 (495) 123-45-67',
      address: 'г. Москва, ул. Примерная, д. 1',
      logoUrl: null,
      faviconUrl: null,
      seoTitle: 'СРО Арбитражных Управляющих - Официальный сайт',
      seoDescription: 'Официальный сайт СРО Арбитражных Управляющих. Информация о деятельности, документах, новостях.',
      seoKeywords: 'СРО, арбитражные управляющие, банкротство, официальный сайт',
      theme: {
        primaryColor: '#D4B89A',
        secondaryColor: '#F5F5DC',
        accentColor: '#8B4513'
      },
      socialMedia: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      },
      footerText: '© 2024 СРО Арбитражных Управляющих. Все права защищены.',
      copyrightText: '© 2024 СРО Арбитражных Управляющих',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    };
    
    // Update the mock data
    Object.assign(mockSettings, defaultSettings);
    
    return defaultSettings;
  }
};
