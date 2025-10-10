import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AccreditedOrganization, 
  AccreditedOrganizationFilters, 
  AccreditedOrganizationStats,
  AccreditedOrganizationFormData,
  PaginationParams 
} from '@/types/admin';
import { accreditedOrganizationsService, mockAccreditedOrganizations, mockAccreditedOrganizationStats } from '@/services/admin/accreditedOrganizations';

export function useAccreditedOrganizations() {
  const [organizations, setOrganizations] = useState<AccreditedOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  const fetchOrganizations = useCallback(async (
    filters: AccreditedOrganizationFilters = {},
    paginationParams: PaginationParams = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredOrganizations = [...mockAccreditedOrganizations];
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredOrganizations = filteredOrganizations.filter(org => 
            org.name.toLowerCase().includes(searchLower) ||
            org.shortName?.toLowerCase().includes(searchLower) ||
            org.inn.includes(searchLower) ||
            org.ogrn.includes(searchLower) ||
            org.accreditationNumber.toLowerCase().includes(searchLower)
          );
        }
        
        if (filters.status) {
          filteredOrganizations = filteredOrganizations.filter(org => org.status === filters.status);
        }
        
        if (filters.accreditationType) {
          filteredOrganizations = filteredOrganizations.filter(org => org.accreditationType === filters.accreditationType);
        }
        
        if (filters.dateFrom) {
          filteredOrganizations = filteredOrganizations.filter(org => 
            new Date(org.accreditationDate) >= new Date(filters.dateFrom!)
          );
        }
        
        if (filters.dateTo) {
          filteredOrganizations = filteredOrganizations.filter(org => 
            new Date(org.accreditationDate) <= new Date(filters.dateTo!)
          );
        }
        
        const page = paginationParams.page || 1;
        const limit = paginationParams.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex);
        
        setOrganizations(paginatedOrganizations);
        setPagination({
          page,
          limit,
          total: filteredOrganizations.length,
          pages: Math.ceil(filteredOrganizations.length / limit)
        });
      } else {
        const response = await accreditedOrganizationsService.getOrganizations(filters, paginationParams);
        setOrganizations(response.data);
        setPagination(response.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      console.error('Ошибка загрузки аккредитованных организаций:', err);
    } finally {
      setLoading(false);
    }
  }, [useMock]);

  const createOrganization = useCallback(async (data: AccreditedOrganizationFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newOrganization: AccreditedOrganization = {
          id: Date.now().toString(),
          ...data,
          documents: [],
          createdBy: 'admin',
          updatedBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setOrganizations(prev => [newOrganization, ...prev]);
        return newOrganization;
      } else {
        const created = await accreditedOrganizationsService.createOrganization(data);
        setOrganizations(prev => [created, ...prev]);
        return created;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания организации');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [useMock]);

  const updateOrganization = useCallback(async (id: string, data: Partial<AccreditedOrganizationFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOrganizations(prev => prev.map(org => 
          org.id === id 
            ? { ...org, ...data, updatedAt: new Date().toISOString() }
            : org
        ));
        
        return organizations.find(org => org.id === id)!;
      } else {
        const updated = await accreditedOrganizationsService.updateOrganization(id, data);
        setOrganizations(prev => prev.map(org => 
          org.id === id ? updated : org
        ));
        return updated;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления организации');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [organizations, useMock]);

  const deleteOrganization = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setOrganizations(prev => prev.filter(org => org.id !== id));
      } else {
        await accreditedOrganizationsService.deleteOrganization(id);
        setOrganizations(prev => prev.filter(org => org.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления организации');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [useMock]);

  const deleteOrganizations = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrganizations(prev => prev.filter(org => !ids.includes(org.id)));
      } else {
        await accreditedOrganizationsService.deleteOrganizations(ids);
        setOrganizations(prev => prev.filter(org => !ids.includes(org.id)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления организаций');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [useMock]);

  return {
    organizations,
    loading,
    error,
    pagination,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    deleteOrganizations
  };
}

export function useAccreditedOrganizationStats() {
  const [stats, setStats] = useState<AccreditedOrganizationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats(mockAccreditedOrganizationStats);
      } else {
        const statsData = await accreditedOrganizationsService.getStats();
        setStats(statsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки статистики');
      console.error('Ошибка загрузки статистики аккредитованных организаций:', err);
    } finally {
      setLoading(false);
    }
  }, [useMock]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useAccreditedOrganization(id: string) {
  const [organization, setOrganization] = useState<AccreditedOrganization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  const fetchOrganization = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundOrganization = mockAccreditedOrganizations.find(org => org.id === id);
        if (foundOrganization) {
          setOrganization(foundOrganization);
        } else {
          setError('Организация не найдена');
        }
      } else {
        const organizationData = await accreditedOrganizationsService.getOrganization(id);
        setOrganization(organizationData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки организации');
      console.error('Ошибка загрузки аккредитованной организации:', err);
    } finally {
      setLoading(false);
    }
  }, [id, useMock]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return { organization, loading, error, refetch: fetchOrganization };
}
