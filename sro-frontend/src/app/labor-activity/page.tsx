'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { DocumentList, DocumentViewer } from '@/components/documents';
import { Document } from '@/types';
import { 
  BriefcaseIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'

export default function LaborActivityPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('labor-activity')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const documents: Document[] = [
    {
      id: 'placement-instruction',
      title: 'Инструкция по размещению сведений',
      description: 'Пошаговая инструкция по размещению сведений о трудовой деятельности',
      category: 'labor-activity' as const,
      fileUrl: '/documents/instrukciya-razmeschenie-svedenij.pdf',
      fileSize: 1258291,
      fileType: 'pdf',
      uploadedAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
      version: '1.0'
    },
    {
      id: 'labor-certificate-template',
      title: 'Образец справки о трудовой деятельности',
      description: 'Шаблон справки для получения у работодателя',
      category: 'labor-activity' as const,
      fileUrl: '/documents/obrazec-spravki-trudovaya-deyatelnost.doc',
      fileSize: 91136,
      fileType: 'doc',
      uploadedAt: '2023-11-15T00:00:00Z',
      updatedAt: '2023-11-15T00:00:00Z',
      version: '2.0'
    },
    {
      id: 'document-requirements',
      title: 'Требования к документам',
      description: 'Список требований к оформлению документов',
      category: 'labor-activity' as const,
      fileUrl: '/documents/trebovaniya-k-dokumentam.pdf',
      fileSize: 466944,
      fileType: 'pdf',
      uploadedAt: '2023-10-20T00:00:00Z',
      updatedAt: '2023-10-20T00:00:00Z',
      version: '1.1'
    },
    {
      id: 'faq-labor-activity',
      title: 'Часто задаваемые вопросы',
      description: 'Ответы на наиболее частые вопросы по трудовой деятельности',
      category: 'labor-activity' as const,
      fileUrl: '/documents/faq-trudovaya-deyatelnost.pdf',
      fileSize: 239616,
      fileType: 'pdf',
      uploadedAt: '2023-09-10T00:00:00Z',
      updatedAt: '2023-09-10T00:00:00Z',
      version: '1.0'
    },
    {
      id: 'labor-activity-regulation',
      title: 'Положение о трудовой деятельности',
      description: 'Внутреннее положение СРО о требованиях к трудовой деятельности',
      category: 'labor-activity' as const,
      fileUrl: '/documents/polozhenie-trudovaya-deyatelnost.pdf',
      fileSize: 694272,
      fileType: 'pdf',
      uploadedAt: '2023-08-05T00:00:00Z',
      updatedAt: '2023-08-05T00:00:00Z',
      version: '3.0'
    },
    {
      id: 'contact-information',
      title: 'Контактная информация',
      description: 'Контакты ответственных лиц для консультаций',
      category: 'labor-activity' as const,
      fileUrl: '/documents/kontaktnaya-informaciya.pdf',
      fileSize: 125952,
      fileType: 'pdf',
      uploadedAt: '2023-07-20T00:00:00Z',
      updatedAt: '2023-07-20T00:00:00Z',
      version: '1.0'
    }
  ];

  const handleDownload = (doc: Document) => {
    const link = window.document.createElement('a');
    link.href = doc.fileUrl;
    link.download = doc.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handlePrint = (doc: Document) => {
    window.open(doc.fileUrl, '_blank');
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
  };

  return (
    <Layout
      title={page?.seoTitle || 'Трудовая деятельность - СРО АУ'}
      description={page?.seoDescription || 'Информация о трудовой деятельности арбитражных управляющих: требования, документы, процедуры.'}
      keywords={(Array.isArray(page?.seoKeywords) ? page?.seoKeywords.join(', ') : undefined) || 'трудовая деятельность, арбитражные управляющие, стаж, документы'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            {page?.title || 'Трудовая деятельность арбитражных управляющих'}
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о требованиях к трудовой деятельности арбитражных управляющих, 
            порядке подтверждения стажа и необходимых документах.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Важная информация
              </h3>
              <p className="text-amber-700">
                Сведения о трудовой деятельности арбитражных управляющих должны быть размещены 
                в федеральном реестре в соответствии с требованиями законодательства. 
                Подробная информация о процедуре размещения сведений представлена ниже.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {page?.content ? (
          <div className="prose mb-12" dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    {page?.title || 'Требования к трудовой деятельности'}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      В соответствии с Федеральным законом "О несостоятельности (банкротстве)" 
                      арбитражные управляющие обязаны размещать сведения о своей трудовой деятельности 
                      в федеральном реестре.
                    </p>
                    <p className="mb-4">
                      Данные сведения включают информацию о местах работы, должностях, периодах 
                      трудовой деятельности и иных сведениях, необходимых для подтверждения 
                      профессионального опыта.
                    </p>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Обязательные сведения для размещения:
                    </h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Места работы за последние 5 лет</li>
                      <li>Занимаемые должности и периоды работы</li>
                      <li>Образование и квалификация</li>
                      <li>Профессиональный опыт в сфере банкротства</li>
                      <li>Участие в процедурах несостоятельности</li>
                      <li>Дополнительное образование и повышение квалификации</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="text-center">
                  <BriefcaseIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Минимальный стаж
                  </h3>
                  <p className="text-2xl font-bold text-beige-700 mb-2">5 лет</p>
                  <p className="text-sm text-neutral-600">в сфере банкротства</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Срок обновления
                  </h3>
                  <p className="text-neutral-600">Ежемесячно</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="text-center">
                  <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Документы
                  </h3>
                  <p className="text-sm text-neutral-600 mb-3">
                    Инструкция по размещению
                  </p>
                  <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                    Скачать PDF
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Procedure Steps removed to avoid duplication with CMS content */}

        {/* Federal Registry Info */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Федеральный реестр
            </h2>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Официальный сайт федерального реестра
                  </h3>
                  <p className="text-blue-700 mb-3">
                    Сведения о трудовой деятельности размещаются в едином федеральном реестре 
                    сведений о банкротстве на официальном сайте Федеральной службы государственной регистрации, 
                    кадастра и картографии.
                  </p>
                  <a 
                    href="https://bankrot.fedresurs.ru" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Перейти на сайт реестра
                  </a>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  Контактная информация
                </h3>
                <div className="space-y-2 text-neutral-700">
                  <p><span className="font-medium">Телефон:</span> +7 (495) 123-45-67</p>
                  <p><span className="font-medium">Email:</span> registry@sro-au.ru</p>
                  <p><span className="font-medium">Адрес:</span> г. Москва, ул. Примерная, д. 1</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                  Часы работы
                </h3>
                <div className="space-y-2 text-neutral-700">
                  <p><span className="font-medium">Понедельник - Пятница:</span> 9:00 - 18:00</p>
                  <p><span className="font-medium">Суббота:</span> 10:00 - 15:00</p>
                  <p><span className="font-medium">Воскресенье:</span> Выходной</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <DocumentList
          documents={documents}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onPreview={handlePreview}
          showSearch={true}
          showFilters={true}
        />

        {/* Document Viewer Modal */}
        {selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            showDownload={true}
            showPrint={true}
          />
        )}
      </div>
    </Layout>
  );
}
