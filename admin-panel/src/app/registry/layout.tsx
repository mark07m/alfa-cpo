'use client';

import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Определяем breadcrumbs в зависимости от текущего пути
  const getBreadcrumbs = () => {
    if (pathname === '/registry/statistics') {
      return [
        { label: 'Дашборд', href: '/dashboard' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Статистика' }
      ];
    }
    
    if (pathname === '/registry/compensation-fund') {
      return [
        { label: 'Дашборд', href: '/dashboard' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Компенсационный фонд' }
      ];
    }
    
    if (pathname === '/registry/accredited-organizations') {
      return [
        { label: 'Дашборд', href: '/dashboard' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Аккредитованные организации' }
      ];
    }
    
    if (pathname === '/registry/arbitrators') {
      return [
        { label: 'Дашборд', href: '/dashboard' },
        { label: 'Реестр', href: '/registry' },
        { label: 'Арбитражные управляющие' }
      ];
    }
    
    // По умолчанию
    return [
      { label: 'Дашборд', href: '/dashboard' },
      { label: 'Реестр' }
    ];
  };

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      {children}
    </AdminLayout>
  );
}
