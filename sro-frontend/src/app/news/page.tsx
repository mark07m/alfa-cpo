'use client';

import Layout from '@/components/layout/Layout';
import { NewsList, NewsFilter } from '@/components/news';
import { NewsItem, NewsCategory, NewsFilter as NewsFilterType } from '@/types';
import { useState } from 'react';

export default function NewsPage() {
  const [filters, setFilters] = useState<NewsFilterType>({});
  const [currentPage, setCurrentPage] = useState(1);

  const categories: NewsCategory[] = [
    { id: '1', name: 'Законодательство', slug: 'legislation', order: 1, color: '#3B82F6' },
    { id: '2', name: 'Мероприятия', slug: 'events', order: 2, color: '#10B981' },
    { id: '3', name: 'Реестр', slug: 'registry', order: 3, color: '#8B5CF6' },
    { id: '4', name: 'Отчеты', slug: 'reports', order: 4, color: '#F59E0B' },
    { id: '5', name: 'Компенсационный фонд', slug: 'compensation-fund', order: 5, color: '#EF4444' },
    { id: '6', name: 'Объявления', slug: 'announcements', order: 6, color: '#6B7280' }
  ];

  const news: NewsItem[] = [
    {
      id: '1',
      title: 'Изменения в законодательстве о банкротстве с 1 января 2024 года',
      content: '<p>С 1 января 2024 года вступают в силу новые положения Федерального закона "О несостоятельности (банкротстве)", касающиеся процедуры наблюдения. Основные изменения включают:</p><ul><li>Увеличение срока наблюдения до 7 месяцев</li><li>Новые требования к арбитражным управляющим</li><li>Изменения в порядке подачи заявлений</li></ul><p>Подробная информация о нововведениях доступна в разделе "Нормативные документы".</p>',
      excerpt: 'С 1 января 2024 года вступают в силу новые положения Федерального закона "О несостоятельности (банкротстве)", касающиеся процедуры наблюдения.',
      publishedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      author: 'Администрация СРО',
      category: categories[0],
      tags: ['законодательство', 'банкротство', 'изменения'],
      featured: true,
      cover: '/assets/news_cover_beige.png',
      views: 156,
      status: 'published'
    },
    {
      id: '2',
      title: 'Семинар "Новеллы в законодательстве о банкротстве"',
      content: '<p>15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.</p><p>В программе семинара:</p><ul><li>Обзор изменений в ФЗ "О несостоятельности (банкротстве)"</li><li>Практические аспекты применения новых норм</li><li>Ответы на вопросы участников</li></ul>',
      excerpt: '15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.',
      publishedAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
      author: 'Администрация СРО',
      category: categories[1],
      tags: ['семинар', 'обучение', 'законодательство'],
      featured: false,
      cover: '/assets/news_cover_beige.png',
      views: 89,
      status: 'published'
    },
    {
      id: '3',
      title: 'Обновление реестра арбитражных управляющих',
      content: '<p>В реестр СРО добавлены 5 новых арбитражных управляющих. Общее количество членов организации составляет 155 человек.</p><p>Новые члены СРО прошли все необходимые процедуры аккредитации и готовы к профессиональной деятельности.</p>',
      excerpt: 'В реестр СРО добавлены 5 новых арбитражных управляющих. Общее количество членов организации составляет 155 человек.',
      publishedAt: '2024-01-08T09:15:00Z',
      updatedAt: '2024-01-08T09:15:00Z',
      author: 'Администрация СРО',
      category: categories[2],
      tags: ['реестр', 'новые члены', 'аккредитация'],
      featured: false,
      cover: '/assets/news_cover_beige.png',
      views: 234,
      status: 'published'
    },
    {
      id: '4',
      title: 'Отчет о деятельности СРО за 2023 год',
      content: '<p>Опубликован годовой отчет о деятельности саморегулируемой организации арбитражных управляющих за 2023 год.</p><p>В отчете представлена полная информация о деятельности СРО, включая статистику, финансовые показатели и планы на будущее.</p>',
      excerpt: 'Опубликован годовой отчет о деятельности саморегулируемой организации арбитражных управляющих за 2023 год.',
      publishedAt: '2024-01-05T11:00:00Z',
      updatedAt: '2024-01-05T11:00:00Z',
      author: 'Администрация СРО',
      category: categories[3],
      tags: ['отчет', '2023', 'деятельность'],
      featured: false,
      cover: '/assets/news_cover_beige.png',
      views: 178,
      status: 'published'
    },
    {
      id: '5',
      title: 'Конференция "Современные тенденции в банкротстве"',
      content: '<p>15 декабря 2023 года состоялась ежегодная конференция, в которой приняли участие более 150 арбитражных управляющих.</p><p>На конференции обсуждались актуальные вопросы развития института банкротства в России.</p>',
      excerpt: '15 декабря 2023 года состоялась ежегодная конференция, в которой приняли участие более 150 арбитражных управляющих.',
      publishedAt: '2023-12-20T16:45:00Z',
      updatedAt: '2023-12-20T16:45:00Z',
      author: 'Администрация СРО',
      category: categories[1],
      tags: ['конференция', '2023', 'тенденции'],
      featured: false,
      cover: '/assets/news_cover_beige.png',
      views: 312,
      status: 'published'
    },
    {
      id: '6',
      title: 'Изменения в размере компенсационного фонда',
      content: '<p>Размер компенсационного фонда СРО увеличен до 7 500 000 рублей в соответствии с требованиями законодательства.</p><p>Обновленная информация о фонде доступна в соответствующем разделе сайта.</p>',
      excerpt: 'Размер компенсационного фонда СРО увеличен до 7 500 000 рублей в соответствии с требованиями законодательства.',
      publishedAt: '2023-12-15T13:20:00Z',
      updatedAt: '2023-12-15T13:20:00Z',
      author: 'Администрация СРО',
      category: categories[4],
      tags: ['компенсационный фонд', 'изменения', 'финансы'],
      featured: false,
      cover: '/assets/news_cover_beige.png',
      views: 145,
      status: 'published'
    }
  ];

  const handleFiltersChange = (newFilters: NewsFilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    // Переход на детальную страницу новости
    window.location.href = `/news/${newsItem.id}`;
  };

  return (
    <Layout
      title="Текущая деятельность - СРО АУ"
      description="Актуальные новости, мероприятия и объявления саморегулируемой организации арбитражных управляющих."
      keywords="новости, мероприятия, объявления, СРО, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Текущая деятельность
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Актуальные новости, мероприятия и объявления саморегулируемой организации 
            арбитражных управляющих.
          </p>
        </div>

        {/* Фильтры */}
        <NewsFilter
          filters={filters}
          categories={categories}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Список новостей */}
        <NewsList
          news={news}
          onNewsClick={handleNewsClick}
          showFeatured={true}
          showCategories={true}
          showPagination={true}
          currentPage={currentPage}
          totalPages={Math.ceil(news.length / 9)}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}
