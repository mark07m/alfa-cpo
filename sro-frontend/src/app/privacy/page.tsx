"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function PrivacyPolicyPage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('privacy')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'Политика конфиденциальности - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Политика конфиденциальности и обработки персональных данных саморегулируемой организации арбитражных управляющих.'
  const keywords = Array.isArray(page?.seoKeywords) ? page?.seoKeywords.join(', ') : 'политика конфиденциальности, персональные данные, СРО, обработка данных'

  if (page?.content) {
    return (
      <Layout title={title} description={description} keywords={keywords}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <ShieldCheckIcon className="h-16 w-16 text-beige-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-neutral-900 mb-6">{page.title}</h1>
          </div>
          <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <ShieldCheckIcon className="h-16 w-16 text-beige-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Политика конфиденциальности
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Настоящая Политика конфиденциальности определяет порядок обработки 
            персональных данных пользователей сайта СРО арбитражных управляющих.
          </p>
        </div>

        <div className="space-y-8">
          {/* General Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                1. Общие положения
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет 
                  порядок обработки персональных данных пользователей сайта саморегулируемой 
                  организации арбитражных управляющих (далее — «СРО», «Организация»).
                </p>
                <p className="text-neutral-700 mb-4">
                  Использование сайта означает согласие пользователя с настоящей Политикой 
                  и указанными в ней условиями обработки персональной информации.
                </p>
                <p className="text-neutral-700">
                  В случае несогласия с условиями Политики пользователь должен прекратить 
                  использование сайта.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Data */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                2. Персональные данные
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  2.1. Категории персональных данных
                </h3>
                <p className="text-neutral-700 mb-4">
                  Организация может собирать следующие категории персональных данных:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Фамилия, имя, отчество</li>
                  <li>Контактная информация (телефон, адрес электронной почты)</li>
                  <li>Информация о профессиональной деятельности</li>
                  <li>Данные о членстве в СРО</li>
                  <li>Техническая информация (IP-адрес, данные браузера)</li>
                </ul>

                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  2.2. Цели обработки
                </h3>
                <p className="text-neutral-700 mb-4">
                  Персональные данные обрабатываются в следующих целях:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Предоставление информации о деятельности СРО</li>
                  <li>Ведение реестра арбитражных управляющих</li>
                  <li>Обработка обращений и запросов</li>
                  <li>Соблюдение требований законодательства</li>
                  <li>Улучшение качества предоставляемых услуг</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                3. Обработка персональных данных
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  3.1. Принципы обработки
                </h3>
                <p className="text-neutral-700 mb-4">
                  Обработка персональных данных осуществляется на основе следующих принципов:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Законности и справедливости</li>
                  <li>Соответствия целям обработки</li>
                  <li>Точности и актуальности</li>
                  <li>Минимальности и достаточности</li>
                  <li>Безопасности</li>
                </ul>

                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  3.2. Способы обработки
                </h3>
                <p className="text-neutral-700 mb-4">
                  Обработка персональных данных может осуществляться следующими способами:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Сбор, запись, систематизация</li>
                  <li>Накопление, хранение</li>
                  <li>Уточнение, обновление</li>
                  <li>Извлечение, использование</li>
                  <li>Передача, распространение</li>
                  <li>Уничтожение, блокирование</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                4. Защита персональных данных
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Организация принимает необходимые правовые, организационные и технические 
                  меры для защиты персональных данных от неправомерного или случайного доступа, 
                  уничтожения, изменения, блокирования, копирования, предоставления, 
                  распространения, а также от иных неправомерных действий.
                </p>
                <p className="text-neutral-700 mb-4">
                  Меры защиты включают в себя:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Ограничение доступа к персональным данным</li>
                  <li>Использование средств защиты информации</li>
                  <li>Контроль действий с персональными данными</li>
                  <li>Обучение сотрудников правилам обработки данных</li>
                  <li>Регулярное обновление средств защиты</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                5. Права субъектов персональных данных
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Субъект персональных данных имеет право:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Получать информацию об обработке своих персональных данных</li>
                  <li>Требовать уточнения, блокирования или уничтожения данных</li>
                  <li>Отзывать согласие на обработку персональных данных</li>
                  <li>Обращаться в уполномоченный орган по защите прав субъектов персональных данных</li>
                  <li>Защищать свои права и законные интересы в судебном порядке</li>
                </ul>
                <p className="text-neutral-700">
                  Для реализации указанных прав субъект персональных данных может обратиться 
                  в Организацию по контактным данным, указанным в разделе «Контакты».
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                6. Использование файлов cookie
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Сайт использует файлы cookie для улучшения пользовательского опыта, 
                  анализа посещаемости и персонализации контента.
                </p>
                <p className="text-neutral-700 mb-4">
                  Пользователь может настроить браузер для блокировки или удаления файлов cookie, 
                  однако это может повлиять на функциональность сайта.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                7. Контактная информация
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  По вопросам обработки персональных данных можно обращаться:
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-neutral-700 mb-2">
                    <strong>Email:</strong> privacy@sro-au.ru
                  </p>
                  <p className="text-neutral-700 mb-2">
                    <strong>Телефон:</strong> +7 (495) 123-45-67
                  </p>
                  <p className="text-neutral-700">
                    <strong>Адрес:</strong> 101000, г. Москва, ул. Тверская, д. 12, стр. 1
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Final Provisions */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                8. Заключительные положения
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Настоящая Политика может быть изменена Организацией в одностороннем порядке. 
                  Новая редакция Политики вступает в силу с момента её размещения на сайте.
                </p>
                <p className="text-neutral-700 mb-4">
                  Продолжение использования сайта после внесения изменений означает 
                  согласие с новой редакцией Политики.
                </p>
                <p className="text-neutral-700">
                  <strong>Дата последнего обновления:</strong> 01.12.2023
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
