import { apiService } from './api'
import { DashboardStats, ActivityItem, PaginatedResponse } from '@/types/admin'

export interface DashboardService {
  getStats(): Promise<DashboardStats>
  getActivities(limit?: number): Promise<ActivityItem[]>
  getActivityChart(days?: number): Promise<any[]>
  getNotifications(): Promise<any[]>
}

class DashboardServiceImpl implements DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>('/dashboard/stats')
      return response.data
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
        console.info('Using mock data for dashboard stats')
      } else {
        console.error('Failed to fetch dashboard stats:', error)
      }
      // Возвращаем моковые данные в случае ошибки
      return {
        newsCount: 24,
        newsChange: { value: '+12%', type: 'increase' },
        eventsCount: 8,
        eventsChange: { value: '+5%', type: 'increase' },
        documentsCount: 156,
        documentsChange: { value: '+8%', type: 'increase' },
        usersCount: 342,
        usersChange: { value: '+3%', type: 'increase' },
        inspectionsCount: 12,
        disciplinaryMeasuresCount: 3,
        compensationFundCount: 45
      }
    }
  }

  async getActivities(limit: number = 10): Promise<ActivityItem[]> {
    try {
      const response = await apiService.get<ActivityItem[]>(`/dashboard/activities?limit=${limit}`)
      return response.data
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
        console.info('Using mock data for activities')
      } else {
        console.error('Failed to fetch activities:', error)
      }
      // Возвращаем моковые данные
      return [
        {
          id: '1',
          type: 'news',
          action: 'created',
          title: 'Новая статья о банкротстве',
          user: { name: 'Иван Петров', id: '1' },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'Статья о новых изменениях в законодательстве'
        },
        {
          id: '2',
          type: 'arbitrator',
          action: 'updated',
          title: 'Обновлены данные управляющего',
          user: { name: 'Мария Сидорова', id: '2' },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'Изменены контактные данные'
        },
        {
          id: '3',
          type: 'event',
          action: 'created',
          title: 'Семинар по новому законодательству',
          user: { name: 'Алексей Козлов', id: '3' },
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          details: 'Планируется на 15 января 2025'
        },
        {
          id: '4',
          type: 'document',
          action: 'published',
          title: 'Новый регламент СРО',
          user: { name: 'Елена Волкова', id: '4' },
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          details: 'Опубликован обновленный регламент работы'
        },
        {
          id: '5',
          type: 'inspection',
          action: 'created',
          title: 'Планируется проверка',
          user: { name: 'Дмитрий Соколов', id: '5' },
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          details: 'Запланирована проверка деятельности СРО'
        }
      ]
    }
  }

  async getActivityChart(days: number = 30): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/dashboard/activity-chart?days=${days}`)
      return response.data
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
        console.info('Using mock data for activity chart')
      } else {
        console.error('Failed to fetch activity chart data:', error)
      }
      // Генерируем моковые данные
      return this.generateMockActivityData(days)
    }
  }

  async getNotifications(): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>('/notifications')
      return response.data
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
        console.info('Using mock data for notifications')
      } else {
        console.error('Failed to fetch notifications:', error)
      }
      // Возвращаем моковые уведомления
      return [
        {
          id: '1',
          type: 'warning',
          title: 'Требуется внимание',
          message: '3 проверки ожидают завершения',
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actionUrl: '/inspections'
        },
        {
          id: '2',
          type: 'info',
          title: 'Новая заявка',
          message: 'Поступила заявка на вступление в СРО',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actionUrl: '/registry/applications'
        }
      ]
    }
  }

  private generateMockActivityData(days: number): any[] {
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return data
  }
}

export const dashboardService = new DashboardServiceImpl()
export default dashboardService
