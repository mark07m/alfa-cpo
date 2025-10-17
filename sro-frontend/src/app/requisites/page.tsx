"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import SanitizedHtml from '@/components/common/SanitizedHtml'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function RequisitesPage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('requisites')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'Реквизиты - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Банковские реквизиты и регистрационные данные саморегулируемой организации арбитражных управляющих.'
  const keywords = Array.isArray(page?.seoKeywords) ? page?.seoKeywords.join(', ') : 'реквизиты, банковские реквизиты, СРО, ОГРН, ИНН, КПП'

  if (page?.content) {
    return (
      <Layout title={title} description={description} keywords={keywords}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-neutral-900 mb-6">
              {page.title}
            </h1>
          </div>
          <SanitizedHtml html={page.content} className="prose" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Реквизиты организации
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Полные банковские реквизиты и регистрационные данные 
            саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 text-beige-600 mr-3" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Регистрационные данные
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Полное наименование</h3>
                  <p className="text-neutral-700">
                    Саморегулируемая организация арбитражных управляющих
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">ОГРН</h3>
                    <p className="text-neutral-700 font-mono">1234567890123</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">ИНН</h3>
                    <p className="text-neutral-700 font-mono">1234567890</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">КПП</h3>
                    <p className="text-neutral-700 font-mono">123456789</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">ОКПО</h3>
                    <p className="text-neutral-700 font-mono">12345678</p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Юридический адрес</h3>
                  <p className="text-neutral-700">
                    101000, г. Москва, ул. Тверская, д. 12, стр. 1<br />
                    Бизнес-центр "Тверской", офис 501
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <BanknotesIcon className="h-6 w-6 text-beige-600 mr-3" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Банковские реквизиты
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Банк</h3>
                  <p className="text-neutral-700">
                    ПАО "Сбербанк"<br />
                    г. Москва
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Расчетный счет</h3>
                    <p className="text-neutral-700 font-mono text-lg">40702810123456789012</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Корреспондентский счет</h3>
                    <p className="text-neutral-700 font-mono">30101810400000000225</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">БИК</h3>
                    <p className="text-neutral-700 font-mono">044525225</p>
                  </div>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="font-semibold text-neutral-900 mb-2">Назначение платежа</h3>
                  <p className="text-neutral-700 text-sm">
                    Членский взнос в СРО арбитражных управляющих
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compensation Fund Details */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-beige-600 mr-3" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Реквизиты компенсационного фонда
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-beige-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-neutral-900 mb-2">Размер фонда</h3>
                    <p className="text-2xl font-bold text-beige-700">7 500 000 ₽</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      По состоянию на 01.12.2023
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">Банк компенсационного фонда</h3>
                    <p className="text-neutral-700">
                      ПАО "Сбербанк"<br />
                      г. Москва
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Счет компенсационного фонда</h3>
                    <p className="text-neutral-700 font-mono text-lg">40702810123456789013</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Корреспондентский счет</h3>
                    <p className="text-neutral-700 font-mono">30101810400000000225</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">БИК</h3>
                    <p className="text-neutral-700 font-mono">044525225</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">ИНН банка</h3>
                    <p className="text-neutral-700 font-mono">7707083893</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-beige-600 mr-3" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Дополнительная информация
                </h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Руководитель</h3>
                  <p className="text-neutral-700">
                    Иванов Иван Иванович<br />
                    Президент СРО АУ
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Главный бухгалтер</h3>
                  <p className="text-neutral-700">
                    Петрова Анна Сергеевна<br />
                    Главный бухгалтер
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Дата регистрации</h3>
                  <p className="text-neutral-700">15.03.2014</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Статус</h3>
                  <p className="text-neutral-700">Действующая организация</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline">
              Скачать реквизиты (PDF)
            </Button>
            <Button variant="outline">
              Распечатать реквизиты
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
