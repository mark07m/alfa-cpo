'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

// Маппинг путей к названиям для автоматического определения
const pathNames: Record<string, string> = {
  '/': 'Главная',
  '/about': 'Об Ассоциации',
  '/about/leadership': 'Руководство',
  '/about/history': 'История',
  '/about/structure': 'Структура управления',
  '/activity': 'Деятельность',
  '/compensation-fund': 'Компенсационный фонд',
  '/accreditation': 'Аккредитация',
  '/labor-activity': 'Трудовая деятельность',
  '/professional-development': 'Повышение квалификации',
  '/registry': 'Реестр АУ',
  '/registry/excluded': 'Исключенные из СРО',
  '/documents': 'Документы',
  '/documents/regulatory': 'Нормативные документы',
  '/documents/rules': 'Правила деятельности',
  '/documents/foundation': 'Учредительные документы',
  '/control': 'Контроль',
  '/control/schedule': 'График проверок',
  '/control/results': 'Результаты проверок',
  '/control/disciplinary': 'Дисциплинарные меры',
  '/control/information-updates': 'Информация о размещении сведений',
  '/news': 'Новости',
  '/news/events': 'Мероприятия',
  '/news/announcements': 'Объявления',
  '/contacts': 'Контакты',
  '/privacy': 'Политика конфиденциальности',
  '/terms': 'Условия использования',
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className,
  showHome = true,
}) => {
  const pathname = usePathname();

  // Автоматическое определение хлебных крошек из пути
  const autoBreadcrumbs = React.useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Добавляем главную страницу
    if (showHome) {
      breadcrumbs.push({ name: 'Главная', href: '/' });
    }

    // Строим путь по сегментам
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = pathNames[currentPath] || segment;
      breadcrumbs.push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        href: currentPath,
      });
    });

    return breadcrumbs;
  }, [pathname, showHome]);

  const breadcrumbItems = items || autoBreadcrumbs;

  // Не показываем хлебные крошки на главной странице
  if (pathname === '/' && showHome) {
    return null;
  }

  return (
    <nav
      className={clsx(
        'flex items-center space-x-1 text-sm text-neutral-600',
        className
      )}
      aria-label="Хлебные крошки"
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={item.href}>
            {isFirst && (
              <Link
                href={item.href}
                className="flex items-center text-neutral-500 hover:text-beige-600 transition-colors duration-200"
                aria-label="Главная страница"
              >
                <HomeIcon className="h-4 w-4" />
              </Link>
            )}
            
            {!isFirst && (
              <ChevronRightIcon className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            )}

            {isLast ? (
              <span
                className="text-neutral-900 font-medium"
                aria-current="page"
              >
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-neutral-600 hover:text-beige-600 transition-colors duration-200 truncate"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
