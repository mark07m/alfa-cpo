'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { NewsItem } from '@/types';
import { 
  CalendarIcon,
  UserIcon,
  EyeIcon,
  TagIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export default function NewsCard({
  news,
  onClick,
  variant = 'default',
  className = ''
}: NewsCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(news);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const getCardClasses = () => {
    const baseClasses = "hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-amber-200";
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} border-amber-200 bg-gradient-to-br from-amber-50 to-beige-50`;
      case 'compact':
        return `${baseClasses} hover:shadow-lg`;
      default:
        return baseClasses;
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return 'h-64';
      case 'compact':
        return 'h-32';
      default:
        return 'h-48';
    }
  };

  const getTitleSize = () => {
    switch (variant) {
      case 'featured':
        return 'text-xl';
      case 'compact':
        return 'text-base';
      default:
        return 'text-lg';
    }
  };

  const getExcerptLines = () => {
    switch (variant) {
      case 'featured':
        return 'line-clamp-4';
      case 'compact':
        return 'line-clamp-2';
      default:
        return 'line-clamp-3';
    }
  };

  const coverImage = news.cover || news.imageUrl || '/assets/news_cover_beige.png';

  return (
    <Card 
      className={`${getCardClasses()} ${className} cursor-pointer`}
      onClick={handleClick}
    >
      {/* Обложка новости */}
      <div className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-beige-100 to-amber-50`}>
        <Image
          src={coverImage}
          alt={news.title}
          fill
          className="object-cover"
          loading="lazy"
        />
        
        {/* Декоративная рамка */}
        <div className="absolute inset-0 border-2 border-white/50"></div>
        
        {/* Важная новость - звездочка */}
        {news.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-amber-500 text-white p-1 rounded-full">
              <StarIcon className="h-4 w-4" />
            </div>
          </div>
        )}
        
        {/* Категория */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-neutral-700">
            <TagIcon className="h-3 w-3 mr-1" />
            {news.category.name}
          </span>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between text-sm text-neutral-500 mb-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(news.publishedAt)}
            </div>
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              {news.author}
            </div>
          </div>
          {news.views && (
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {news.views}
            </div>
          )}
        </div>
        
        <h3 className={`font-semibold text-neutral-900 mb-2 line-clamp-2 ${getTitleSize()}`}>
          {news.title}
        </h3>
      </CardHeader>
      
      <CardContent>
        <p className={`text-neutral-600 mb-4 ${getExcerptLines()}`}>
          {news.excerpt}
        </p>
        
        {/* Теги */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600"
              >
                #{tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
                +{news.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Link href={`/news/${news.id}`}>
            <Button variant="ghost" size="sm">
              Читать далее
            </Button>
          </Link>
          
          {news.status === 'draft' && (
            <span className="text-xs text-amber-600 font-medium">
              Черновик
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
