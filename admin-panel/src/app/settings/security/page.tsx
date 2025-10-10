'use client';

import { useState } from 'react';
import { Card } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Checkbox } from '@/components/admin/ui/Checkbox';
import { Select } from '@/components/admin/ui/Select';
import { Table } from '@/components/admin/ui/Table';
import { Badge } from '@/components/admin/ui/Badge';
import { AdminBreadcrumbs } from '@/components/admin/layout/AdminBreadcrumbs';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useSecuritySettings } from '@/hooks/admin/useSecuritySettings';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change';
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: string;
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('password');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const {
    settings,
    updateSettings,
    isLoading,
    error,
    getSecurityEvents,
    getSecurityStats,
  } = useSecuritySettings();

  const handleSave = async (section: string) => {
    try {
      await updateSettings(section, settings);
      // Показать уведомление об успешном сохранении
    } catch (error) {
      console.error('Ошибка сохранения настроек безопасности:', error);
    }
  };

  const loadSecurityEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const events = await getSecurityEvents();
      setSecurityEvents(events);
    } catch (error) {
      console.error('Ошибка загрузки событий безопасности:', error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const tabs = [
    { id: 'password', label: 'Политика паролей' },
    { id: 'sessions', label: 'Настройки сессий' },
    { id: 'ip', label: 'IP-ограничения' },
    { id: 'monitoring', label: 'Мониторинг' },
    { id: 'logs', label: 'Логи безопасности' },
  ];

  const eventColumns = [
    {
      key: 'timestamp',
      label: 'Время',
      render: (event: SecurityEvent) => (
        <div className="text-sm text-gray-900">
          {new Date(event.timestamp).toLocaleString('ru-RU')}
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Тип события',
      render: (event: SecurityEvent) => {
        const typeLabels = {
          login: 'Вход в систему',
          logout: 'Выход из системы',
          failed_login: 'Неудачная попытка входа',
          password_change: 'Изменение пароля',
          permission_change: 'Изменение разрешений',
        };
        
        const typeColors = {
          login: 'success',
          logout: 'default',
          failed_login: 'danger',
          password_change: 'warning',
          permission_change: 'warning',
        } as const;

        return (
          <Badge variant={typeColors[event.type]}>
            {typeLabels[event.type]}
          </Badge>
        );
      },
    },
    {
      key: 'user',
      label: 'Пользователь',
      render: (event: SecurityEvent) => (
        <div className="text-sm text-gray-900">{event.userEmail}</div>
      ),
    },
    {
      key: 'ip',
      label: 'IP-адрес',
      render: (event: SecurityEvent) => (
        <div className="text-sm text-gray-500 font-mono">{event.ipAddress}</div>
      ),
    },
    {
      key: 'details',
      label: 'Детали',
      render: (event: SecurityEvent) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {event.details}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Настройки безопасности">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка настроек безопасности...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Настройки безопасности"
      breadcrumbs={[
        { label: 'Главная', href: '/dashboard' },
        { label: 'Настройки', href: '/settings' },
        { label: 'Безопасность', href: '/settings/security' },
      ]}
    >
      <div className="space-y-6">

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Ошибка загрузки настроек: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {settings?.activeUsers || 0}
            </div>
            <div className="text-sm text-gray-500">Активных пользователей</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {settings?.failedLogins || 0}
            </div>
            <div className="text-sm text-gray-500">Неудачных входов (24ч)</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {settings?.blockedIPs || 0}
            </div>
            <div className="text-sm text-gray-500">Заблокированных IP</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {settings?.securityAlerts || 0}
            </div>
            <div className="text-sm text-gray-500">Активных предупреждений</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Политика паролей */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Политика паролей
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="requireStrongPasswords"
                  checked={settings?.requireStrongPasswords || false}
                  onChange={(checked) => updateSettings('password', { ...settings, requireStrongPasswords: checked })}
                />
                <label htmlFor="requireStrongPasswords" className="text-sm font-medium text-gray-700">
                  Требовать сложные пароли
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Минимальная длина пароля
                  </label>
                  <Input
                    type="number"
                    value={settings?.minPasswordLength || 8}
                    onChange={(e) => updateSettings('password', { ...settings, minPasswordLength: parseInt(e.target.value) })}
                    min="6"
                    max="32"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок действия пароля (дни)
                  </label>
                  <Input
                    type="number"
                    value={settings?.passwordExpiryDays || 90}
                    onChange={(e) => updateSettings('password', { ...settings, passwordExpiryDays: parseInt(e.target.value) })}
                    min="30"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requireUppercase"
                    checked={settings?.requireUppercase || false}
                    onChange={(checked) => updateSettings('password', { ...settings, requireUppercase: checked })}
                  />
                  <label htmlFor="requireUppercase" className="text-sm font-medium text-gray-700">
                    Требовать заглавные буквы
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requireLowercase"
                    checked={settings?.requireLowercase || false}
                    onChange={(checked) => updateSettings('password', { ...settings, requireLowercase: checked })}
                  />
                  <label htmlFor="requireLowercase" className="text-sm font-medium text-gray-700">
                    Требовать строчные буквы
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requireNumbers"
                    checked={settings?.requireNumbers || false}
                    onChange={(checked) => updateSettings('password', { ...settings, requireNumbers: checked })}
                  />
                  <label htmlFor="requireNumbers" className="text-sm font-medium text-gray-700">
                    Требовать цифры
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requireSpecialChars"
                    checked={settings?.requireSpecialChars || false}
                    onChange={(checked) => updateSettings('password', { ...settings, requireSpecialChars: checked })}
                  />
                  <label htmlFor="requireSpecialChars" className="text-sm font-medium text-gray-700">
                    Требовать специальные символы
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('password')}>
                  Сохранить политику паролей
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Настройки сессий */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Настройки сессий
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время жизни сессии (часы)
                </label>
                <Input
                  type="number"
                  value={settings?.sessionTimeoutHours || 8}
                  onChange={(e) => updateSettings('sessions', { ...settings, sessionTimeoutHours: parseInt(e.target.value) })}
                  min="1"
                  max="168"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Максимум активных сессий
                </label>
                <Input
                  type="number"
                  value={settings?.maxActiveSessions || 3}
                  onChange={(e) => updateSettings('sessions', { ...settings, maxActiveSessions: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="requireReauth"
                    checked={settings?.requireReauth || false}
                    onChange={(checked) => updateSettings('sessions', { ...settings, requireReauth: checked })}
                  />
                  <label htmlFor="requireReauth" className="text-sm font-medium text-gray-700">
                    Требовать повторную аутентификацию
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="rememberMe"
                    checked={settings?.allowRememberMe || false}
                    onChange={(checked) => updateSettings('sessions', { ...settings, allowRememberMe: checked })}
                  />
                  <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
                    Разрешить "Запомнить меня"
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('sessions')}>
                  Сохранить
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* IP-ограничения */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          IP-ограничения
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Разрешенные IP-адреса
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={4}
                value={settings?.allowedIPs || ''}
                onChange={(e) => updateSettings('ip', { ...settings, allowedIPs: e.target.value })}
                placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.0/24"
              />
              <p className="text-sm text-gray-500 mt-1">
                Один IP или подсеть на строку. Оставьте пустым для разрешения всех IP.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заблокированные IP-адреса
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                rows={4}
                value={settings?.blockedIPs || ''}
                onChange={(e) => updateSettings('ip', { ...settings, blockedIPs: e.target.value })}
                placeholder="192.168.1.100&#10;10.0.0.50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Один IP на строку. Эти адреса будут заблокированы.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="enableIPRestrictions"
              checked={settings?.enableIPRestrictions || false}
              onChange={(checked) => updateSettings('ip', { ...settings, enableIPRestrictions: checked })}
            />
            <label htmlFor="enableIPRestrictions" className="text-sm font-medium text-gray-700">
              Включить IP-ограничения
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('ip')}>
              Сохранить IP-ограничения
            </Button>
          </div>
        </div>
      </Card>

      {/* Мониторинг безопасности */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Мониторинг безопасности
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимум неудачных попыток входа
              </label>
              <Input
                type="number"
                value={settings?.maxFailedAttempts || 5}
                onChange={(e) => updateSettings('monitoring', { ...settings, maxFailedAttempts: parseInt(e.target.value) })}
                min="3"
                max="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время блокировки (минуты)
              </label>
              <Input
                type="number"
                value={settings?.lockoutDuration || 15}
                onChange={(e) => updateSettings('monitoring', { ...settings, lockoutDuration: parseInt(e.target.value) })}
                min="5"
                max="1440"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="enableSecurityAlerts"
                checked={settings?.enableSecurityAlerts || false}
                onChange={(checked) => updateSettings('monitoring', { ...settings, enableSecurityAlerts: checked })}
              />
              <label htmlFor="enableSecurityAlerts" className="text-sm font-medium text-gray-700">
                Включить уведомления о нарушениях безопасности
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="logAllActions"
                checked={settings?.logAllActions || false}
                onChange={(checked) => updateSettings('monitoring', { ...settings, logAllActions: checked })}
              />
              <label htmlFor="logAllActions" className="text-sm font-medium text-gray-700">
                Логировать все действия пользователей
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSave('monitoring')}>
              Сохранить настройки мониторинга
            </Button>
          </div>
        </div>
      </Card>

      {/* Логи безопасности */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Логи безопасности
          </h3>
          <Button onClick={loadSecurityEvents} disabled={isLoadingEvents}>
            {isLoadingEvents ? 'Загрузка...' : 'Обновить'}
          </Button>
        </div>
        
        <Table
          data={securityEvents}
          columns={eventColumns}
          emptyMessage="События безопасности не найдены"
        />
      </Card>
      </div>
    </AdminLayout>
  );
}
