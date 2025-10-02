import React from 'react';
import Link from 'next/link';
import NewsCard from '@/components/cards/NewsCard';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  href?: string;
}

interface NewsSectionProps {
  title?: string;
  allNewsHref?: string;
  news?: NewsItem[];
  defaultCover?: string;
}

export default function NewsSection({
  title = "Последние новости",
  allNewsHref = "/news",
  news = [],
  defaultCover = "/assets/news_cover_beige.png"
}: NewsSectionProps) {
  // Заглушка для демонстрации, если новости не переданы
  const defaultNews: NewsItem[] = news.length > 0 ? news : [
    {
      id: "1",
      title: "Обновление реестра арбитражных управляющих",
      date: new Date().toLocaleDateString('ru-RU'),
      excerpt: "В реестр СРО добавлены новые арбитражные управляющие, прошедшие процедуру аккредитации.",
      href: "/news/1"
    },
    {
      id: "2", 
      title: "Изменения в нормативных документах",
      date: new Date(Date.now() - 86400000).toLocaleDateString('ru-RU'),
      excerpt: "Обновлены правила профессиональной деятельности арбитражных управляющих.",
      href: "/news/2"
    },
    {
      id: "3",
      title: "Проведение семинара по повышению квалификации",
      date: new Date(Date.now() - 172800000).toLocaleDateString('ru-RU'),
      excerpt: "Запланирован семинар для членов СРО по актуальным вопросам банкротства.",
      href: "/news/3"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции с фоновой обложкой */}
        <div 
          className="relative mb-12 py-8 px-6 rounded-xl bg-cover bg-center shadow-lg"
          style={{
            backgroundImage: `url('${defaultCover}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-beige-900/30 via-amber-900/20 to-beige-800/30 rounded-xl"></div>
          <div className="relative z-10 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {title}
            </h2>
            <Link 
              href={allNewsHref} 
              className="btn-outline text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 border-2 border-white text-white hover:bg-white hover:text-neutral-900 shadow-lg"
            >
              Все новости
            </Link>
          </div>
        </div>
        
        {/* Сетка новостей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultNews.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              date={item.date}
              excerpt={item.excerpt}
              cover={item.cover}
              href={item.href}
              defaultCover={defaultCover}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
