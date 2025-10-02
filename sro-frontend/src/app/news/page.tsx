import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { NewsCard } from '@/components/cards';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  NewspaperIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: 'Изменения в законодательстве о банкротстве с 1 января 2024 года',
      excerpt: 'С 1 января 2024 года вступают в силу новые положения Федерального закона "О несостоятельности (банкротстве)", касающиеся процедуры наблюдения.',
      date: '15.01.2024',
      category: 'Законодательство',
      cover: '/assets/news_cover_beige.png',
      featured: true
    },
    {
      id: 2,
      title: 'Семинар "Новеллы в законодательстве о банкротстве"',
      excerpt: '15 февраля 2024 года состоится семинар для членов СРО по обсуждению последних изменений в законодательстве о несостоятельности.',
      date: '10.01.2024',
      category: 'Мероприятия',
      cover: '/assets/news_cover_beige.png',
      featured: false
    },
    {
      id: 3,
      title: 'Обновление реестра арбитражных управляющих',
      excerpt: 'В реестр СРО добавлены 5 новых арбитражных управляющих. Общее количество членов организации составляет 155 человек.',
      date: '08.01.2024',
      category: 'Реестр',
      cover: '/assets/news_cover_beige.png',
      featured: false
    },
    {
      id: 4,
      title: 'Отчет о деятельности СРО за 2023 год',
      excerpt: 'Опубликован годовой отчет о деятельности саморегулируемой организации арбитражных управляющих за 2023 год.',
      date: '05.01.2024',
      category: 'Отчеты',
      cover: '/assets/news_cover_beige.png',
      featured: false
    },
    {
      id: 5,
      title: 'Конференция "Современные тенденции в банкротстве"',
      excerpt: '15 декабря 2023 года состоялась ежегодная конференция, в которой приняли участие более 150 арбитражных управляющих.',
      date: '20.12.2023',
      category: 'Мероприятия',
      cover: '/assets/news_cover_beige.png',
      featured: false
    },
    {
      id: 6,
      title: 'Изменения в размере компенсационного фонда',
      excerpt: 'Размер компенсационного фонда СРО увеличен до 7 500 000 рублей в соответствии с требованиями законодательства.',
      date: '15.12.2023',
      category: 'Компенсационный фонд',
      cover: '/assets/news_cover_beige.png',
      featured: false
    }
  ];

  const categories = [
    'Все категории',
    'Законодательство',
    'Мероприятия',
    'Реестр',
    'Отчеты',
    'Компенсационный фонд',
    'Объявления'
  ];

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

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Поиск и фильтрация
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="Поиск по тексту"
                placeholder="Введите ключевые слова"
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Категория
                </label>
                <select className="form-input">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Период
                </label>
                <select className="form-input">
                  <option>За все время</option>
                  <option>За последний месяц</option>
                  <option>За последние 3 месяца</option>
                  <option>За последний год</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 sm:flex-none">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Найти
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured News */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Важные новости
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {news.filter(item => item.featured).map((item) => (
                <div key={item.id} className="relative">
                  <NewsCard
                    title={item.title}
                    excerpt={item.excerpt}
                    date={item.date}
                    category={item.category}
                    cover={item.cover}
                    href={`/news/${item.id}`}
                    featured={true}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All News */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Все новости
              </h2>
              <span className="text-sm text-neutral-600">
                Найдено: {news.length} новостей
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  date={item.date}
                  category={item.category}
                  cover={item.cover}
                  href={`/news/${item.id}`}
                  featured={false}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Предыдущая
                </Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">
                  Следующая
                </Button>
              </nav>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Категории новостей
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.slice(1).map((category) => (
                <div 
                  key={category}
                  className="border border-neutral-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <TagIcon className="h-8 w-8 text-beige-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-neutral-900 text-sm">
                    {category}
                  </h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center">
              <NewspaperIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Всего новостей
              </h3>
              <p className="text-2xl font-bold text-beige-700">{news.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                За этот месяц
              </h3>
              <p className="text-2xl font-bold text-beige-700">4</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <TagIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Категорий
              </h3>
              <p className="text-2xl font-bold text-beige-700">6</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <NewspaperIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Важных новостей
              </h3>
              <p className="text-2xl font-bold text-beige-700">1</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
