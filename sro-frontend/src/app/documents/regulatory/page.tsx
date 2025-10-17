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
import { useEffect, useMemo, useState } from 'react';
import { documentsService } from '@/services/documents';

export default function RegulatoryDocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'categories' | 'list'>('categories');
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    documentsService.listPublic({ category: 'regulatory', sortBy: 'uploadedAt', sortOrder: 'desc', limit: 100 })
      .then((res) => {
        if (!mounted) return
        const data = res.data?.data || []
        setDocuments(data)
      })
      .catch(() => {
        if (!mounted) return
        setError('Не удалось загрузить документы')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const handleDownload = (doc: Document) => {
    const url = documentsService.getDownloadUrl(doc.id)
    const a = window.document.createElement('a')
    a.href = url
    a.download = doc.title
    window.document.body.appendChild(a)
    a.click()
    window.document.body.removeChild(a)
  };

  const handlePrint = (doc: Document) => {
    const url = documentsService.getPreviewUrl(doc.id)
    window.open(url, '_blank')
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
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
            <DocumentCategory
              category={{ id: 'regulatory', name: 'Нормативные документы', description: 'Учредительные, внутренние и нормативные акты', order: 1, documents }}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onPreview={handlePreview}
              defaultExpanded={true}
              showDocumentCount={true}
            />
          </div>
        ) : (
          <DocumentList
            documents={documents}
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
              <p className="text-2xl font-bold text-beige-700">{documents.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Последнее обновление
              </h3>
              <p className="text-neutral-600">{documents[0]?.uploadedAt ? new Date(documents[0].uploadedAt).toLocaleDateString('ru-RU') : '-'}</p>
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
