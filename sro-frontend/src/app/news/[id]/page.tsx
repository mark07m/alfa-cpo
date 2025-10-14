'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { NewsDetail } from '@/components/news';
import { NewsItem } from '@/types';
import Loading from '@/components/ui/Loading';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { newsService } from '@/services/news';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true)
        const newsId = params.id as string

        const res = await newsService.getById(newsId)
        if (!res.success || !res.data) {
          setError('Новость не найдена')
          return
        }
        setNews(res.data)

        if (res.data.category?.slug) {
          const relatedRes = await newsService.byCategory(res.data.category.slug, 3, res.data.id)
          if (relatedRes.success) setRelatedNews(relatedRes.data)
        } else {
          setRelatedNews([])
        }
      } catch (err) {
        setError('Ошибка загрузки новости')
        console.error('Error loading news:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadNews();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/news');
  };

  const handleShare = (newsItem: NewsItem) => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      // @ts-expect-error: Web Share API is not in all TS DOM libs
      navigator
        .share({
          title: newsItem.title,
          text: newsItem.excerpt,
          url: window.location.href,
        })
        .catch((err: any) => {
          // Ignore user cancellation; log others for diagnostics
          if (err?.name === 'AbortError' || /abort/i.test(err?.message || '')) return;
          console.warn('Share failed', err);
        });
    } else if (navigator.clipboard && 'writeText' in navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const handlePrint = (newsItem: NewsItem) => {
    window.print();
  };

  if (loading) {
    return (
      <Layout
        title="Загрузка новости - СРО АУ"
        description="Загрузка новости..."
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </Layout>
    );
  }

  if (error || !news) {
    return (
      <Layout
        title="Новость не найдена - СРО АУ"
        description="Запрашиваемая новость не найдена"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-neutral-900 mb-4">
                Новость не найдена
              </h1>
              <p className="text-neutral-600 mb-6">
                Запрашиваемая новость не существует или была удалена.
              </p>
              <Button onClick={handleBack}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Вернуться к новостям
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${news.title} - СРО АУ`}
      description={news.excerpt}
      keywords={news.tags?.join(', ') || ''}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsDetail
          news={news}
          relatedNews={relatedNews}
          onBack={handleBack}
          onShare={handleShare}
          onPrint={handlePrint}
        />
      </div>
    </Layout>
  );
}
