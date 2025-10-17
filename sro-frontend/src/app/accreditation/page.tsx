'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DocumentList, DocumentViewer } from '@/components/documents';
import { Document } from '@/types';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import SanitizedHtml from '@/components/common/SanitizedHtml'
import { pagesService } from '@/services/pages'
import type { PageData } from '@/services/pages'
import { accreditedOrganizationsService, type AccreditedOrganizationItem, type AccreditedOrganizationStats } from '@/services/accreditedOrganizations'

export default function AccreditationPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [page, setPage] = useState<PageData | null>(null)
  const [stats, setStats] = useState<AccreditedOrganizationStats | null>(null)
  const [organizations, setOrganizations] = useState<AccreditedOrganizationItem[]>([])
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingOrgs, setLoadingOrgs] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const PAGE_SIZE = 5

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await pagesService.getBySlug('accreditation')
        if (!cancelled && res.success) setPage(res.data)
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadStats = async () => {
      try {
        setLoadingStats(true)
        const res = await accreditedOrganizationsService.stats()
        if (!cancelled && res.success) setStats(res.data)
      } catch (e) {
        if (!cancelled) setError('Не удалось загрузить статистику')
      } finally {
        if (!cancelled) setLoadingStats(false)
      }
    }
    loadStats()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadList = async () => {
      try {
        setLoadingOrgs(true)
        const res = await accreditedOrganizationsService.list({ page: currentPage, limit: PAGE_SIZE })
        if (!cancelled && res.success) {
          setOrganizations(res.data.data)
          setTotalPages(res.data.pagination.totalPages || 0)
        }
      } catch (e) {
        if (!cancelled) setError('Не удалось загрузить список организаций')
      } finally {
        if (!cancelled) setLoadingOrgs(false)
      }
    }
    loadList()
    return () => { cancelled = true }
  }, [currentPage])

  function formatDate(dateLike?: string) {
    if (!dateLike) return '-'
    try {
      const d = new Date(dateLike)
      if (isNaN(d.getTime())) return dateLike
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}.${mm}.${yyyy}`
    } catch {
      return dateLike
    }
  }

  function formatAccType(type?: string) {
    switch (type) {
      case 'assessment':
        return 'Оценочная организация'
      case 'educational':
        return 'Учебный центр'
      case 'training':
        return 'Учебный центр'
      case 'other':
        return 'Другая организация'
      default:
        return type || '-'
    }
  }

  function formatStatus(status?: string) {
    switch (status) {
      case 'active':
        return 'Действующая'
      case 'suspended':
        return 'Приостановлена'
      case 'revoked':
        return 'Отозвана'
      case 'expired':
        return 'Истекла'
      default:
        return status || '-'
    }
  }

  const documents: Document[] = [
    {
      id: 'accreditation-rules',
      title: 'Правила аккредитации',
      description: 'Положение о порядке аккредитации организаций и специалистов',
      category: 'accreditation' as const,
      fileUrl: '/documents/pravila-akkreditacii.pdf',
      fileSize: 250880,
      fileType: 'pdf',
      uploadedAt: '2023-06-15T00:00:00Z',
      updatedAt: '2023-06-15T00:00:00Z',
      version: '2.0'
    },
    {
      id: 'accreditation-application',
      title: 'Заявление на аккредитацию',
      description: 'Образец заявления для подачи документов',
      category: 'accreditation' as const,
      fileUrl: '/documents/zayavlenie-akkreditaciya.doc',
      fileSize: 91136,
      fileType: 'doc',
      uploadedAt: '2023-05-20T00:00:00Z',
      updatedAt: '2023-05-20T00:00:00Z',
      version: '1.1'
    },
    {
      id: 'document-list',
      title: 'Перечень документов',
      description: 'Список необходимых документов для аккредитации',
      category: 'accreditation' as const,
      fileUrl: '/documents/perechen-dokumentov-akkreditaciya.pdf',
      fileSize: 159744,
      fileType: 'pdf',
      uploadedAt: '2023-04-10T00:00:00Z',
      updatedAt: '2023-04-10T00:00:00Z',
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
      title={page?.seoTitle || 'Аккредитация - СРО АУ'}
      description={page?.seoDescription || 'Информация об аккредитации в СРО: правила, процедура, список аккредитованных организаций.'}
      keywords={(Array.isArray(page?.seoKeywords) ? page?.seoKeywords.join(', ') : undefined) || 'аккредитация, СРО, процедура, правила, организации'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            {page?.title || 'Аккредитация в СРО'}
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о процедуре аккредитации организаций и специалистов 
            при саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        {/* Accreditation Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {page?.content ? (
              <SanitizedHtml html={page.content} className="prose" />
            ) : (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                    О процедуре аккредитации
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Саморегулируемая организация арбитражных управляющих проводит аккредитацию 
                      организаций и специалистов, деятельность которых связана с процедурами 
                      несостоятельности (банкротства).
                    </p>
                    <p className="mb-4">
                      Аккредитация позволяет организациям и специалистам участвовать в процедурах 
                      банкротства в качестве экспертов, оценщиков, аудиторов и других участников 
                      процесса.
                    </p>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      Кто может быть аккредитован:
                    </h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Оценочные организации</li>
                      <li>Аудиторские компании</li>
                      <li>Страховые организации</li>
                      <li>Учебные центры</li>
                      <li>Консалтинговые компании</li>
                      <li>Индивидуальные специалисты</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg transition-shadow duration-200 bg-white border border-neutral-200 p-6">
              <div className="space-y-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-12 w-12 text-beige-600 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"></path>
                </svg>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Аккредитованных организаций</h3>
                <p className="text-2xl font-bold text-beige-700 mb-2">{stats ? stats.active : '—'}</p>
                <p className="text-sm text-neutral-600">действующих</p>
              </div>
            </div>

            <div className="rounded-lg transition-shadow duration-200 bg-white border border-neutral-200 p-6">
              <div className="space-y-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-12 w-12 text-beige-600 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"></path>
                </svg>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Срок аккредитации</h3>
                <p className="text-neutral-600">3 года</p>
              </div>
            </div>

            <div className="rounded-lg transition-shadow duration-200 bg-white border border-neutral-200 p-6">
              <div className="space-y-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-12 w-12 text-beige-600 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Документы</h3>
                <p className="text-sm text-neutral-600 mb-3">Правила аккредитации</p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">Скачать PDF</button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Accredited Organizations */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Поиск аккредитованных организаций
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Название организации"
                placeholder="Введите название"
                leftIcon={<BuildingOfficeIcon className="h-5 w-5" />}
              />
              <Input
                label="Вид деятельности"
                placeholder="Выберите вид деятельности"
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 sm:flex-none">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Найти
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accredited Organizations List */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                Аккредитованные организации
              </h2>
              <span className="text-sm text-neutral-600">
                Всего: {stats ? stats.total : '—'} организаций
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingOrgs && (
                <div className="text-sm text-neutral-600">Загрузка...</div>
              )}
              {!loadingOrgs && organizations.length === 0 && (
                <div className="text-sm text-neutral-600">Нет данных</div>
              )}
              {!loadingOrgs && organizations.map((org) => (
                <div
                  key={org.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 mr-3">
                          {org.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          {formatStatus(org.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                        <div>
                          <span className="font-medium">Вид деятельности:</span>
                          <p className="text-neutral-900">{formatAccType(org.type)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Дата аккредитации:</span>
                          <p className="text-neutral-900">{formatDate(org.accreditationDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium">Срок действия до:</span>
                          <p className="text-neutral-900">{formatDate(org.accreditationExpiryDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Предыдущая
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === currentPage ? undefined : 'outline'}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Следующая
                  </Button>
                </nav>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accreditation Procedure */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Процедура аккредитации
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Требования к заявителям
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Наличие лицензии на соответствующий вид деятельности
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Опыт работы не менее 3 лет в соответствующей сфере
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Отсутствие нарушений законодательства
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Наличие квалифицированных специалистов
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Этапы процедуры
                </h3>
                <ol className="space-y-2 text-neutral-700">
                  <li className="flex items-start">
                    <span className="bg-beige-100 text-beige-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0">1</span>
                    Подача заявления и документов
                  </li>
                  <li className="flex items-start">
                    <span className="bg-beige-100 text-beige-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0">2</span>
                    Рассмотрение документов (30 дней)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-beige-100 text-beige-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0">3</span>
                    Проверка соответствия требованиям
                  </li>
                  <li className="flex items-start">
                    <span className="bg-beige-100 text-beige-800 text-sm font-medium px-2 py-1 rounded-full mr-3 mt-0.5 flex-shrink-0">4</span>
                    Принятие решения о аккредитации
                  </li>
                </ol>
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
