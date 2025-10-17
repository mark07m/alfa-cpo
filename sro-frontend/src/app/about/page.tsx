"use client";
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { BuildingOfficeIcon, UserGroupIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import SanitizedHtml from '@/components/common/SanitizedHtml'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function AboutPage() {
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('about')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const title = page?.seoTitle || 'Об Ассоциации - СРО Арбитражных Управляющих'
  const description = page?.seoDescription || 'Информация о саморегулируемой организации арбитражных управляющих: история, руководство, структура управления.'

  return (
    <Layout
      title={title}
      description={description}
      keywords="СРО, ассоциация, арбитражные управляющие, руководство, история"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            О нашей Ассоциации
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Саморегулируемая организация арбитражных управляющих объединяет профессионалов, 
            работающих в сфере несостоятельности (банкротства) и обеспечивает высокие стандарты 
            профессиональной деятельности.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          <div className="lg:col-span-2">
            {page?.content ? (
              <SanitizedHtml html={page.content} className="prose" />
            ) : (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Наша миссия</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Саморегулируемая организация арбитражных управляющих создана в соответствии 
                      с требованиями федерального законодательства о несостоятельности (банкротстве) 
                      и осуществляет свою деятельность в целях саморегулирования профессиональной 
                      деятельности арбитражных управляющих.
                    </p>
                    <p className="mb-4">Основными целями деятельности Ассоциации являются:</p>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Обеспечение высоких стандартов профессиональной деятельности арбитражных управляющих</li>
                      <li>Защита прав и законных интересов членов Ассоциации</li>
                      <li>Содействие развитию института несостоятельности (банкротства)</li>
                      <li>Повышение квалификации арбитражных управляющих</li>
                      <li>Контроль за соблюдением членами Ассоциации требований законодательства</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="text-center">
              <UserGroupIcon className="h-8 w-8 text-beige-600 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-2">Руководство</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Информация о руководящих органах Ассоциации
              </p>
              <a 
                href="/about/leadership" 
                className="text-beige-600 hover:text-beige-700 text-sm font-medium"
              >
                Подробнее →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="text-center">
              <CalendarIcon className="h-8 w-8 text-beige-600 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-2">История</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Подробная история развития Ассоциации
              </p>
              <a 
                href="/about/history" 
                className="text-beige-600 hover:text-beige-700 text-sm font-medium"
              >
                Подробнее →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="text-center">
              <BuildingOfficeIcon className="h-8 w-8 text-beige-600 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-2">Структура</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Организационная структура управления
              </p>
              <a 
                href="/about/structure" 
                className="text-beige-600 hover:text-beige-700 text-sm font-medium"
              >
                Подробнее →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="text-center">
              <DocumentTextIcon className="h-8 w-8 text-beige-600 mx-auto mb-3" />
              <h3 className="font-semibold text-neutral-900 mb-2">Документы</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Учредительные и нормативные документы
              </p>
              <a 
                href="/documents/regulatory" 
                className="text-beige-600 hover:text-beige-700 text-sm font-medium"
              >
                Подробнее →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
