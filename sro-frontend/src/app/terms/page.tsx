"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import { SanitizedHtml } from '@/components/common'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function TermsOfUsePage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('terms')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'Условия использования - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Условия использования сайта саморегулируемой организации арбитражных управляющих.'
  const keywords = Array.isArray(page?.seoKeywords) ? page?.seoKeywords.join(', ') : 'условия использования, пользовательское соглашение, СРО, сайт'

  if (page?.content) {
    return (
      <Layout title={title} description={description} keywords={keywords}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <DocumentTextIcon className="h-16 w-16 text-beige-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-neutral-900 mb-6">{page.title}</h1>
          </div>
          <SanitizedHtml html={page.content} className="prose prose-neutral max-w-none" />
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
          <DocumentTextIcon className="h-16 w-16 text-beige-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Условия использования
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Настоящие Условия использования определяют правила и порядок 
            использования официального сайта саморегулируемой организации 
            арбитражных управляющих.
          </p>
        </div>

        <div className="space-y-8">
          {/* General Provisions */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                1. Общие положения
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Настоящие Условия использования (далее — «Условия») определяют 
                  правила и порядок использования официального сайта саморегулируемой 
                  организации арбитражных управляющих (далее — «Сайт», «Организация»).
                </p>
                <p className="text-neutral-700 mb-4">
                  Использование Сайта означает полное и безоговорочное согласие 
                  пользователя с настоящими Условиями и всеми их положениями.
                </p>
                <p className="text-neutral-700">
                  Если пользователь не согласен с какими-либо положениями настоящих 
                  Условий, он должен прекратить использование Сайта.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Definitions */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                2. Определения
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  В настоящих Условиях используются следующие термины:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li><strong>Сайт</strong> — официальный веб-сайт СРО арбитражных управляющих</li>
                  <li><strong>Пользователь</strong> — любое физическое или юридическое лицо, использующее Сайт</li>
                  <li><strong>Контент</strong> — любая информация, размещенная на Сайте</li>
                  <li><strong>Сервисы</strong> — функциональные возможности, предоставляемые Сайтом</li>
                  <li><strong>Персональные данные</strong> — любая информация, относящаяся к пользователю</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Rights and Obligations */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                3. Права и обязанности пользователя
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  3.1. Права пользователя
                </h3>
                <p className="text-neutral-700 mb-4">
                  Пользователь имеет право:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Получать достоверную информацию о деятельности СРО</li>
                  <li>Использовать функциональные возможности Сайта в соответствии с их назначением</li>
                  <li>Обращаться к Организации с вопросами и предложениями</li>
                  <li>Получать ответы на запросы в разумные сроки</li>
                </ul>

                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  3.2. Обязанности пользователя
                </h3>
                <p className="text-neutral-700 mb-4">
                  Пользователь обязуется:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Использовать Сайт в соответствии с его назначением</li>
                  <li>Не нарушать права третьих лиц</li>
                  <li>Не размещать незаконную, вредоносную или оскорбительную информацию</li>
                  <li>Соблюдать требования законодательства Российской Федерации</li>
                  <li>Не предпринимать действий, направленных на нарушение работы Сайта</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Use of Site */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                4. Использование Сайта
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  4.1. Разрешенное использование
                </h3>
                <p className="text-neutral-700 mb-4">
                  Пользователь может использовать Сайт для:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Получения информации о деятельности СРО</li>
                  <li>Поиска информации в реестре арбитражных управляющих</li>
                  <li>Ознакомления с нормативными документами</li>
                  <li>Просмотра новостей и объявлений</li>
                  <li>Отправки обращений через форму обратной связи</li>
                </ul>

                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  4.2. Запрещенные действия
                </h3>
                <p className="text-neutral-700 mb-4">
                  Пользователю запрещается:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Использовать Сайт в противоправных целях</li>
                  <li>Пытаться получить несанкционированный доступ к системам Сайта</li>
                  <li>Распространять вредоносное программное обеспечение</li>
                  <li>Нарушать работу Сайта или его серверов</li>
                  <li>Копировать контент без разрешения</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                5. Интеллектуальная собственность
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Все материалы, размещенные на Сайте, включая тексты, изображения, 
                  дизайн, программное обеспечение, являются объектами интеллектуальной 
                  собственности и защищены законодательством Российской Федерации.
                </p>
                <p className="text-neutral-700 mb-4">
                  Пользователь не имеет права:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Копировать, воспроизводить или распространять материалы Сайта</li>
                  <li>Создавать производные произведения на основе контента Сайта</li>
                  <li>Использовать товарные знаки и логотипы без разрешения</li>
                  <li>Удалять или изменять уведомления об авторских правах</li>
                </ul>
                <p className="text-neutral-700">
                  Исключение составляют случаи, прямо предусмотренные законодательством 
                  Российской Федерации о защите интеллектуальной собственности.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                6. Ограничение ответственности
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Организация прилагает все усилия для обеспечения точности и актуальности 
                  информации, размещенной на Сайте, однако не гарантирует её полноту и 
                  безошибочность.
                </p>
                <p className="text-neutral-700 mb-4">
                  Организация не несет ответственности за:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Временные технические сбои в работе Сайта</li>
                  <li>Ущерб, причиненный в результате использования информации с Сайта</li>
                  <li>Действия третьих лиц, направленные на нарушение работы Сайта</li>
                  <li>Невозможность доступа к Сайту по техническим причинам</li>
                </ul>
                <p className="text-neutral-700">
                  Пользователь использует Сайт на свой собственный риск и под свою ответственность.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data Protection */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                7. Конфиденциальность и защита данных
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Обработка персональных данных пользователей осуществляется в соответствии 
                  с Политикой конфиденциальности и требованиями Федерального закона 
                  «О персональных данных».
                </p>
                <p className="text-neutral-700 mb-4">
                  Организация обязуется:
                </p>
                <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
                  <li>Обрабатывать персональные данные только в законных целях</li>
                  <li>Обеспечивать конфиденциальность персональных данных</li>
                  <li>Принимать меры по защите персональных данных</li>
                  <li>Не передавать персональные данные третьим лицам без согласия</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                8. Изменение Условий
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Организация оставляет за собой право в любое время изменять настоящие 
                  Условия без предварительного уведомления пользователей.
                </p>
                <p className="text-neutral-700 mb-4">
                  Изменения вступают в силу с момента их размещения на Сайте. 
                  Продолжение использования Сайта после внесения изменений означает 
                  согласие пользователя с новой редакцией Условий.
                </p>
                <p className="text-neutral-700">
                  Пользователю рекомендуется периодически проверять актуальную версию 
                  настоящих Условий.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-neutral-900">
                9. Контактная информация
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  По вопросам, связанным с использованием Сайта, можно обращаться:
                </p>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <p className="text-neutral-700 mb-2">
                    <strong>Email:</strong> info@sro-au.ru
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
                10. Заключительные положения
              </h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 mb-4">
                  Настоящие Условия регулируются законодательством Российской Федерации. 
                  Все споры подлежат рассмотрению в судах по месту нахождения Организации.
                </p>
                <p className="text-neutral-700 mb-4">
                  Если какое-либо положение настоящих Условий будет признано недействительным, 
                  остальные положения сохраняют свою силу.
                </p>
                <p className="text-neutral-700">
                  <strong>Дата последнего обновления:</strong> 01.12.2023
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Warning Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-xl font-semibold text-orange-900">
                  Важное уведомление
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800">
                Использование Сайта означает ваше согласие с настоящими Условиями. 
                Если вы не согласны с какими-либо положениями, пожалуйста, 
                прекратите использование Сайта.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
