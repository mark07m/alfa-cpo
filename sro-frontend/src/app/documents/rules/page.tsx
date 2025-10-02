'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DocumentList, DocumentViewer } from '@/components/documents';
import { Document, DocumentRule } from '@/types';
import { 
  DocumentTextIcon, 
  BookOpenIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ProfessionalRulesPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const rules: DocumentRule[] = [
    {
      id: 'code-of-ethics',
      name: 'Кодекс этики арбитражных управляющих',
      description: 'Основные этические принципы и нормы поведения арбитражных управляющих',
      lastUpdated: '15.03.2023',
      size: '456 КБ',
      fileUrl: '/documents/kodeks-etiki.pdf',
      version: '2.1',
      sections: [
        {
          id: '1',
          title: 'Общие положения',
          content: 'Основные принципы и определения',
          order: 1
        },
        {
          id: '2',
          title: 'Принципы профессиональной этики',
          content: 'Этические нормы и стандарты поведения',
          order: 2
        },
        {
          id: '3',
          title: 'Обязанности арбитражного управляющего',
          content: 'Профессиональные обязанности и требования',
          order: 3
        },
        {
          id: '4',
          title: 'Запреты и ограничения',
          content: 'Ограничения в профессиональной деятельности',
          order: 4
        },
        {
          id: '5',
          title: 'Ответственность за нарушения',
          content: 'Меры ответственности за нарушение этических норм',
          order: 5
        }
      ]
    },
    {
      id: 'federal-standards',
      name: 'Федеральные стандарты деятельности',
      description: 'Стандарты деятельности арбитражных управляющих, утвержденные Минэкономразвития России',
      lastUpdated: '01.09.2023',
      size: '1.2 МБ',
      fileUrl: '/documents/federalnye-standarty.pdf',
      version: '1.0',
      sections: [
        {
          id: '6',
          title: 'Стандарт проведения процедуры наблюдения',
          content: 'Требования к проведению процедуры наблюдения',
          order: 1
        },
        {
          id: '7',
          title: 'Стандарт проведения процедуры финансового оздоровления',
          content: 'Порядок проведения финансового оздоровления',
          order: 2
        },
        {
          id: '8',
          title: 'Стандарт проведения процедуры внешнего управления',
          content: 'Требования к внешнему управлению',
          order: 3
        },
        {
          id: '9',
          title: 'Стандарт проведения процедуры конкурсного производства',
          content: 'Порядок конкурсного производства',
          order: 4
        },
        {
          id: '10',
          title: 'Стандарт проведения процедуры мирового соглашения',
          content: 'Требования к заключению мирового соглашения',
          order: 5
        }
      ]
    },
    {
      id: 'internal-rules',
      name: 'Внутренние правила СРО',
      description: 'Правила профессиональной деятельности, принятые саморегулируемой организацией',
      lastUpdated: '20.11.2023',
      size: '678 КБ',
      fileUrl: '/documents/vnutrennie-pravila.pdf',
      version: '3.0',
      sections: [
        {
          id: '11',
          title: 'Правила ведения дел',
          content: 'Порядок ведения дел о несостоятельности',
          order: 1
        },
        {
          id: '12',
          title: 'Правила взаимодействия с участниками процедур',
          content: 'Требования к взаимодействию с участниками',
          order: 2
        },
        {
          id: '13',
          title: 'Правила отчетности и документооборота',
          content: 'Порядок ведения отчетности',
          order: 3
        },
        {
          id: '14',
          title: 'Правила профессионального развития',
          content: 'Требования к повышению квалификации',
          order: 4
        },
        {
          id: '15',
          title: 'Правила разрешения споров',
          content: 'Порядок разрешения споров в СРО',
          order: 5
        }
      ]
    }
  ];

  // Преобразуем правила в документы для DocumentList
  const documents: Document[] = rules.map(rule => ({
    id: rule.id,
    title: rule.name,
    description: rule.description,
    category: 'rules' as const,
    fileUrl: rule.fileUrl,
    fileSize: parseInt(rule.size.replace(/[^\d]/g, '')) * 1024, // Примерное преобразование
    fileType: 'pdf',
    uploadedAt: rule.lastUpdated,
    updatedAt: rule.lastUpdated,
    version: rule.version
  }));

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
      title="Правила профессиональной деятельности - СРО АУ"
      description="Правила и стандарты профессиональной деятельности арбитражных управляющих, кодекс этики."
      keywords="правила, стандарты, этика, арбитражные управляющие, профессиональная деятельность"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Правила профессиональной деятельности
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Стандарты и правила профессиональной деятельности арбитражных управляющих, 
            кодекс этики и внутренние регламенты саморегулируемой организации.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Обязательность соблюдения
              </h3>
              <p className="text-blue-700">
                Все члены саморегулируемой организации обязаны соблюдать установленные 
                правила и стандарты профессиональной деятельности. Нарушение правил 
                влечет применение мер дисциплинарного воздействия.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rules List */}
        <DocumentList
          documents={documents}
          onDownload={handleDownload}
          onPrint={handlePrint}
          onPreview={handlePreview}
          showSearch={true}
          showFilters={true}
        />

        {/* Detailed Rules Sections */}
        <div className="space-y-8 mt-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            Содержание документов
          </h2>
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start">
                  <ScaleIcon className="h-8 w-8 text-beige-600 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {rule.name}
                    </h3>
                    <p className="text-neutral-600 mb-4">
                      {rule.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-neutral-500">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Обновлено: {rule.lastUpdated}
                      </div>
                      <div className="flex items-center">
                        <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                        Размер: {rule.size}
                      </div>
                      <div className="flex items-center">
                        <span className="bg-beige-100 text-beige-800 px-2 py-1 rounded text-xs">
                          v{rule.version}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                    Разделы документа:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rule.sections.map((section) => (
                      <div key={section.id} className="flex items-start">
                        <BookOpenIcon className="h-5 w-5 text-beige-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-neutral-900 font-medium">{section.title}</span>
                          <p className="text-sm text-neutral-600 mt-1">{section.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <Card className="mt-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Быстрый доступ
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Для членов СРО
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Внутренние правила и регламенты
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ScaleIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Федеральные стандарты
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Обязательные для всех управляющих
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Кодекс этики
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Этические принципы профессии
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Все документы
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Полный список правил и стандартов
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Документов
              </h3>
              <p className="text-2xl font-bold text-beige-700">3</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <BookOpenIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Разделов
              </h3>
              <p className="text-2xl font-bold text-beige-700">15</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <ScaleIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Стандартов
              </h3>
              <p className="text-2xl font-bold text-beige-700">5</p>
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
