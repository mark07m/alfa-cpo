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
        activities: Array.isArray(activitiesData) ? activitiesData : []
      }
    } catch (err) {
      const allowFallback = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_FALLBACK === 'true'
      // Check if it's API unavailable error (expected when server is down)
      if (err instanceof Error && (err.name === 'API_UNAVAILABLE' || err.message === 'API unavailable')) {
        if (allowFallback) {
          console.info('API server not available, using mock data')
        }
      } else {
        console.warn('Dashboard data fetch error', err)
      }
      if (!allowFallback) throw err
      // Return mock data when fallback enabled
      const fallback = {
        stats: {
          newsCount: 24,
          newsChange: { value: '+12%', type: 'increase' as const },
          eventsCount: 8,
          eventsChange: { value: '+5%', type: 'increase' as const },
          documentsCount: 156,
          documentsChange: { value: '+8%', type: 'increase' as const },
          usersCount: 342,
          usersChange: { value: '+3%', type: 'increase' as const },
          inspectionsCount: 12,
          disciplinaryMeasuresCount: 3,
          compensationFundCount: 45
        },
        activities: [
          {
            id: '1',
            type: 'news' as const,
            action: 'created' as const,
            title: 'Новая статья о банкротстве',
            user: { name: 'Иван Петров', id: '1' },
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            details: 'Статья о новых изменениях в законодательстве'
          },
          {
            id: '2',
            type: 'arbitrator' as const,
            action: 'updated' as const,
            title: 'Обновлены данные управляющего',
            user: { name: 'Мария Сидорова', id: '2' },
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            details: 'Изменены контактные данные'
          },
          {
            id: '3',
            type: 'event' as const,
            action: 'created' as const,
            title: 'Семинар по новому законодательству',
            user: { name: 'Алексей Козлов', id: '3' },
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            details: 'Планируется на 15 января 2025'
          }
        ]
      };
      return fallback
    }
  }, [])

  const { data, loading, error, refetch, isStale } = useOptimizedData({
    fetchFn: fetchDashboardData,
    staleTime: 2 * 60 * 1000, // 2 минуты для дашборда
    enabled: true,
    refetchOnMount: true,
    cacheKey: 'dashboard:stats+activities',
    requestTimeoutMs: 8000
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
      const allowFallback = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_FALLBACK === 'true'
      // Check if it's API unavailable error (expected when server is down)
      if (error instanceof Error && (error.name === 'API_UNAVAILABLE' || error.message === 'API unavailable')) {
        if (allowFallback) {
          console.info('API server not available, using mock data for activity chart')
        }
      } else {
        console.warn('Activity data fetch error:', error)
      }
      if (!allowFallback) throw error
      // Return mock data when fallback enabled
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
    refetchOnMount: true,
    cacheKey: `dashboard:activity:${days}`,
    requestTimeoutMs: 8000
  })

  return { 
    data: data || [], 
    isLoading: loading,
    error,
    refetch
  }
}