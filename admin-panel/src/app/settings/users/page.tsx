'use client';

import { useState } from 'react';
import { Card } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Table } from '@/components/admin/ui/Table';
import { Modal } from '@/components/admin/ui/Modal';
import { Badge } from '@/components/admin/ui/Badge';
import { AdminBreadcrumbs } from '@/components/admin/layout/AdminBreadcrumbs';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useUsers } from '@/hooks/admin/useUsers';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    toggleUserStatus,
  } = useUsers();

  // Фильтрация пользователей
  const filteredUsers = (users || []).filter(user => {
    if (!user) return false;
    
    const matchesSearch = 
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await createUser(userData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Ошибка создания пользователя:', error);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.id, userData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Ошибка удаления пользователя:', error);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
    } catch (error) {
      console.error('Ошибка изменения статуса пользователя:', error);
    }
  };

  const columns = [
    {
      key: 'email',
      label: 'Email',
      render: (user: User) => (
        <div className="font-medium text-gray-900">{user?.email || 'Не указан'}</div>
      ),
    },
    {
      key: 'name',
      label: 'Имя',
      render: (user: User) => (
        <div className="text-gray-900">
          {user?.firstName || ''} {user?.lastName || ''}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Роль',
      render: (user: User) => (
        <Badge
          variant={user?.role === 'admin' ? 'success' : user?.role === 'moderator' ? 'warning' : 'default'}
        >
          {user?.role === 'admin' ? 'Администратор' : 
           user?.role === 'moderator' ? 'Модератор' : 
           user?.role === 'editor' ? 'Редактор' : 'Пользователь'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Статус',
      render: (user: User) => (
        <Badge variant={user?.isActive ? 'success' : 'danger'}>
          {user?.isActive ? 'Активен' : 'Неактивен'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Последний вход',
      render: (user: User) => (
        <div className="text-gray-500">
          {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ru-RU') : 'Никогда'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (user: User) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }}
          >
            Редактировать
          </Button>
          <Button
            size="sm"
            variant={user?.isActive ? 'danger' : 'success'}
            onClick={() => handleToggleStatus(user?.id || '')}
          >
            {user?.isActive ? 'Деактивировать' : 'Активировать'}
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setSelectedUser(user);
              setIsDeleteModalOpen(true);
            }}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Управление пользователями">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Загрузка пользователей...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Управление пользователями"
      breadcrumbs={[
        { label: 'Главная', href: '/dashboard' },
        { label: 'Настройки', href: '/settings' },
        { label: 'Пользователи', href: '/settings/users' },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Добавить пользователя
          </Button>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Ошибка загрузки пользователей: {error}</p>
        </div>
      )}

      {/* Фильтры */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поиск
            </label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по email или имени..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Роль
            </label>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Все роли</option>
              <option value="admin">Администратор</option>
              <option value="moderator">Модератор</option>
              <option value="editor">Редактор</option>
              <option value="user">Пользователь</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Таблица пользователей */}
      <Card>
        <Table
          data={filteredUsers}
          columns={columns}
          emptyMessage="Пользователи не найдены"
        />
      </Card>

      {/* Модальное окно создания пользователя */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      {/* Модальное окно редактирования пользователя */}
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Модальное окно удаления пользователя */}
      {selectedUser && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onConfirm={handleDeleteUser}
        />
      )}
      </div>
    </AdminLayout>
  );
}

// Компонент модального окна создания пользователя
function CreateUserModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<User>) => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    onSubmit(formData);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'user',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать пользователя">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Роль *
            </label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">Пользователь</option>
              <option value="editor">Редактор</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя *
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия *
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль *
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Подтверждение пароля *
            </label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">
            Создать пользователя
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Компонент модального окна редактирования пользователя
function EditUserModal({ isOpen, onClose, user, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (userData: Partial<User>) => void;
}) {
  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать пользователя">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Роль *
            </label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">Пользователь</option>
              <option value="editor">Редактор</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя *
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия *
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit">
            Сохранить изменения
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Компонент модального окна удаления пользователя
function DeleteUserModal({ isOpen, onClose, user, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onConfirm: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Удалить пользователя">
      <div className="space-y-4">
        <p className="text-gray-600">
          Вы уверены, что хотите удалить пользователя <strong>{user.email}</strong>?
        </p>
        <p className="text-sm text-red-600">
          Это действие нельзя отменить.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
