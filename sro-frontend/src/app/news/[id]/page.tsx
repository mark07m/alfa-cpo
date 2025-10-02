'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { NewsDetail } from '@/components/news';
import { NewsItem, NewsCategory } from '@/types';
import Loading from '@/components/ui/Loading';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories: NewsCategory[] = [
    { id: '1', name: 'Законодательство', slug: 'legislation', order: 1, color: '#3B82F6' },
    { id: '2', name: 'Мероприятия', slug: 'events', order: 2, color: '#10B981' },
    { id: '3', name: 'Реестр', slug: 'registry', order: 3, color: '#8B5CF6' },
    { id: '4', name: 'Отчеты', slug: 'reports', order: 4, color: '#F59E0B' },
    { id: '5', name: 'Компенсационный фонд', slug: 'compensation-fund', order: 5, color: '#EF4444' },
    { id: '6', name: 'Объявления', slug: 'announcements', order: 6, color: '#6B7280' }
  ];

  const allNews: NewsItem[] = [
    {
      id: '1',
      title: 'Изменения в законодательстве о банкротстве с 1 января 2024 года',
      content: '<p>С 1 января 2024 года вступают в силу новые положения Федерального закона "О несостоятельности (банкротстве)", касающиеся процедуры наблюдения. Основные изменения включают:</p><ul><li>Увеличение срока наблюдения до 7 месяцев</li><li>Новые требования к арбитражным управляющим</li><li>Изменения в порядке подачи заявлений</li></ul><p>Подробная информация о нововведениях доступна в разделе "Нормативные документы".</p><h3>Ключевые изменения</h3><p>Среди наиболее значимых изменений можно выделить следующие:</p><ol><li><strong>Срок процедуры наблюдения</strong> увеличен с 6 до 7 месяцев, что позволит арбитражным управляющим более тщательно проанализировать финансовое состояние должника.</li><li><strong>Требования к квалификации</strong> арбитражных управляющих ужесточены - теперь необходимо наличие дополнительного образования в области экономики или права.</li><li><strong>Порядок подачи заявлений</strong> о признании должника банкротом упрощен для кредиторов, что должно ускорить процедуру.</li></ol><h3>Практические рекомендации</h3><p>Для арбитражных управляющих рекомендуется:</p><ul><li>Изучить новые требования к квалификации и при необходимости пройти дополнительное обучение</li><li>Обновить внутренние процедуры в соответствии с новыми требованиями</li><li>Ознакомиться с изменениями в порядке ведения дел</li></ul>',
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
      content: '<p>15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.</p><p>В программе семинара:</p><ul><li>Обзор изменений в ФЗ "О несостоятельности (банкротстве)"</li><li>Практические аспекты применения новых норм</li><li>Ответы на вопросы участников</li></ul><h3>Программа мероприятия</h3><p><strong>10:00 - 10:30</strong> Регистрация участников</p><p><strong>10:30 - 12:00</strong> Обзор изменений в законодательстве (докладчик: Иванов И.И.)</p><p><strong>12:00 - 12:30</strong> Кофе-брейк</p><p><strong>12:30 - 14:00</strong> Практические аспекты применения (докладчик: Петров П.П.)</p><p><strong>14:00 - 15:00</strong> Обед</p><p><strong>15:00 - 16:30</strong> Вопросы и ответы</p><h3>Регистрация</h3><p>Для участия в семинаре необходимо зарегистрироваться до 10 февраля 2024 года по телефону +7 (495) 123-45-67 или по электронной почте events@sro-au.ru</p>',
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
      content: '<p>В реестр СРО добавлены 5 новых арбитражных управляющих. Общее количество членов организации составляет 155 человек.</p><p>Новые члены СРО прошли все необходимые процедуры аккредитации и готовы к профессиональной деятельности.</p><h3>Новые члены СРО</h3><ul><li>Сидоров А.А. - г. Москва</li><li>Козлов В.В. - г. Санкт-Петербург</li><li>Морозов Г.Г. - г. Екатеринбург</li><li>Волков Д.Д. - г. Новосибирск</li><li>Соколов Е.Е. - г. Казань</li></ul><h3>Процедура аккредитации</h3><p>Все новые члены прошли стандартную процедуру аккредитации, включающую:</p><ul><li>Подачу заявления и необходимых документов</li><li>Проверку квалификации и опыта работы</li><li>Собеседование с комиссией СРО</li><li>Оплату вступительного взноса</li></ul>',
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
      content: '<p>Опубликован годовой отчет о деятельности саморегулируемой организации арбитражных управляющих за 2023 год.</p><p>В отчете представлена полная информация о деятельности СРО, включая статистику, финансовые показатели и планы на будущее.</p><h3>Основные показатели 2023 года</h3><ul><li>Количество членов СРО: 150 человек</li><li>Проведено проверок: 48</li><li>Выдано предупреждений: 12</li><li>Исключено из СРО: 3 человека</li><li>Размер компенсационного фонда: 7 500 000 рублей</li></ul><h3>Финансовые показатели</h3><p>Общий доход СРО за 2023 год составил 15 000 000 рублей, расходы - 12 000 000 рублей. Чистая прибыль - 3 000 000 рублей.</p><h3>Планы на 2024 год</h3><ul><li>Увеличение количества членов до 170 человек</li><li>Проведение 60 проверок</li><li>Организация 12 семинаров и тренингов</li><li>Обновление нормативной базы</li></ul>',
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
      content: '<p>15 декабря 2023 года состоялась ежегодная конференция, в которой приняли участие более 150 арбитражных управляющих.</p><p>На конференции обсуждались актуальные вопросы развития института банкротства в России.</p><h3>Основные темы конференции</h3><ul><li>Цифровизация процедур банкротства</li><li>Международный опыт в области несостоятельности</li><li>Этические аспекты деятельности арбитражных управляющих</li><li>Проблемы и перспективы развития института</li></ul><h3>Ключевые докладчики</h3><ul><li>Профессор Иванов И.И. - "Цифровизация процедур банкротства"</li><li>Доцент Петров П.П. - "Международный опыт"</li><li>Кандидат наук Сидоров С.С. - "Этические аспекты"</li></ul><h3>Результаты конференции</h3><p>По итогам конференции были приняты следующие решения:</p><ul><li>Создать рабочую группу по цифровизации</li><li>Разработать этический кодекс</li><li>Организовать обмен опытом с зарубежными коллегами</li></ul>',
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
      content: '<p>Размер компенсационного фонда СРО увеличен до 7 500 000 рублей в соответствии с требованиями законодательства.</p><p>Обновленная информация о фонде доступна в соответствующем разделе сайта.</p><h3>История изменений</h3><ul><li>2020 год: 5 000 000 рублей</li><li>2021 год: 5 500 000 рублей</li><li>2022 год: 6 000 000 рублей</li><li>2023 год: 7 000 000 рублей</li><li>2024 год: 7 500 000 рублей</li></ul><h3>Назначение фонда</h3><p>Компенсационный фонд предназначен для:</p><ul><li>Возмещения ущерба, причиненного действиями арбитражных управляющих</li><li>Обеспечения финансовой стабильности СРО</li><li>Покрытия расходов на контрольные мероприятия</li></ul><h3>Управление фондом</h3><p>Управление компенсационным фондом осуществляется правлением СРО в соответствии с утвержденным положением. Средства фонда размещаются на специальном банковском счете.</p>',
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

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsId = params.id as string;
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundNews = allNews.find(item => item.id === newsId);
        
        if (!foundNews) {
          setError('Новость не найдена');
          return;
        }

        // Увеличиваем счетчик просмотров
        const updatedNews = {
          ...foundNews,
          views: (foundNews.views || 0) + 1
        };
        
        setNews(updatedNews);
        
        // Находим похожие новости (той же категории, исключая текущую)
        const related = allNews
          .filter(item => 
            item.id !== newsId && 
            item.category.id === foundNews.category.id
          )
          .slice(0, 3);
        
        setRelatedNews(related);
      } catch (err) {
        setError('Ошибка загрузки новости');
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadNews();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/news');
  };

  const handleShare = (newsItem: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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
