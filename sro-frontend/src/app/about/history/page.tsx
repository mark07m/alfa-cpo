"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { CalendarIcon, ChartBarIcon, TrophyIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import SanitizedHtml from '@/components/common/SanitizedHtml'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function HistoryPage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('about/history')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'История - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Подробная история развития саморегулируемой организации арбитражных управляющих с 2014 года.'

  return (
    <Layout
      title={title}
      description={description}
      keywords="история, СРО, арбитражные управляющие, развитие, этапы, достижения"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            История Ассоциации
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Подробная история развития саморегулируемой организации арбитражных управляющих
          </p>
        </div>

        {/* Timeline from CMS or fallback */}
        {page?.content ? (
          <SanitizedHtml html={page.content} className="prose" />
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-8 text-center">
              Основные этапы развития
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-beige-300"></div>
              <div className="space-y-12">
                {/* 2014 */}
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center z-10">
                    <CalendarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-neutral-900">2014 год - Основание</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="prose">
                          <p className="mb-4">
                            Саморегулируемая организация арбитражных управляющих была создана 
                            группой опытных профессионалов, объединившихся для повышения качества 
                            профессиональной деятельности в сфере несостоятельности (банкротства).
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Регистрация в качестве СРО в Минюсте России</li>
                            <li>Формирование первоначального состава из 25 арбитражных управляющих</li>
                            <li>Принятие Устава и внутренних документов</li>
                            <li>Создание компенсационного фонда</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* 2015-2016 */}
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center z-10">
                    <ChartBarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-neutral-900">2015-2016 годы - Становление</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="prose">
                          <p className="mb-4">
                            Период активного развития и формирования основных направлений деятельности. 
                            Ассоциация зарекомендовала себя как надежный партнер в сфере банкротства.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Расширение состава до 75 арбитражных управляющих</li>
                            <li>Создание системы контроля качества деятельности членов</li>
                            <li>Разработка программ повышения квалификации</li>
                            <li>Участие в разработке федеральных стандартов</li>
                            <li>Проведение первых образовательных семинаров</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* 2017-2018 */}
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center z-10">
                    <TrophyIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-neutral-900">2017-2018 годы - Признание</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="prose">
                          <p className="mb-4">
                            Ассоциация получила признание в профессиональном сообществе и 
                            государственных органах. Были достигнуты значительные результаты 
                            в области повышения качества профессиональной деятельности.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Достижение состава в 100+ арбитражных управляющих</li>
                            <li>Получение аккредитации в Минэкономразвития России</li>
                            <li>Создание собственного образовательного центра</li>
                            <li>Разработка Кодекса этики арбитражных управляющих</li>
                            <li>Проведение первой всероссийской конференции</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* 2019-2021 */}
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center z-10">
                    <DocumentTextIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-neutral-900">2019-2021 годы - Развитие</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="prose">
                          <p className="mb-4">
                            Период активного развития цифровых технологий и совершенствования 
                            системы управления. Ассоциация стала одним из лидеров в области 
                            саморегулирования арбитражных управляющих.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Внедрение электронного документооборота</li>
                            <li>Создание единой информационной системы</li>
                            <li>Развитие системы дистанционного обучения</li>
                            <li>Участие в разработке федерального реестра</li>
                            <li>Проведение международных конференций</li>
                            <li>Создание методических рекомендаций</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* 2022-2024 */}
                <div className="relative flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-beige-600 rounded-full flex items-center justify-center z-10">
                    <ChartBarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="ml-6">
                    <Card>
                      <CardHeader>
                        <h3 className="text-xl font-semibold text-neutral-900">2022-2024 годы - Современность</h3>
                      </CardHeader>
                      <CardContent>
                        <div className="prose">
                          <p className="mb-4">
                            Современный этап развития Ассоциации, характеризующийся высоким 
                            уровнем профессионализма, инновационными подходами и активным 
                            участием в формировании отраслевой политики.
                          </p>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Достижение состава в 150+ арбитражных управляющих</li>
                            <li>Создание мобильного приложения для членов СРО</li>
                            <li>Внедрение системы электронного голосования</li>
                            <li>Развитие международного сотрудничества</li>
                            <li>Создание центра экспертизы и консультаций</li>
                            <li>Проведение онлайн-мероприятий и вебинаров</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page?.content ? null : (
        <>
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Ключевые достижения
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-beige-600">150+</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Членов СРО</h3>
                <p className="text-sm text-neutral-600">Арбитражных управляющих</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-beige-600">10</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Лет работы</h3>
                <p className="text-sm text-neutral-600">С 2014 года</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-beige-600">500+</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Мероприятий</h3>
                <p className="text-sm text-neutral-600">Образовательных</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-beige-600">50+</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Публикаций</h3>
                <p className="text-sm text-neutral-600">Научных работ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Награды и признание
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Государственные награды</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <TrophyIcon className="h-5 w-5 text-beige-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Почетная грамота Минэкономразвития России</p>
                      <p className="text-sm text-neutral-600">2018 год - за вклад в развитие института банкротства</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <TrophyIcon className="h-5 w-5 text-beige-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Благодарность Правительства РФ</p>
                      <p className="text-sm text-neutral-600">2020 год - за участие в разработке федеральных стандартов</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Профессиональное признание</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <TrophyIcon className="h-5 w-5 text-beige-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Лучшая СРО года</p>
                      <p className="text-sm text-neutral-600">2021 год - по версии отраслевого журнала</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <TrophyIcon className="h-5 w-5 text-beige-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Инновации в образовании</p>
                      <p className="text-sm text-neutral-600">2023 год - за развитие дистанционного обучения</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Планы на будущее
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <p className="mb-4">
                Ассоциация продолжает активно развиваться и совершенствовать свою деятельность. 
                В ближайшие годы планируется:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Расширение географии деятельности и привлечение новых членов</li>
                <li>Развитие цифровых технологий и автоматизации процессов</li>
                <li>Углубление международного сотрудничества</li>
                <li>Создание новых образовательных программ и методик</li>
                <li>Участие в разработке законодательных инициатив</li>
                <li>Развитие системы профессиональной сертификации</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </Layout>
  );
}
