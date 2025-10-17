"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { UserGroupIcon, AcademicCapIcon, BriefcaseIcon, StarIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function LeadershipPage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('about/leadership')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'Руководство - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Информация о руководящих органах саморегулируемой организации арбитражных управляющих: правление, президент, комитеты.'

  return (
    <Layout
      title={title}
      description={description}
      keywords="руководство, СРО, арбитражные управляющие, правление, президент, комитеты"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Руководство Ассоциации
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о руководящих органах саморегулируемой организации арбитражных управляющих
          </p>
        </div>

        {/* President Section or CMS content */}
        {page?.content ? (
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <Card className="mb-12">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center">
                <StarIcon className="h-8 w-8 text-beige-600 mr-3" />
                Президент Ассоциации
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="bg-neutral-100 rounded-lg p-6 text-center">
                    <div className="w-32 h-32 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <UserGroupIcon className="h-16 w-16 text-beige-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Иванов Иван Иванович
                    </h3>
                    <p className="text-beige-600 font-medium">Президент СРО АУ</p>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="prose">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Образование и опыт</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Высшее юридическое образование (МГУ им. М.В. Ломоносова, 1995)</li>
                      <li>Кандидат юридических наук по специальности "Гражданское право"</li>
                      <li>Опыт работы арбитражным управляющим более 20 лет</li>
                      <li>Член СРО с 2014 года</li>
                    </ul>
                    
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Профессиональные достижения</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-2">
                      <li>Автор более 50 научных публикаций по вопросам банкротства</li>
                      <li>Участник разработки федеральных стандартов деятельности арбитражных управляющих</li>
                      <li>Эксперт по вопросам несостоятельности (банкротства)</li>
                      <li>Награжден почетными грамотами Минэкономразвития России</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {page?.content ? null : (
        <>
        {/* Board of Directors */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-beige-600 mr-3" />
              Правление Ассоциации
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Петров Петр Петрович</h3>
                  <p className="text-sm text-beige-600 mb-2">Вице-президент</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 18 лет</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Сидоров Сидор Сидорович</h3>
                  <p className="text-sm text-beige-600 mb-2">Член правления</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 15 лет</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Козлов Козел Козлович</h3>
                  <p className="text-sm text-beige-600 mb-2">Член правления</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 12 лет</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Волков Волк Волкович</h3>
                  <p className="text-sm text-beige-600 mb-2">Член правления</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 14 лет</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Медведев Медведь Медведевич</h3>
                  <p className="text-sm text-beige-600 mb-2">Член правления</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 16 лет</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <div className="w-20 h-20 bg-beige-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-beige-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Орлов Орел Орлович</h3>
                  <p className="text-sm text-beige-600 mb-2">Член правления</p>
                  <p className="text-xs text-neutral-600">Опыт работы: 13 лет</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Committees */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6 flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-beige-600 mr-3" />
              Комитеты и комиссии
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900">Комитет по этике</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">
                    Рассматривает вопросы соблюдения этических норм и профессиональной этики 
                    арбитражными управляющими.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900">Председатель:</p>
                    <p className="text-sm text-neutral-600">Петров Петр Петрович</p>
                    <p className="text-sm font-medium text-neutral-900">Состав:</p>
                    <p className="text-sm text-neutral-600">5 членов</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900">Комитет по контролю</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">
                    Осуществляет контроль за соблюдением членами Ассоциации требований 
                    законодательства и внутренних документов.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900">Председатель:</p>
                    <p className="text-sm text-neutral-600">Сидоров Сидор Сидорович</p>
                    <p className="text-sm font-medium text-neutral-900">Состав:</p>
                    <p className="text-sm text-neutral-600">7 членов</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900">Комитет по образованию</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">
                    Разрабатывает программы повышения квалификации и организует 
                    образовательные мероприятия для членов Ассоциации.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900">Председатель:</p>
                    <p className="text-sm text-neutral-600">Козлов Козел Козлович</p>
                    <p className="text-sm font-medium text-neutral-900">Состав:</p>
                    <p className="text-sm text-neutral-600">6 членов</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900">Ревизионная комиссия</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4">
                    Осуществляет контроль за финансово-хозяйственной деятельностью 
                    Ассоциации и использованием средств компенсационного фонда.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900">Председатель:</p>
                    <p className="text-sm text-neutral-600">Волков Волк Волкович</p>
                    <p className="text-sm font-medium text-neutral-900">Состав:</p>
                    <p className="text-sm text-neutral-600">3 члена</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Контактная информация руководства
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Президент Ассоциации</h3>
                <div className="space-y-2">
                  <p className="text-neutral-600">
                    <span className="font-medium">Телефон:</span> +7 (495) 123-45-67
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Email:</span> president@sro-au.ru
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Приемные часы:</span> Пн-Пт, 10:00-18:00
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Секретариат</h3>
                <div className="space-y-2">
                  <p className="text-neutral-600">
                    <span className="font-medium">Телефон:</span> +7 (495) 123-45-68
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Email:</span> secretariat@sro-au.ru
                  </p>
                  <p className="text-neutral-600">
                    <span className="font-medium">Приемные часы:</span> Пн-Пт, 9:00-18:00
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </Layout>
  );
}
