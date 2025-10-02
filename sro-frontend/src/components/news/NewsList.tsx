'use client';

import React from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import NewsCard from './NewsCard';
import { NewsListProps, NewsItem } from '@/types';
import { 
  NewspaperIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function NewsList({
  news,
  loading = false,
  error,
  onNewsClick,
  showFeatured = true,
  showCategories = true,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: NewsListProps) {
  const featuredNews = news.filter(item => item.featured);
  const regularNews = news.filter(item => !item.featured);

  const handleNewsClick = (newsItem: NewsItem) => {
    if (onNewsClick) {
      onNewsClick(newsItem);
    }
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Ошибка загрузки новостей
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <NewspaperIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Новости не найдены
          </h3>
          <p className="text-neutral-600">
            Попробуйте изменить параметры поиска или фильтрации
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Важные новости */}
        {showFeatured && featuredNews.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Важные новости
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredNews.map((item) => (
                  <div key={item.id} className="relative">
                    <NewsCard
                      news={item}
                      variant="featured"
                      onClick={handleNewsClick}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Все новости */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {showFeatured && featuredNews.length > 0 ? 'Все новости' : 'Новости'}
              </h2>
              <span className="text-sm text-neutral-600">
                Найдено: {news.length} новостей
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item) => (
                <NewsCard
                  key={item.id}
                  news={item}
                  onClick={handleNewsClick}
                />
              ))}
            </div>

            {/* Пагинация */}
            {showPagination && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Предыдущая
                  </Button>

                  {/* Номера страниц */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          size="sm"
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Следующая
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </nav>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
