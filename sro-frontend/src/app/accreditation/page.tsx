'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DocumentList, DocumentViewer } from '@/components/documents';
import { Document } from '@/types';
import { 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AccreditationPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

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

  const handleDownload = (document: Document) => {
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (document: Document) => {
    window.open(document.fileUrl, '_blank');
  };

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
  };

  return (
    <Layout
      title="Аккредитация - СРО АУ"
      description="Информация об аккредитации в СРО: правила, процедура, список аккредитованных организаций."
      keywords="аккредитация, СРО, процедура, правила, организации"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Аккредитация в СРО
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о процедуре аккредитации организаций и специалистов 
            при саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        {/* Accreditation Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
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
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="text-center">
                <AcademicCapIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Аккредитованных организаций
                </h3>
                <p className="text-2xl font-bold text-beige-700 mb-2">25</p>
                <p className="text-sm text-neutral-600">действующих</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Срок аккредитации
                </h3>
                <p className="text-neutral-600">3 года</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Документы
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Правила аккредитации
                </p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                  Скачать PDF
                </button>
              </CardContent>
            </Card>
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
                Всего: 25 организаций
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Organizations */}
              {[
                {
                  name: "ООО 'Эксперт-Оценка'",
                  type: "Оценочная организация",
                  accreditationDate: "15.03.2022",
                  expiryDate: "15.03.2025",
                  status: "Действующая"
                },
                {
                  name: "АО 'Аудит-Партнер'",
                  type: "Аудиторская компания",
                  accreditationDate: "22.01.2023",
                  expiryDate: "22.01.2026",
                  status: "Действующая"
                },
                {
                  name: "ООО 'Страхование-Гарант'",
                  type: "Страховая организация",
                  accreditationDate: "10.06.2021",
                  expiryDate: "10.06.2024",
                  status: "Действующая"
                },
                {
                  name: "Центр повышения квалификации 'Профессионал'",
                  type: "Учебный центр",
                  accreditationDate: "05.09.2022",
                  expiryDate: "05.09.2025",
                  status: "Действующая"
                },
                {
                  name: "ООО 'Консалт-Банкротство'",
                  type: "Консалтинговая компания",
                  accreditationDate: "18.11.2023",
                  expiryDate: "18.11.2026",
                  status: "Действующая"
                }
              ].map((org, index) => (
                <div 
                  key={index}
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
                          {org.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                        <div>
                          <span className="font-medium">Вид деятельности:</span>
                          <p className="text-neutral-900">{org.type}</p>
                        </div>
                        <div>
                          <span className="font-medium">Дата аккредитации:</span>
                          <p className="text-neutral-900">{org.accreditationDate}</p>
                        </div>
                        <div>
                          <span className="font-medium">Срок действия до:</span>
                          <p className="text-neutral-900">{org.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
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
