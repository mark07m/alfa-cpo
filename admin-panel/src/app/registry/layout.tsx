'use client';

import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export default function RegistryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Определяем title и breadcrumbs в зависимости от текущего пути
  const getPageInfo = () => {
    if (pathname === '/registry/statistics') {
      return {
        title: 'Статистика реестра',
        breadcrumbs: [
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Статистика' }
        ]
      };
    }
    
    if (pathname === '/registry/compensation-fund') {
      return {
        title: 'Компенсационный фонд',
        breadcrumbs: [
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Компенсационный фонд' }
        ]
      };
    }
    
    if (pathname === '/registry/accredited-organizations') {
      return {
        title: 'Реестр аккредитованных организаций',
        breadcrumbs: [
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Аккредитованные организации' }
        ]
      };
    }
    
    if (pathname === '/registry/arbitrators') {
      return {
        title: 'Реестр арбитражных управляющих',
        breadcrumbs: [
          { label: 'Дашборд', href: '/' },
          { label: 'Реестр', href: '/registry' },
          { label: 'Арбитражные управляющие' }
        ]
      };
    }
    
    // По умолчанию
    return {
      title: 'Реестр',
      breadcrumbs: [
        { label: 'Дашборд', href: '/' },
        { label: 'Реестр' }
      ]
    };
  };

  const { title, breadcrumbs } = getPageInfo();

  return (
    <AdminLayout
      title={title}
      breadcrumbs={breadcrumbs}
    >
      {children}
    </AdminLayout>
  );
}
