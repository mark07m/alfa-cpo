'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthState, LoginCredentials } from '@/types/admin'
import { apiService } from '@/services/admin/api'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    // Check if user is already authenticated on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        const response = await apiService.getCurrentUser()
        if (response.success) {
          setAuthState({
            user: response.data,
            token,
            refreshToken: localStorage.getItem('admin_refresh_token'),
            isAuthenticated: true,
            isLoading: false
          })
        } else {
          clearAuthState()
        }
      } else {
        clearAuthState()
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      clearAuthState()
    }
  }

  const clearAuthState = () => {
    setAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    })
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refresh_token')
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await apiService.login(credentials)
      
      if (response.success) {
        setAuthState({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        throw new Error(response.message || 'Ошибка входа')
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthState()
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser()
      if (response.success) {
        setAuthState(prev => ({
          ...prev,
          user: response.data
        }))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      clearAuthState()
    }
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      window.location.href = '/login'
      return null
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
            <p className="text-gray-600">У вас нет прав для доступа к этой странице</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
