import { useState, useEffect } from 'react';
import { apiService } from '@/services/admin/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator' | 'editor' | 'user';
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
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
      setUsers(response.data);
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
      
      const response = await apiService.post('/users', userData);
      const newUser = response.data;
      
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
      
      const response = await apiService.put(`/users/${userId}`, userData);
      const updatedUser = response.data;
      
      setUsers(prev => 
        prev.map(user => user.id === userId ? updatedUser : user)
      );
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

  // Изменение пароля пользователя
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
      
      const response = await apiService.put(`/users/${userId}/toggle-status`);
      const updatedUser = response.data;
      
      setUsers(prev => 
        prev.map(user => user.id === userId ? updatedUser : user)
      );
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
      return response.data;
    } catch (err) {
      console.error('Ошибка загрузки пользователя:', err);
      setError('Не удалось загрузить пользователя');
      throw err;
    }
  };

  // Получение статистики пользователей
  const getUsersStats = async () => {
    try {
      setError(null);
      
      const response = await apiService.get('/users/stats');
      return response.data;
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
      
      const response = await apiService.get(`/users/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Перезагружаем список пользователей
      await loadUsers();
      
      return response.data;
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
      
      const response = await apiService.get(`/users/${userId}/logs`, {
        params: { page, limit }
      });
      return response.data;
    } catch (err) {
      console.error('Ошибка загрузки логов пользователя:', err);
      setError('Не удалось загрузить логи пользователя');
      throw err;
    }
  };

  useEffect(() => {
    loadUsers();
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
