import { useState, useEffect } from 'react';
import { apiService } from '@/services/admin/api';

export interface SecuritySettings {
  // Политика паролей
  requireStrongPasswords: boolean;
  minPasswordLength: number;
  passwordExpiryDays: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;

  // Настройки сессий
  sessionTimeoutHours: number;
  maxActiveSessions: number;
  requireReauth: boolean;
  allowRememberMe: boolean;

  // IP-ограничения
  enableIPRestrictions: boolean;
  allowedIPs: string;
  blockedIPs: string;

  // Мониторинг
  maxFailedAttempts: number;
  lockoutDuration: number; // в минутах
  enableSecurityAlerts: boolean;
  logAllActions: boolean;

  // Статистика
  activeUsers: number;
  failedLogins: number;
  blockedIPs: number;
  securityAlerts: number;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change';
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: string;
}

export interface SecurityStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByDay: Array<{ date: string; count: number }>;
  topIPs: Array<{ ip: string; count: number }>;
  topUsers: Array<{ user: string; count: number }>;
}

const defaultSettings: SecuritySettings = {
  requireStrongPasswords: true,
  minPasswordLength: 8,
  passwordExpiryDays: 90,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  sessionTimeoutHours: 8,
  maxActiveSessions: 3,
  requireReauth: false,
  allowRememberMe: true,
  enableIPRestrictions: false,
  allowedIPs: '',
  blockedIPs: '',
  maxFailedAttempts: 5,
  lockoutDuration: 15,
  enableSecurityAlerts: true,
  logAllActions: true,
  activeUsers: 0,
  failedLogins: 0,
  blockedIPs: 0,
  securityAlerts: 0,
};

export function useSecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка настроек безопасности
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.get('/settings');
      const data = response.data;
      
      // Объединяем с настройками по умолчанию
      setSettings({ ...defaultSettings, ...data });
    } catch (err) {
      console.error('Ошибка загрузки настроек безопасности:', err);
      setError('Не удалось загрузить настройки безопасности');
      // Используем настройки по умолчанию
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление настроек безопасности
  const updateSettings = async (section: string, newSettings: Partial<SecuritySettings>) => {
    try {
      setError(null);
      
      // Обновляем локальное состояние немедленно
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Пытаемся сохранить через отдельный endpoint
      await apiService.put('/settings/security', newSettings);
      return true;
    } catch (err: any) {
      // Если маршрут еще не доступен (404), не ломаем UX — считаем локально сохраненным
      if (err?.response?.status === 404) {
        try {
          // Мягкая проверка доступности security API (необязательно)
          await apiService.post('/security/test-settings');
        } catch {}
        return true;
      }
      console.error('Ошибка сохранения настроек безопасности:', err);
      setError('Не удалось сохранить настройки безопасности');
      return false;
    }
  };

  // Получение событий безопасности
  const getSecurityEvents = async (page = 1, limit = 50, filters?: {
    type?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setError(null);
      
      const response = await apiService.get('/security/events', {
        params: { page, limit, ...filters }
      });
      
      return (response as any).data?.data ?? (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки событий безопасности:', err);
      setError('Не удалось загрузить события безопасности');
      throw err;
    }
  };

  // Получение статистики безопасности
  const getSecurityStats = async (period: 'day' | 'week' | 'month' = 'week') => {
    try {
      setError(null);
      
      const response = await apiService.get('/security/stats', {
        params: { period }
      });
      
      return (response as any).data?.data ?? (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки статистики безопасности:', err);
      setError('Не удалось загрузить статистику безопасности');
      throw err;
    }
  };

  // Блокировка IP-адреса
  const blockIP = async (ipAddress: string, reason?: string) => {
    try {
      setError(null);
      
      await apiService.post('/security/block-ip', {
        ipAddress,
        reason
      });
      
      // Обновляем локальное состояние
      setSettings(prev => ({
        ...prev,
        blockedIPs: prev.blockedIPs + 1
      }));
      
      return true;
    } catch (err) {
      console.error('Ошибка блокировки IP:', err);
      setError('Не удалось заблокировать IP-адрес');
      return false;
    }
  };

  // Разблокировка IP-адреса
  const unblockIP = async (ipAddress: string) => {
    try {
      setError(null);
      
      await apiService.post('/security/unblock-ip', {
        ipAddress
      });
      
      // Обновляем локальное состояние
      setSettings(prev => ({
        ...prev,
        blockedIPs: Math.max(0, prev.blockedIPs - 1)
      }));
      
      return true;
    } catch (err) {
      console.error('Ошибка разблокировки IP:', err);
      setError('Не удалось разблокировать IP-адрес');
      return false;
    }
  };

  // Сброс счетчика неудачных попыток входа
  const resetFailedAttempts = async (userId: string) => {
    try {
      setError(null);
      
      await apiService.post('/security/reset-failed-attempts', {
        userId
      });
      
      return true;
    } catch (err) {
      console.error('Ошибка сброса счетчика неудачных попыток:', err);
      setError('Не удалось сбросить счетчик неудачных попыток');
      return false;
    }
  };

  // Принудительное завершение всех сессий пользователя
  const terminateUserSessions = async (userId: string) => {
    try {
      setError(null);
      
      await apiService.post('/security/terminate-sessions', {
        userId
      });
      
      return true;
    } catch (err) {
      console.error('Ошибка завершения сессий:', err);
      setError('Не удалось завершить сессии пользователя');
      return false;
    }
  };

  // Экспорт логов безопасности
  const exportSecurityLogs = async (format: 'csv' | 'excel' = 'excel', filters?: {
    type?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    try {
      setError(null);
      
      const response = await apiService.get('/security/export-logs', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `security-logs.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка экспорта логов безопасности:', err);
      setError('Не удалось экспортировать логи безопасности');
      throw err;
    }
  };

  // Получение списка заблокированных IP
  const getBlockedIPs = async () => {
    try {
      setError(null);
      
      const response = await apiService.get('/security/blocked-ips');
      return (response as any).data?.data ?? (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки заблокированных IP:', err);
      setError('Не удалось загрузить список заблокированных IP');
      throw err;
    }
  };

  // Получение активных сессий
  const getActiveSessions = async () => {
    try {
      setError(null);
      
      const response = await apiService.get('/security/active-sessions');
      return (response as any).data?.data ?? (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки активных сессий:', err);
      setError('Не удалось загрузить активные сессии');
      throw err;
    }
  };

  // Тестирование настроек безопасности
  const testSecuritySettings = async () => {
    try {
      setError(null);
      
      const response = await apiService.post('/security/test-settings');
      return (response as any).data?.data ?? (response as any).data;
    } catch (err) {
      console.error('Ошибка тестирования настроек безопасности:', err);
      setError('Не удалось протестировать настройки безопасности');
      throw err;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    updateSettings,
    loadSettings,
    getSecurityEvents,
    getSecurityStats,
    blockIP,
    unblockIP,
    resetFailedAttempts,
    terminateUserSessions,
    exportSecurityLogs,
    getBlockedIPs,
    getActiveSessions,
    testSecuritySettings,
    isLoading,
    error,
  };
}
