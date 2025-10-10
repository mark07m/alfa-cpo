'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  NewspaperIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CogIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
  badge?: {
    count: number
    color?: 'red' | 'yellow' | 'green' | 'blue' | 'gray'
  }
}

const navigation: NavigationItem[] = [
  {
    name: 'Дашборд',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Контент',
    href: '/content',
    icon: DocumentTextIcon,
    badge: { count: 3, color: 'blue' },
    children: [
      { name: 'Новости', href: '/news', icon: NewspaperIcon, badge: { count: 2, color: 'blue' } },
      { name: 'Мероприятия', href: '/events', icon: CalendarIcon, badge: { count: 1, color: 'green' } },
      { name: 'Документы', href: '/documents', icon: DocumentDuplicateIcon },
      { name: 'Страницы', href: '/pages', icon: DocumentTextIcon }
    ]
  },
  {
    name: 'Реестр',
    href: '/registry',
    icon: UserGroupIcon,
    children: [
      { name: 'Арбитражные управляющие', href: '/registry/arbitrators', icon: UserGroupIcon },
      { name: 'Аккредитованные организации', href: '/registry/accredited-organizations', icon: BuildingOffice2Icon },
      { name: 'Компенсационный фонд', href: '/registry/compensation-fund', icon: BanknotesIcon },
      { name: 'Статистика', href: '/registry/statistics', icon: ChartBarIcon }
    ]
  },
  {
    name: 'Контроль',
    href: '/control',
    icon: ShieldCheckIcon,
    badge: { count: 5, color: 'red' },
    children: [
      { name: 'Проверки', href: '/inspections', icon: ClipboardDocumentListIcon, badge: { count: 3, color: 'yellow' } },
      { name: 'Дисциплинарные меры', href: '/disciplinary-measures', icon: ExclamationTriangleIcon, badge: { count: 2, color: 'red' } }
    ]
  },
  {
    name: 'Отчеты',
    href: '/reports',
    icon: ChartBarIcon,
    children: [
      { name: 'Все отчеты', href: '/reports', icon: ChartBarIcon },
      { name: 'По проверкам', href: '/inspections/reports', icon: ClipboardDocumentListIcon },
      { name: 'По дисциплинарным мерам', href: '/disciplinary-measures/reports', icon: ExclamationTriangleIcon }
    ]
  },
  {
    name: 'Настройки',
    href: '/settings',
    icon: CogIcon,
    children: [
      { name: 'Сайт', href: '/settings', icon: CogIcon },
      { name: 'Пользователи', href: '/settings/users', icon: UsersIcon },
      { name: 'Безопасность', href: '/settings/security', icon: ShieldCheckIcon }
    ]
  }
]

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  
  // Выбираем один-единственный самый специфичный пункт меню по текущему пути
  const activeHref = React.useMemo(() => {
    const hrefs: string[] = []
    navigation.forEach(item => {
      hrefs.push(item.href)
      if (item.children) {
        item.children.forEach(child => hrefs.push(child.href))
      }
    })

    // Сначала пробуем точное совпадение
    let best = hrefs.find(h => h === pathname) || ''
    if (best) return best

    // Затем ищем по префиксу, выбирая самый длинный путь
    hrefs.forEach(h => {
      if (h !== '/' && (pathname === h || pathname.startsWith(h + '/'))) {
        if (h.length > best.length) best = h
      }
    })

    // Специальный случай для корня/дашборда
    if (!best && (pathname === '/' || pathname === '/dashboard')) {
      best = '/dashboard'
    }
    return best
  }, [pathname])
  // Сохраняем позицию скролла и восстанавливаем при навигации
  React.useEffect(() => {
    const container = document.querySelector('.admin-sidebar-scroll') as HTMLElement | null
    if (!container) return
    const saved = sessionStorage.getItem('adminSidebarScroll')
    if (saved) {
      container.scrollTop = Number(saved)
    }
    const onScroll = () => {
      sessionStorage.setItem('adminSidebarScroll', String(container.scrollTop))
    }
    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => href === activeHref

  const getBadgeColor = (color: string) => {
    const colorMap = {
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const active = isActive(item.href)

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          className={cn(
            'group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
            level > 0 ? 'ml-4' : '',
            active
              ? 'bg-primary-50 text-primary-900 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          )}
          onClick={onClose}
        >
          <div className="flex items-center">
            <item.icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                active ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
              )}
            />
            {item.name}
          </div>
          
          {item.badge && item.badge.count > 0 && (
            <span className={cn(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              getBadgeColor(item.badge.color || 'gray')
            )}>
              {item.badge.count}
            </span>
          )}
        </Link>

          {hasChildren && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map((child) => {
              const childActive = isActive(child.href)
              return (
                <div key={child.name}>
                  <Link
                    href={child.href}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ml-4',
                      childActive
                        ? 'bg-primary-50 text-primary-900 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                    onClick={onClose}
                  >
                    <div className="flex items-center">
                      {child.icon && (
                        <child.icon
                          className={cn(
                            'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                            childActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                          )}
                        />
                      )}
                      {child.name}
                    </div>
                    {child.badge && child.badge.count > 0 && (
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getBadgeColor(child.badge.color || 'gray')
                      )}>
                        {child.badge.count}
                      </span>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4 admin-sidebar-scroll">
            <div className="flex flex-shrink-0 items-center px-4 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">А</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">Админ панель</h1>
                <p className="text-xs text-gray-500">СРО арбитражных управляющих</p>
              </div>
            </div>
            
            <nav className="mt-6 flex-1 space-y-1 px-3">
              {navigation.map((item) => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">А</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">Админ панель</h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto admin-sidebar-scroll">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>
        </div>
      </div>
    </>
  )
}
