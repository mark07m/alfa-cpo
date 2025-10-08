import { apiService } from './api';
import { 
  CompensationFund, 
  CompensationFundStatistics, 
  CompensationFundFormData, 
  CompensationFundHistoryFormData,
  ApiResponse 
} from '@/types/admin';

export class CompensationFundService {
  private baseUrl = '/compensation-fund';

  // Получить информацию о компенсационном фонде
  async getFundInfo(): Promise<CompensationFund> {
    const response = await apiService.get<ApiResponse<CompensationFund>>(this.baseUrl);
    return response.data.data;
  }

  // Получить статистику компенсационного фонда
  async getFundStatistics(): Promise<CompensationFundStatistics> {
    const response = await apiService.get<ApiResponse<CompensationFundStatistics>>(`${this.baseUrl}/statistics`);
    return response.data.data;
  }

  // Обновить информацию о компенсационном фонде
  async updateFundInfo(data: CompensationFundFormData): Promise<CompensationFund> {
    const response = await apiService.put<ApiResponse<CompensationFund>>(this.baseUrl, data);
    return response.data.data;
  }

  // Получить историю операций
  async getFundHistory(params?: {
    page?: number;
    limit?: number;
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    data: CompensationFund['history'];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await apiService.get<ApiResponse<{
      data: CompensationFund['history'];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>>(`${this.baseUrl}/history`, { params });
    return response.data.data;
  }

  // Добавить запись в историю
  async addHistoryEntry(data: CompensationFundHistoryFormData): Promise<CompensationFund['history'][0]> {
    const response = await apiService.post<ApiResponse<CompensationFund['history'][0]>>(`${this.baseUrl}/history`, data);
    return response.data.data;
  }

  // Обновить запись в истории
  async updateHistoryEntry(id: string, data: CompensationFundHistoryFormData): Promise<CompensationFund['history'][0]> {
    const response = await apiService.put<ApiResponse<CompensationFund['history'][0]>>(`${this.baseUrl}/history/${id}`, data);
    return response.data.data;
  }

  // Удалить запись из истории
  async deleteHistoryEntry(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/history/${id}`);
  }

  // Экспорт истории в Excel
  async exportHistory(params?: {
    operation?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Blob> {
    const response = await apiService.get(`${this.baseUrl}/history/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  // Экспорт статистики в PDF
  async exportStatistics(): Promise<Blob> {
    const response = await apiService.get(`${this.baseUrl}/statistics/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const compensationFundService = new CompensationFundService();
