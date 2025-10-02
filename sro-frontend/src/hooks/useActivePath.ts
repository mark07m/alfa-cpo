'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Хук для определения активного пути в навигации
 */
export const useActivePath = () => {
  const pathname = usePathname();

  const isActivePath = useMemo(() => {
    return (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    };
  }, [pathname]);

  const isExactActivePath = useMemo(() => {
    return (href: string) => {
      return pathname === href;
    };
  }, [pathname]);

  return {
    pathname,
    isActivePath,
    isExactActivePath,
  };
};
