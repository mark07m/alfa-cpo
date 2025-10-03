import { useState, useEffect } from 'react'
import { dashboardService } from '@/services/admin/dashboard'
import { DashboardStats, ActivityItem } from '@/types/admin'

interface UseDashboardReturn {
  stats: DashboardStats | null
  activities: ActivityItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Параллельно загружаем статистику и активность
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getActivities(10)
      ])

      setStats(statsData)
      setActivities(activitiesData)
    } catch (err) {
      // Check if it's API unavailable error (expected when server is down)
      if (err instanceof Error && err.name === 'API_UNAVAILABLE') {
        console.info('API server not available, using mock data')
      } else {
        console.warn('Dashboard data fetch error, using mock data:', err)
      }
      setError(null) // Don't show error since we have fallback data
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    activities,
    isLoading,
    error,
    refetch: fetchDashboardData
  }
}

// Хук для получения данных активности за период
export function useActivityData(days: number = 30) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setIsLoading(true)
        const activityData = await dashboardService.getActivityChart(days)
        setData(activityData)
      } catch (error) {
        // Check if it's API unavailable error (expected when server is down)
        if (error instanceof Error && error.name === 'API_UNAVAILABLE') {
          console.info('API server not available, using mock data for activity chart')
        } else {
          console.warn('Activity data fetch error, using mock data:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivityData()
  }, [days])

  return { data, isLoading }
}

