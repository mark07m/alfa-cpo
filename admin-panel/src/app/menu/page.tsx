'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Table } from '@/components/admin/ui/Table';
import { Modal } from '@/components/admin/ui/Modal';
import { Card, CardContent } from '@/components/admin/ui/Card';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  LinkIcon, 
  ArrowsUpDownIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useMenu } from '@/hooks/admin/useMenu';
import { MenuItem } from '@/types/admin';
import MenuForm from '@/components/admin/menu/MenuForm';

export default function AdminMenuPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { menuItems, loading, error, updateMenuItem, deleteMenuItem, fetchMenuItems } = useMenu();

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleCreateMenuItem = () => {
    setEditingMenuItem(null);
    setIsFormModalOpen(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setIsFormModalOpen(true);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пункт меню?')) {
      await deleteMenuItem(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedItems.length} пунктов меню?`)) {
      try {
        await Promise.all(selectedItems.map(id => deleteMenuItem(id)));
        setSelectedItems([]);
      } catch (error) {
        console.error('Error bulk deleting menu items:', error);
      }
    }
  };

  const handleSelectItem = (id: string, isSelected: boolean) => {
    setSelectedItems(prev => 
      isSelected 
        ? [...prev, id]
        : prev.filter(itemId => itemId !== id)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedItems(isSelected ? menuItems.map(item => item.id) : []);
  };

  const columns = [
    {
      key: 'select' as const,
      title: 'Выбор',
      render: (value: unknown, item: MenuItem) => (
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-beige-600 focus:ring-beige-500"
        />
      ),
      width: 'w-12',
    },
    {
      key: 'title' as const,
      title: 'Название',
      sortable: true,
      render: (title: string, item: MenuItem) => (
        <div className="flex items-center">
          {item.parentId && <span className="ml-4 mr-2 text-neutral-400">—</span>}
          <span className="font-medium">{title}</span>
        </div>
      ),
    },
    {
      key: 'url' as const,
      title: 'URL',
      sortable: true,
      render: (url: string, item: MenuItem) => (
        <a 
          href={url} 
          target={item.isExternal ? "_blank" : "_self"} 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline flex items-center"
        >
          {url} 
          {item.isExternal && <LinkIcon className="h-4 w-4 inline-block ml-1" />}
        </a>
      ),
    },
    {
      key: 'order' as const,
      title: 'Порядок',
      sortable: true,
      render: (order: number) => (
        <span className="text-sm text-neutral-600">{order}</span>
      ),
    },
    {
      key: 'isVisible' as const,
      title: 'Видимость',
      render: (isVisible: boolean) => (
        <div className="flex items-center">
          {isVisible ? (
            <EyeIcon className="h-4 w-4 text-green-600" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 text-red-600" />
          )}
          <span className="ml-2 text-sm">{isVisible ? 'Да' : 'Нет'}</span>
        </div>
      ),
    },
    {
      key: 'actions' as const,
      title: 'Действия',
      render: (value: unknown, item: MenuItem) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditMenuItem(item)}
            title="Редактировать"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteMenuItem(item.id)}
            title="Удалить"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
      width: 'w-32',
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-10 text-red-500">
          <p>Ошибка загрузки меню: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Управление меню</h1>
            <p className="text-neutral-600 mt-1">Настройка структуры навигационного меню сайта</p>
          </div>
          <Button onClick={handleCreateMenuItem}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Добавить пункт меню
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                Выбрано {selectedItems.length} пунктов меню
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Отменить выбор
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Удалить выбранные
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Button variant="outline" className="mr-2">
          <ArrowsUpDownIcon className="h-5 w-5 mr-2" />
          Сохранить порядок
        </Button>
        <span className="text-sm text-neutral-500">
          (Перетащите для изменения порядка)
        </span>
      </div>

      <Table
        data={menuItems}
        columns={columns}
        loading={loading}
        emptyMessage="Нет пунктов меню для отображения. Создайте первый пункт."
      />

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingMenuItem ? 'Редактировать пункт меню' : 'Создать пункт меню'}
        size="md"
      >
        <MenuForm
          menuItem={editingMenuItem}
          onSuccess={() => {
            setIsFormModalOpen(false);
            fetchMenuItems();
          }}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>
    </div>
  );
}