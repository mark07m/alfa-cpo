'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NewsCard from './NewsCard';
import { NewsDetailProps } from '@/types';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
  ShareIcon,
  PrinterIcon,
  TagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function NewsDetail({
  news,
  relatedNews = [],
  onBack,
  onShare,
  onPrint
}: NewsDetailProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(news);
    } else if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(news);
    } else {
      window.print();
    }
  };

  const coverImage = news.cover || news.imageUrl || '/assets/news_cover_beige.png';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Навигация */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Назад к новостям
        </Button>
      </div>

      {/* Основной контент */}
      <Card className="mb-8">
        {/* Заголовок и метаданные */}
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-beige-100 text-beige-800">
                  <TagIcon className="h-3 w-3 mr-1" />
                  {news.category.name}
                </span>
                {news.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <StarIcon className="h-3 w-3 mr-1" />
                    Важная новость
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">
                {news.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-sm text-neutral-600 mb-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Опубликовано: {formatDate(news.publishedAt)}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span>{news.author}</span>
                </div>
                {news.views && (
                  <div className="flex items-center">
                    <EyeIcon className="h-4 w-4 mr-2" />
                    <span>{news.views} просмотров</span>
                  </div>
                )}
              </div>
              
              {news.updatedAt !== news.publishedAt && (
                <div className="text-sm text-neutral-500">
                  Обновлено: {formatDateTime(news.updatedAt)}
                </div>
              )}
            </div>
            
            {/* Действия */}
            <div className="flex space-x-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <ShareIcon className="h-4 w-4 mr-1" />
                Поделиться
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <PrinterIcon className="h-4 w-4 mr-1" />
                Печать
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Обложка */}
        <div className="relative w-full h-64 md:h-96 bg-gradient-to-br from-beige-100 to-amber-50 mb-6">
          <Image
            src={coverImage}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 border-2 border-white/50"></div>
        </div>

        {/* Контент */}
        <CardContent>
          {/* Краткое описание */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-neutral-700 leading-relaxed">
              {news.excerpt}
            </p>
          </div>

          {/* Основной текст */}
          <div 
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Теги */}
          {news.tags && news.tags.length > 0 && (
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Теги
              </h3>
              <div className="flex flex-wrap gap-2">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Похожие новости */}
      {relatedNews.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Похожие новости
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.slice(0, 3).map((relatedNewsItem) => (
                <NewsCard
                  key={relatedNewsItem.id}
                  news={relatedNewsItem}
                  variant="compact"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
