'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/services/admin/api'

interface ApiStatusIndicatorProps {
  className?: string
}

export function ApiStatusIndicator({ className = '' }: ApiStatusIndicatorProps) {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const isHealthy = await apiService.healthCheck()
        setIsApiAvailable(isHealthy)
      } catch (error) {
        setIsApiAvailable(false)
      }
    }

    checkApiStatus()
    
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (isApiAvailable === null) {
    return null // Don't show anything while checking
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${
        isApiAvailable ? 'bg-success-500' : 'bg-warning-500'
      }`} />
      <span className={`text-xs font-medium ${
        isApiAvailable ? 'text-success-700' : 'text-warning-700'
      }`}>
        {isApiAvailable ? 'API подключен' : 'Режим демо'}
      </span>
    </div>
  )
}
