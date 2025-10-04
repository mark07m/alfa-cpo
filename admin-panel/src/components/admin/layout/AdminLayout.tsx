'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminBreadcrumbs } from './AdminBreadcrumbs'
import { LoadingPage } from '@/components/admin/ui/LoadingSpinner'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  if (!isClient || isLoading) {
    return <LoadingPage text="Загрузка админ-панели..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={handleSidebarClose}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75 transition-opacity duration-200"></div>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader onMenuClick={handleSidebarToggle} />

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <AdminBreadcrumbs items={breadcrumbs} />
            )}

            {/* Page title */}
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
            )}

            {/* Page content */}
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}