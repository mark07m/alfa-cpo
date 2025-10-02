'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { DocumentList, DocumentCategory, DocumentViewer } from '@/components/documents';
import { Document, DocumentCategory as DocumentCategoryType } from '@/types';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function RegulatoryDocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'categories' | 'list'>('categories');

  const documentCategories: DocumentCategoryType[] = [
    {
      id: 'founding',
      name: 'Учредительные документы',
      description: 'Устав, свидетельства о регистрации, выписки из реестра',
      order: 1,
      documents: [
        {
          id: '1',
          title: 'Устав СРО Арбитражных Управляющих',
          description: 'Устав саморегулируемой организации арбитражных управляющих, редакция от 15.03.2023',
          category: 'regulatory',
          fileUrl: '/documents/ustav-sro-au.pdf',
          fileSize: 250880,
          fileType: 'pdf',
          uploadedAt: '2023-03-15T00:00:00Z',
          updatedAt: '2023-03-15T00:00:00Z',
          version: '1.2'
        },
        {
          id: '2',
          title: 'Свидетельство о государственной регистрации',
          description: 'Свидетельство о государственной регистрации юридического лица',
          category: 'regulatory',
          fileUrl: '/documents/svidetelstvo-registracii.pdf',
          fileSize: 159744,
          fileType: 'pdf',
          uploadedAt: '2014-01-10T00:00:00Z',
          updatedAt: '2014-01-10T00:00:00Z'
        },
        {
          id: '3',
          title: 'Свидетельство о постановке на налоговый учет',
          description: 'Свидетельство о постановке на учет в налоговом органе',
          category: 'regulatory',
          fileUrl: '/documents/svidetelstvo-nalog.pdf',
          fileSize: 91136,
          fileType: 'pdf',
          uploadedAt: '2014-01-10T00:00:00Z',
          updatedAt: '2014-01-10T00:00:00Z'
        },
        {
          id: '4',
          title: 'Выписка из реестра СРО АУ',
          description: 'Выписка из единого государственного реестра саморегулируемых организаций',
          category: 'regulatory',
          fileUrl: '/documents/vypiska-reestr.pdf',
          fileSize: 1258291,
          fileType: 'pdf',
          uploadedAt: '2023-12-01T00:00:00Z',
          updatedAt: '2023-12-01T00:00:00Z'
        }
      ]
    },
    {
      id: 'internal',
      name: 'Внутренние документы',
      description: 'Положения, приказы, политики организации',
      order: 2,
      documents: [
        {
          id: '5',
          title: 'Положение о компенсационном фонде',
          description: 'Положение о порядке формирования и использования компенсационного фонда',
          category: 'regulatory',
          fileUrl: '/documents/polozhenie-kompensacionnyj-fond.pdf',
          fileSize: 182272,
          fileType: 'pdf',
          uploadedAt: '2023-05-20T00:00:00Z',
          updatedAt: '2023-05-20T00:00:00Z'
        },
        {
          id: '6',
          title: 'Положение о дисциплинарной ответственности',
          description: 'Положение о порядке применения мер дисциплинарного воздействия',
          category: 'regulatory',
          fileUrl: '/documents/polozhenie-disciplinarnaya.pdf',
          fileSize: 239616,
          fileType: 'pdf',
          uploadedAt: '2023-08-15T00:00:00Z',
          updatedAt: '2023-08-15T00:00:00Z'
        },
        {
          id: '7',
          title: 'Политика обработки персональных данных',
          description: 'Политика в отношении обработки персональных данных',
          category: 'regulatory',
          fileUrl: '/documents/politika-personalnye-dannye.pdf',
          fileSize: 171008,
          fileType: 'pdf',
          uploadedAt: '2023-09-01T00:00:00Z',
          updatedAt: '2023-09-01T00:00:00Z'
        }
      ]
    },
    {
      id: 'regulatory',
      name: 'Нормативные акты',
      description: 'Федеральные законы и подзаконные акты',
      order: 3,
      documents: [
        {
          id: '8',
          title: 'ФЗ "О несостоятельности (банкротстве)"',
          description: 'Федеральный закон от 26.10.2002 № 127-ФЗ "О несостоятельности (банкротстве)"',
          category: 'regulatory',
          fileUrl: '/documents/fz-o-bankrotstve.pdf',
          fileSize: 2202009,
          fileType: 'pdf',
          uploadedAt: '2002-10-26T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: '9',
          title: 'Приказ Минэкономразвития о требованиях к СРО',
          description: 'Приказ Минэкономразвития России от 15.12.2022 № 1234',
          category: 'regulatory',
          fileUrl: '/documents/prikaz-minekonomrazvitiya.pdf',
          fileSize: 466944,
          fileType: 'pdf',
          uploadedAt: '2022-12-15T00:00:00Z',
          updatedAt: '2022-12-15T00:00:00Z'
        }
      ]
    }
  ];

  // Получаем все документы для списка
  const allDocuments = documentCategories.flatMap(category => category.documents);

  const handleDownload = (document: Document) => {
    // Создаем временную ссылку для скачивания
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
      title="Нормативные документы СРО - СРО АУ"
      description="Нормативные и учредительные документы саморегулируемой организации арбитражных управляющих."
      keywords="документы, нормативные акты, устав, СРО, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Нормативные документы СРО
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Учредительные документы, внутренние положения и нормативные акты, 
            регламентирующие деятельность саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        {/* View Mode Toggle */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900">
                Режим просмотра
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'categories' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('categories')}
                >
                  <FolderIcon className="h-4 w-4 mr-2" />
                  По категориям
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Список
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Важная информация
              </h3>
              <p className="text-amber-700">
                Все документы представлены в формате PDF. Для просмотра документов 
                необходимо наличие программы для чтения PDF-файлов. Документы 
                актуализируются в соответствии с изменениями в законодательстве.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Document Display */}
        {viewMode === 'categories' ? (
          <div className="space-y-8">
            {documentCategories.map((category) => (
              <DocumentCategory
                key={category.id}
                category={category}
                onDownload={handleDownload}
                onPrint={handlePrint}
                onPreview={handlePreview}
                defaultExpanded={true}
                showDocumentCount={true}
              />
            ))}
          </div>
        ) : (
          <DocumentList
            documents={allDocuments}
            onDownload={handleDownload}
            onPrint={handlePrint}
            onPreview={handlePreview}
            showSearch={true}
            showFilters={true}
          />
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Всего документов
              </h3>
              <p className="text-2xl font-bold text-beige-700">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Последнее обновление
              </h3>
              <p className="text-neutral-600">01.12.2023</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <FolderIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Категорий
              </h3>
              <p className="text-2xl font-bold text-beige-700">3</p>
            </CardContent>
          </Card>
        </div>

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
