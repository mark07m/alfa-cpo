import { apiService } from './api';
import { 
  AccreditedOrganization, 
  AccreditedOrganizationFilters, 
  AccreditedOrganizationStats,
  AccreditedOrganizationFormData,
  ApiResponse,
  PaginationParams 
} from '@/types/admin';

export const accreditedOrganizationsService = {
  // Получить список аккредитованных организаций
  async getOrganizations(
    filters: AccreditedOrganizationFilters = {},
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<AccreditedOrganization[]>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.accreditationType) params.append('accreditationType', filters.accreditationType);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.region) params.append('region', filters.region);
    
    if (pagination.page) params.append('page', pagination.page.toString());
    if (pagination.limit) params.append('limit', pagination.limit.toString());
    if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
    if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);

    return apiService.get(`/accredited-organizations?${params.toString()}`);
  },

  // Получить аккредитованную организацию по ID
  async getOrganization(id: string): Promise<AccreditedOrganization> {
    const response = await apiService.get<AccreditedOrganization>(`/accredited-organizations/${id}`);
    return response.data;
  },

  // Создать аккредитованную организацию
  async createOrganization(data: AccreditedOrganizationFormData): Promise<AccreditedOrganization> {
    const response = await apiService.post<AccreditedOrganization>('/accredited-organizations', data);
    return response.data;
  },

  // Обновить аккредитованную организацию
  async updateOrganization(id: string, data: Partial<AccreditedOrganizationFormData>): Promise<AccreditedOrganization> {
    const response = await apiService.put<AccreditedOrganization>(`/accredited-organizations/${id}`, data);
    return response.data;
  },

  // Удалить аккредитованную организацию
  async deleteOrganization(id: string): Promise<void> {
    await apiService.delete(`/accredited-organizations/${id}`);
  },

  // Массовое удаление аккредитованных организаций
  async deleteOrganizations(ids: string[]): Promise<void> {
    await apiService.post('/accredited-organizations/bulk-delete', { ids });
  },

  // Получить статистику
  async getStats(): Promise<AccreditedOrganizationStats> {
    const response = await apiService.get<AccreditedOrganizationStats>('/accredited-organizations/stats');
    return response.data;
  },

  // Проверить уникальность ИНН
  async checkInnUnique(inn: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('inn', inn);
    if (excludeId) params.append('excludeId', excludeId);
    
    const response = await apiService.get<{ unique: boolean }>(`/accredited-organizations/check-inn?${params.toString()}`);
    return response.data.unique;
  },

  // Проверить уникальность ОГРН
  async checkOgrnUnique(ogrn: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('ogrn', ogrn);
    if (excludeId) params.append('excludeId', excludeId);
    
    const response = await apiService.get<{ unique: boolean }>(`/accredited-organizations/check-ogrn?${params.toString()}`);
    return response.data.unique;
  },

  // Проверить уникальность номера аккредитации
  async checkAccreditationNumberUnique(accreditationNumber: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('accreditationNumber', accreditationNumber);
    if (excludeId) params.append('excludeId', excludeId);
    
    const response = await apiService.get<{ unique: boolean }>(`/accredited-organizations/check-accreditation-number?${params.toString()}`);
    return response.data.unique;
  },

  // Экспорт в Excel
  async exportToExcel(filters: AccreditedOrganizationFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.accreditationType) params.append('accreditationType', filters.accreditationType);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.region) params.append('region', filters.region);

    const response = await apiService.get(`/accredited-organizations/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response.data;
  },

  // Получить организации, у которых скоро истекает аккредитация
  async getExpiringSoon(days: number = 30): Promise<AccreditedOrganization[]> {
    const response = await apiService.get<AccreditedOrganization[]>(`/accredited-organizations/expiring-soon?days=${days}`);
    return response.data;
  }
};

// Моковые данные для разработки
export const mockAccreditedOrganizations: AccreditedOrganization[] = [
  {
    id: '1',
    name: 'ООО "Центр профессионального обучения"',
    shortName: 'ЦПО',
    inn: '1234567890',
    kpp: '123456789',
    ogrn: '1234567890123',
    legalAddress: '123456, г. Москва, ул. Тверская, д. 1',
    actualAddress: '123456, г. Москва, ул. Тверская, д. 1',
    phone: '+7 (495) 123-45-67',
    email: 'info@cpo.ru',
    website: 'https://cpo.ru',
    directorName: 'Иванов Иван Иванович',
    directorPosition: 'Генеральный директор',
    accreditationNumber: 'АКК-001-2024',
    accreditationDate: '2024-01-15',
    accreditationExpiryDate: '2027-01-15',
    status: 'active',
    accreditationType: 'educational',
    description: 'Центр профессионального обучения специалистов в области арбитражного управления',
    services: ['Обучение арбитражных управляющих', 'Повышение квалификации', 'Профессиональная переподготовка'],
    documents: [
      {
        id: '1',
        name: 'Свидетельство об аккредитации',
        type: 'accreditation',
        url: '/documents/accreditation-001.pdf',
        uploadedAt: '2024-01-15T10:00:00Z'
      }
    ],
    contacts: [
      {
        name: 'Петров Петр Петрович',
        position: 'Руководитель учебного центра',
        phone: '+7 (495) 123-45-68',
        email: 'petrov@cpo.ru'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'АНО "Институт оценки и сертификации"',
    shortName: 'ИОС',
    inn: '2345678901',
    kpp: '234567890',
    ogrn: '2345678901234',
    legalAddress: '234567, г. Санкт-Петербург, Невский пр., д. 2',
    actualAddress: '234567, г. Санкт-Петербург, Невский пр., д. 2',
    phone: '+7 (812) 234-56-78',
    email: 'info@ios.ru',
    website: 'https://ios.ru',
    directorName: 'Сидоров Сидор Сидорович',
    directorPosition: 'Директор',
    accreditationNumber: 'АКК-002-2024',
    accreditationDate: '2024-02-01',
    accreditationExpiryDate: '2027-02-01',
    status: 'active',
    accreditationType: 'assessment',
    description: 'Институт оценки и сертификации профессиональных компетенций',
    services: ['Оценка профессиональных компетенций', 'Сертификация специалистов', 'Тестирование'],
    documents: [
      {
        id: '2',
        name: 'Свидетельство об аккредитации',
        type: 'accreditation',
        url: '/documents/accreditation-002.pdf',
        uploadedAt: '2024-02-01T10:00:00Z'
      }
    ],
    contacts: [
      {
        name: 'Козлов Козел Козлович',
        position: 'Заместитель директора',
        phone: '+7 (812) 234-56-79',
        email: 'kozlov@ios.ru'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: '3',
    name: 'ООО "Учебный центр "Профессионал""',
    shortName: 'УЦ Профессионал',
    inn: '3456789012',
    kpp: '345678901',
    ogrn: '3456789012345',
    legalAddress: '345678, г. Екатеринбург, ул. Ленина, д. 3',
    actualAddress: '345678, г. Екатеринбург, ул. Ленина, д. 3',
    phone: '+7 (343) 345-67-89',
    email: 'info@profcenter.ru',
    website: 'https://profcenter.ru',
    directorName: 'Смирнов Смир Смирнович',
    directorPosition: 'Директор',
    accreditationNumber: 'АКК-003-2024',
    accreditationDate: '2024-03-01',
    accreditationExpiryDate: '2025-03-01',
    status: 'expired',
    accreditationType: 'training',
    description: 'Учебный центр профессиональной подготовки',
    services: ['Курсы повышения квалификации', 'Семинары', 'Тренинги'],
    documents: [
      {
        id: '3',
        name: 'Свидетельство об аккредитации',
        type: 'accreditation',
        url: '/documents/accreditation-003.pdf',
        uploadedAt: '2024-03-01T10:00:00Z'
      }
    ],
    contacts: [
      {
        name: 'Волков Волк Волкович',
        position: 'Руководитель учебного процесса',
        phone: '+7 (343) 345-67-90',
        email: 'volkov@profcenter.ru'
      }
    ],
    createdBy: 'admin',
    updatedBy: 'admin',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z'
  }
];

export const mockAccreditedOrganizationStats: AccreditedOrganizationStats = {
  total: 3,
  active: 2,
  suspended: 0,
  revoked: 0,
  expired: 1,
  byType: {
    educational: 1,
    training: 1,
    assessment: 1,
    other: 0
  },
  recentAdditions: 1,
  expiringSoon: 0
};
