import { useState, useEffect } from 'react';
import { apiService } from '@/services/admin/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator' | 'editor' | 'user' | string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function toUiRole(backendRole?: string): 'admin' | 'moderator' | 'editor' | 'user' {
  switch ((backendRole || '').toUpperCase()) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return 'admin'
    case 'MODERATOR':
      return 'moderator'
    case 'EDITOR':
      return 'editor'
    default:
      return 'user'
  }
}

function toBackendRole(uiRole?: string): 'ADMIN' | 'MODERATOR' | 'EDITOR' | undefined {
  switch ((uiRole || '').toLowerCase()) {
    case 'admin':
      return 'ADMIN'
    case 'moderator':
      return 'MODERATOR'
    case 'editor':
      return 'EDITOR'
    default:
      return undefined
  }
}

function mapUser(raw: any): User {
  const fullName: string = raw.name || '';
  const [first, ...rest] = fullName.split(' ').filter(Boolean);
  return {
    id: raw.id || raw._id || '',
    email: raw.email || '',
    firstName: raw.firstName || first || '',
    lastName: raw.lastName || rest.join(' ') || '',
    role: toUiRole(raw.role),
    isActive: Boolean(raw.isActive),
    lastLoginAt: raw.lastLoginAt || null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка пользователей
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.get('/users');
      const raw = (response as any)?.data || [];
      const mapped = Array.isArray(raw) ? raw.map(mapUser) : [];
      setUsers(mapped);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setError('Не удалось загрузить список пользователей');
    } finally {
      setIsLoading(false);
    }
  };

  // Создание пользователя
  const createUser = async (userData: CreateUserData) => {
    try {
      setError(null);
      const payload = {
        email: userData.email,
        password: (userData as any).password,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        role: toBackendRole(userData.role),
      };
      const response = await apiService.post('/users', payload);
      const newUser = mapUser((response as any).data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      console.error('Ошибка создания пользователя:', err);
      setError('Не удалось создать пользователя');
      throw err;
    }
  };

  // Обновление пользователя
  const updateUser = async (userId: string, userData: UpdateUserData) => {
    try {
      setError(null);
      const payload: any = { ...userData };
      if (userData.firstName || userData.lastName) {
        const current = users.find(u => u.id === userId);
        const first = userData.firstName ?? current?.firstName ?? '';
        const last = userData.lastName ?? current?.lastName ?? '';
        payload.name = `${first} ${last}`.trim();
        delete payload.firstName;
        delete payload.lastName;
      }
      if (userData.role) {
        payload.role = toBackendRole(userData.role);
      }
      const response = await apiService.patch(`/users/${userId}`, payload);
      const updatedUser = mapUser((response as any).data);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      console.error('Ошибка обновления пользователя:', err);
      setError('Не удалось обновить пользователя');
      throw err;
    }
  };

  // Удаление пользователя
  const deleteUser = async (userId: string) => {
    try {
      setError(null);
      await apiService.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err);
      setError('Не удалось удалить пользователя');
      throw err;
    }
  };

  // Изменение пароля пользователя (если backend поддержит)
  const changePassword = async (userId: string, passwordData: ChangePasswordData) => {
    try {
      setError(null);
      await apiService.put(`/users/${userId}/password`, passwordData);
    } catch (err) {
      console.error('Ошибка изменения пароля:', err);
      setError('Не удалось изменить пароль');
      throw err;
    }
  };

  // Переключение статуса пользователя
  const toggleUserStatus = async (userId: string) => {
    try {
      setError(null);
      if (!userId) throw new Error('ID пользователя не указан');
      const current = users.find(u => u.id === userId);
      const nextStatus = current ? !current.isActive : true;
      const response = await apiService.patch(`/users/${userId}`, { isActive: nextStatus });
      const updatedUser = mapUser((response as any).data);
      setUsers(prev => prev.map(user => user.id === userId ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      console.error('Ошибка изменения статуса пользователя:', err);
      setError('Не удалось изменить статус пользователя');
      throw err;
    }
  };

  // Получение пользователя по ID
  const getUserById = async (userId: string) => {
    try {
      setError(null);
      const response = await apiService.get(`/users/${userId}`);
      return mapUser((response as any).data);
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err);
      setError('Не удалось загрузить пользователя');
      throw err;
    }
  };

  // Получение статистики пользователей (если реализовано)
  const getUsersStats = async () => {
    try {
      setError(null);
      const response = await apiService.get('/users/stats');
      return (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки статистики пользователей:', err);
      setError('Не удалось загрузить статистику пользователей');
      throw err;
    }
  };

  // Экспорт пользователей
  const exportUsers = async (format: 'csv' | 'excel' = 'excel') => {
    try {
      setError(null);
      const response = await apiService.get(`/users/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([((response as any).data)]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка экспорта пользователей:', err);
      setError('Не удалось экспортировать пользователей');
      throw err;
    }
  };

  // Импорт пользователей
  const importUsers = async (file: File) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiService.post('/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadUsers();
      return (response as any).data;
    } catch (err) {
      console.error('Ошибка импорта пользователей:', err);
      setError('Не удалось импортировать пользователей');
      throw err;
    }
  };

  // Получение логов действий пользователя
  const getUserLogs = async (userId: string, page = 1, limit = 20) => {
    try {
      setError(null);
      const response = await apiService.get(`/users/${userId}/logs`, { params: { page, limit } });
      return (response as any).data;
    } catch (err) {
      console.error('Ошибка загрузки логов пользователя:', err);
      setError('Не удалось загрузить логи пользователя');
      throw err;
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    isLoading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    toggleUserStatus,
    getUserById,
    getUsersStats,
    exportUsers,
    importUsers,
    getUserLogs,
  };
}
