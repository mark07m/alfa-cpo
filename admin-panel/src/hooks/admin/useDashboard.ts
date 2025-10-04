import { useCallback } from 'react'
import { dashboardService } from '@/services/admin/dashboard'
import { DashboardStats, ActivityItem } from '@/types/admin'
import { useOptimizedData } from './useOptimizedData'

interface UseDashboardReturn {
  stats: DashboardStats | null
  activities: ActivityItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  isStale: boolean
}

export function useDashboard(): UseDashboardReturn {
  const fetchDashboardData = useCallback(async () => {
    try {
      // Параллельно загружаем статистику и активность
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivities(10)
      ])

      return {
        stats: statsData,
        activities: activitiesData || []
      }
    } catch (err) {
      // Check if it's API unavailable error (expected when server is down)
      if (err instanceof Error && (err.name === 'API_UNAVAILABLE' || err.message === 'API unavailable')) {
        console.info('API server not available, using mock data')
      } else {
        console.warn('Dashboard data fetch error, using mock data:', err)
      }
      
      // Return mock data when API is unavailable
      return {
        stats: {
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
        },
        activities: [
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
          }
        ]
      }
    }
  }, [])

  const { data, loading, error, refetch, isStale } = useOptimizedData({
    fetchFn: fetchDashboardData,
    staleTime: 2 * 60 * 1000, // 2 минуты для дашборда
    enabled: true,
    refetchOnMount: true
  })

  return {
    stats: data?.stats || null,
    activities: data?.activities || [],
    isLoading: loading,
    error,
    refetch,
    isStale
  }
}

// Хук для получения данных активности за период
export function useActivityData(days: number = 30) {
  const fetchActivityData = useCallback(async () => {
    try {
      return await dashboardService.getActivityChart(days)
    } catch (error) {
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && (error.name === 'API_UNAVAILABLE' || error.message === 'API unavailable')) {
        console.info('API server not available, using mock data for activity chart')
      } else {
        console.warn('Activity data fetch error, using mock data:', error)
      }
      
      // Return mock data when API is unavailable
      const mockData = []
      const today = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 20) + 5
        })
      }
      
      return mockData
    }
  }, [days])

  const { data, loading, error, refetch } = useOptimizedData({
    fetchFn: fetchActivityData,
    dependencies: [days],
    staleTime: 5 * 60 * 1000, // 5 минут для графиков
    enabled: true,
    refetchOnMount: true
  })

  return { 
    data: data || [], 
    isLoading: loading,
    error,
    refetch
  }
}