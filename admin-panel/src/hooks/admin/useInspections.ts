import { useState, useEffect } from 'react';
import { inspectionsService, UiInspection, UiCreateInspectionData } from '@/services/admin/inspections';

type Inspection = UiInspection;

type CreateInspectionData = UiCreateInspectionData;

interface UpdateInspectionData extends Partial<CreateInspectionData> {
  id: string;
}

export function useInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Удалены моковые данные; работаем с реальным API

  const fetchInspections = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await inspectionsService.list({ limit: 100 });
      setInspections(data);
    } catch (err) {
      setError('Ошибка загрузки проверок');
      console.error('Error fetching inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInspection = async (data: CreateInspectionData): Promise<Inspection> => {
    try {
      const created = await inspectionsService.create(data);
      setInspections(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating inspection:', err);
      throw new Error('Ошибка создания проверки');
    }
  };

  const updateInspection = async (id: string, data: Partial<CreateInspectionData>): Promise<Inspection> => {
    try {
      const updated = await inspectionsService.update(id, data);
      setInspections(prev => prev.map(inspection => inspection.id === id ? updated : inspection));
      return updated;
    } catch (err) {
      console.error('Error updating inspection:', err);
      throw new Error('Ошибка обновления проверки');
    }
  };

  const deleteInspection = async (id: string): Promise<void> => {
    try {
      await inspectionsService.remove(id);
      setInspections(prev => prev.filter(inspection => inspection.id !== id));
    } catch (err) {
      console.error('Error deleting inspection:', err);
      throw new Error('Ошибка удаления проверки');
    }
  };

  const deleteInspections = async (ids: string[]): Promise<void> => {
    try {
      await inspectionsService.removeMany(ids);
      setInspections(prev => prev.filter(inspection => !ids.includes(inspection.id)));
    } catch (err) {
      console.error('Error deleting inspections:', err);
      throw new Error('Ошибка массового удаления проверок');
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  return {
    inspections,
    loading,
    error,
    createInspection,
    updateInspection,
    deleteInspection,
    deleteInspections,
    refetch: fetchInspections
  };
}
