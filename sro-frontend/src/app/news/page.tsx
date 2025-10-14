'use client';

import Layout from '@/components/layout/Layout';
import { NewsList, NewsFilter } from '@/components/news';
import { NewsItem, NewsCategory, NewsFilter as NewsFilterType } from '@/types';
import { useEffect, useState } from 'react';
import { newsService } from '@/services/news';

export default function NewsPage() {
  const [filters, setFilters] = useState<NewsFilterType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await newsService.categories()
        if (res.success) setCategories(res.data)
      } catch {}
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true)
      try {
        const res = await newsService.list({
          search: filters.query,
          category: filters.category,
          status: 'published',
          page: currentPage,
          limit: 9,
          sortBy: 'publishedAt',
          sortOrder: 'desc',
        })
        if (res.success) {
          setNews(res.data.data)
          setTotalPages(res.data.pagination.totalPages)
        }
      } catch {
        setNews([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [filters, currentPage])

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
          loading={loading}
          onNewsClick={handleNewsClick}
          showFeatured={true}
          showCategories={true}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
}
