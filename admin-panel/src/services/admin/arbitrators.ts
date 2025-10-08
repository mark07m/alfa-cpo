import { apiService } from './api';
import { Arbitrator, ArbitratorFilters, ArbitratorStats } from '@/types/admin';

export interface ArbitratorsResponse {
  data: Arbitrator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ArbitratorFormData {
  id?: string;
  fullName: string;
  inn: string;
  registryNumber: string;
  snils?: string;
  stateRegistryNumber?: string;
  stateRegistryDate?: string;
  phone: string;
  email: string;
  region?: string;
  city?: string;
  status?: 'active' | 'excluded' | 'suspended';
  joinDate: string;
  excludeDate?: string;
  excludeReason?: string;
  birthDate?: string;
  birthPlace?: string;
  registrationDate?: string;
  decisionNumber?: string;
  education?: string;
  workExperience?: string;
  internship?: string;
  examCertificate?: string;
  disqualification?: string;
  criminalRecord?: string;
  criminalRecordDate?: string;
  criminalRecordNumber?: string;
  criminalRecordName?: string;
  insurance?: {
    startDate?: string;
    endDate?: string;
    amount?: number;
    contractNumber?: string;
    contractDate?: string;
    insuranceCompany?: string;
  };
  compensationFundContributions?: {
    purpose: string;
    date: string;
    amount: number;
  }[];
  compensationFundContribution?: number;
  inspections?: {
    type: string;
    startDate: string;
    endDate: string;
    result: string;
  }[];
  lastInspection?: string;
  disciplinaryMeasures?: {
    startDate: string;
    endDate: string;
    decisionNumber: string;
    penalty: string;
  }[];
  otherSroParticipation?: {
    sroName: string;
    joinDate: string;
    leaveDate?: string;
    status: string;
  }[];
  complianceStatus?: string;
  complianceDate?: string;
  complianceNumber?: string;
  postalAddress?: string;
  penalties?: string;
  documents?: string[];
}

export const arbitratorsService = {
  // Получить список арбитражных управляющих
  async getArbitrators(filters: ArbitratorFilters = {}): Promise<ArbitratorsResponse> {
    try {
      const params = new URLSearchParams();
      
      // Поддерживаемые фильтры в backend
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.region) params.append('region', filters.region);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      console.log('Making API request to:', `/registry?${params.toString()}`);
      const response = await apiService.get(`/registry?${params.toString()}`);
      console.log('API service response:', response);
      
      // Преобразуем ответ в ожидаемый формат
      return {
        data: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        }
      };
    } catch (error: any) {
      console.error('Error fetching arbitrators:', error);
      
      if (error.message === 'MOCK_MODE') {
        console.info('Mock mode, returning empty data');
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
          }
        };
      }
      
      // Если API недоступен, возвращаем моковые данные
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 401 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        console.info('API unavailable, returning mock arbitrators data');
        return {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
          }
        };
      }
      throw error;
    }
  },

  // Получить арбитражного управляющего по ID
  async getArbitrator(id: string): Promise<Arbitrator> {
    try {
      const response = await apiService.get(`/registry/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching arbitrator:', error);
      throw error;
    }
  },

  // Создать арбитражного управляющего
  async createArbitrator(data: ArbitratorFormData): Promise<Arbitrator> {
    try {
      const response = await apiService.post('/registry', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating arbitrator:', error);
      throw error;
    }
  },

  // Обновить арбитражного управляющего
  async updateArbitrator(id: string, data: Partial<ArbitratorFormData>): Promise<Arbitrator> {
    try {
      const response = await apiService.patch(`/registry/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating arbitrator:', error);
      throw error;
    }
  },

  // Удалить арбитражного управляющего
  async deleteArbitrator(id: string): Promise<void> {
    try {
      await apiService.delete(`/registry/${id}`);
    } catch (error: any) {
      console.error('Error deleting arbitrator:', error);
      throw error;
    }
  },

  // Получить статистику по реестру
  async getArbitratorStats(): Promise<ArbitratorStats> {
    try {
      const response = await apiService.get('/registry/statistics');
      console.log('API response for stats:', response);
      console.log('Response data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching arbitrator stats:', error);
      
      if (error.message === 'MOCK_MODE') {
        console.info('Mock mode, returning mock arbitrator stats');
        const mockStats = {
          total: 1250,
          active: 1180,
          excluded: 45,
          suspended: 25,
          byRegion: [
            { region: 'Москва', count: 320 },
            { region: 'Санкт-Петербург', count: 180 },
            { region: 'Московская область', count: 95 },
            { region: 'Краснодарский край', count: 78 },
            { region: 'Свердловская область', count: 65 },
            { region: 'Новосибирская область', count: 58 },
            { region: 'Ростовская область', count: 52 },
            { region: 'Нижегородская область', count: 48 },
            { region: 'Самарская область', count: 42 },
            { region: 'Волгоградская область', count: 38 }
          ],
          byStatus: [
            { status: 'active', count: 1180 },
            { status: 'excluded', count: 45 },
            { status: 'suspended', count: 25 }
          ],
          recentAdditions: 12,
          recentExclusions: 3
        };
        console.log('Returning mock stats:', mockStats);
        return mockStats;
      }
      
      // Если API недоступен, возвращаем моковые данные
      if (error.code === 'NETWORK_ERROR' || 
          error.message === 'Network Error' || 
          error.code === 'ECONNREFUSED' ||
          error.code === 'ERR_NETWORK' ||
          error.code === 'EADDRINUSE' ||
          error.response?.status === 400 ||
          error.response?.status === 401 ||
          error.response?.status === 404 ||
          error.response?.status === 503 ||
          !error.response) {
        console.info('API unavailable, returning mock arbitrator stats');
        const mockStats = {
          total: 1250,
          active: 1180,
          excluded: 45,
          suspended: 25,
          byRegion: [
            { region: 'Москва', count: 320 },
            { region: 'Санкт-Петербург', count: 180 },
            { region: 'Московская область', count: 95 },
            { region: 'Краснодарский край', count: 78 },
            { region: 'Свердловская область', count: 65 },
            { region: 'Новосибирская область', count: 58 },
            { region: 'Ростовская область', count: 52 },
            { region: 'Нижегородская область', count: 48 },
            { region: 'Самарская область', count: 42 },
            { region: 'Волгоградская область', count: 38 }
          ],
          byStatus: [
            { status: 'active', count: 1180 },
            { status: 'excluded', count: 45 },
            { status: 'suspended', count: 25 }
          ],
          recentAdditions: 12,
          recentExclusions: 3
        };
        console.log('Returning mock stats:', mockStats);
        return mockStats;
      }
      throw error;
    }
  },

  // Импорт из Excel/CSV
  async importArbitrators(file: File): Promise<{ success: number; errors: string[] }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.post('/registry/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error importing arbitrators:', error);
      throw error;
    }
  },

  // Экспорт в Excel
  async exportArbitrators(filters: ArbitratorFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      // Поддерживаемые фильтры в backend
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.region) params.append('region', filters.region);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiService.get(`/registry/export/excel?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Error exporting arbitrators:', error);
      throw error;
    }
  },

  // Экспорт в CSV
  async exportArbitratorsCsv(filters: ArbitratorFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      // Поддерживаемые фильтры в backend
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.region) params.append('region', filters.region);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiService.get(`/registry/export/csv?${params.toString()}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error: any) {
      console.error('Error exporting arbitrators to CSV:', error);
      throw error;
    }
  },

  // Поиск по ИНН
  async findByInn(inn: string): Promise<Arbitrator | null> {
    try {
      const response = await apiService.get(`/registry/inn/${inn}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error finding arbitrator by INN:', error);
      throw error;
    }
  },

  // Поиск по номеру реестра
  async findByRegistryNumber(registryNumber: string): Promise<Arbitrator | null> {
    try {
      const response = await apiService.get(`/registry/number/${registryNumber}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error finding arbitrator by registry number:', error);
      throw error;
    }
  },

  // Проверка уникальности ИНН (используем поиск по ИНН)
  async checkInnUnique(inn: string, excludeId?: string): Promise<boolean> {
    try {
      const arbitrator = await this.findByInn(inn);
      if (!arbitrator) return true;
      return excludeId ? arbitrator.id === excludeId : false;
    } catch (error: any) {
      console.error('Error checking INN uniqueness:', error);
      return false;
    }
  },

  // Проверка уникальности номера в реестре (используем поиск по номеру)
  async checkRegistryNumberUnique(registryNumber: string, excludeId?: string): Promise<boolean> {
    try {
      const arbitrator = await this.findByRegistryNumber(registryNumber);
      if (!arbitrator) return true;
      return excludeId ? arbitrator.id === excludeId : false;
    } catch (error: any) {
      console.error('Error checking registry number uniqueness:', error);
      return false;
    }
  },
};
