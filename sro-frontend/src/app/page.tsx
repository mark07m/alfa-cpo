import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MagnifyingGlassIcon, DocumentTextIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <Layout
      title="СРО Арбитражных Управляющих - Главная"
      description="Официальный сайт саморегулируемой организации арбитражных управляющих. Реестр членов, нормативные документы, компенсационный фонд."
      showBreadcrumbs={false}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-beige-50 to-beige-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              СРО Арбитражных Управляющих
            </h1>
            <p className="text-xl text-neutral-700 mb-8 max-w-3xl mx-auto">
              Саморегулируемая организация арбитражных управляющих, обеспечивающая высокие стандарты 
              профессиональной деятельности в сфере несостоятельности (банкротства).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registry" className="btn-primary text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2 inline" />
                Поиск в реестре
              </Link>
              <Link href="/compensation-fund" className="btn-outline text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto">
                <DocumentTextIcon className="h-5 w-5 mr-2 inline" />
                Компенсационный фонд
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Быстрый доступ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent>
                <UserGroupIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Реестр АУ
                </h3>
                <p className="text-neutral-600 mb-4">
                  Поиск арбитражных управляющих по ФИО, ИНН или номеру
                </p>
                <Link href="/registry" className="btn-outline w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                  Перейти к реестру
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent>
                <BanknotesIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Компенсационный фонд
                </h3>
                <p className="text-neutral-600 mb-4">
                  Информация о размере и реквизитах фонда
                </p>
                <Link href="/compensation-fund" className="btn-outline w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                  Подробнее
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent>
                <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Нормативные документы
                </h3>
                <p className="text-neutral-600 mb-4">
                  Устав, правила и другие документы СРО
                </p>
                <Link href="/about" className="btn-outline w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                  Смотреть документы
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent>
                <MagnifyingGlassIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Контроль деятельности
                </h3>
                <p className="text-neutral-600 mb-4">
                  График проверок и результаты контроля
                </p>
                <Link href="/about" className="btn-outline w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                  Подробнее
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                О нашей организации
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                Саморегулируемая организация арбитражных управляющих объединяет профессионалов, 
                работающих в сфере несостоятельности (банкротства). Мы обеспечиваем высокие стандарты 
                профессиональной деятельности и защищаем интересы всех участников процедур банкротства.
              </p>
              <p className="text-neutral-700 mb-8">
                Наша организация создана в соответствии с требованиями федерального законодательства 
                и осуществляет свою деятельность в целях саморегулирования профессиональной деятельности 
                арбитражных управляющих.
              </p>
              <Link href="/about" className="btn-primary text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-lg">
                Подробнее об организации
              </Link>
            </div>
            <div className="bg-beige-100 rounded-lg p-8 text-center">
              <div className="text-4xl font-bold text-beige-700 mb-2">150+</div>
              <div className="text-lg text-neutral-700 mb-6">Арбитражных управляющих</div>
              <div className="text-4xl font-bold text-beige-700 mb-2">10+</div>
              <div className="text-lg text-neutral-700 mb-6">Лет успешной работы</div>
              <div className="text-4xl font-bold text-beige-700 mb-2">100%</div>
              <div className="text-lg text-neutral-700">Соответствие стандартам</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">
              Последние новости
            </h2>
            <Link href="/about" className="btn-outline text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
              Все новости
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="text-sm text-neutral-500 mb-2">
                    {new Date().toLocaleDateString('ru-RU')}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Пример новости {item}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">
                    Краткое описание новости, которое дает представление о содержании 
                    и привлекает внимание читателя.
                  </p>
                  <Button variant="ghost" size="sm">
                    Читать далее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
    </div>
      </section>
    </Layout>
  );
}
