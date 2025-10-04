'use client';

import { useState, useCallback } from 'react';
import { MenuItem, MenuFormData } from '@/types/admin';
import { menuService } from '@/services/admin/menu';
import { toast } from 'react-toastify';

export const useMenu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = await menuService.getMenuItems();
      setMenuItems(items);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка загрузки меню');
      setError(error);
      toast.error(`Ошибка загрузки меню: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenuItem = useCallback(async (formData: MenuFormData) => {
    try {
      const newItem = await menuService.createMenuItem(formData);
      await fetchMenuItems(); // Refresh the list
      toast.success('Пункт меню успешно создан!');
      return newItem;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка создания пункта меню');
      toast.error(`Ошибка создания пункта меню: ${error.message}`);
      throw error;
    }
  }, [fetchMenuItems]);

  const updateMenuItem = useCallback(async (id: string, formData: Partial<MenuFormData>) => {
    try {
      const updatedItem = await menuService.updateMenuItem(id, formData);
      await fetchMenuItems(); // Refresh the list
      toast.success('Пункт меню успешно обновлен!');
      return updatedItem;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка обновления пункта меню');
      toast.error(`Ошибка обновления пункта меню: ${error.message}`);
      throw error;
    }
  }, [fetchMenuItems]);

  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      await fetchMenuItems(); // Refresh the list
      toast.success('Пункт меню успешно удален!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка удаления пункта меню');
      toast.error(`Ошибка удаления пункта меню: ${error.message}`);
      throw error;
    }
  }, [fetchMenuItems]);

  const reorderMenuItems = useCallback(async (items: MenuItem[]) => {
    try {
      await menuService.reorderMenuItems(items);
      await fetchMenuItems(); // Refresh the list
      toast.success('Порядок меню обновлен!');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Ошибка изменения порядка меню');
      toast.error(`Ошибка изменения порядка меню: ${error.message}`);
      throw error;
    }
  }, [fetchMenuItems]);

  return {
    // Data
    menuItems,
    loading,
    error,
    
    // Actions
    fetchMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
  };
};
