'use client';

import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { DocumentList, DocumentViewer } from '@/components/documents';
import { Document } from '@/types';
import { BanknotesIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { compensationFundService, type CompensationFundResponse } from '@/services/compensationFund';
import { documentsService } from '@/services/documents';
import { formatDate } from '@/utils/dateUtils';

export default function CompensationFundPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [fundInfo, setFundInfo] = useState<CompensationFundResponse | null>(null);
  const [history, setHistory] = useState<Array<{ date: string; operation: 'increase'|'decrease'|'transfer'; amount: number; description?: string; documentUrl?: string }>>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = (doc: Document) => {
    const url = documentsService.getDownloadUrl(doc.id);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = doc.title;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handlePrint = (doc: Document) => {
    window.open(documentsService.getPreviewUrl(doc.id), '_blank');
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
  };

  const formatCurrency = (value: number, currency: string = 'RUB') => {
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
    } catch {
      return `${value.toLocaleString('ru-RU')} ₽`;
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [fundRes, histRes] = await Promise.all([
          compensationFundService.get(),
          compensationFundService.history({ page: 1, limit: 10 })
        ]);

        if (cancelled) return;
        if (fundRes.success) {
          setFundInfo(fundRes.data);
          const ids = (fundRes.data.documents || []).filter(Boolean);
          if (ids.length > 0) {
            const results = await Promise.allSettled(ids.map((id) => documentsService.getById(id)));
            const mapped: Document[] = results
              .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value?.success)
              .map((r) => r.value.data);
            setDocuments(mapped);
          } else {
            // Fallback: load by category if fund has no linked documents
            const listRes = await documentsService.listPublic({ category: 'compensation-fund', limit: 20, sortBy: 'uploadedAt', sortOrder: 'desc' });
            if (listRes.success) {
              setDocuments(listRes.data.data);
            } else {
              setDocuments([]);
            }
          }
        }
        if (histRes.success) {
          const items = Array.isArray((histRes as any).data) ? (histRes as any).data : [];
          const mapped = items.map((h: any) => ({
            date: h.date,
            operation: h.operation,
            amount: h.amount,
            description: h.description,
            documentUrl: h.documentUrl,
          }));
          setHistory(mapped);
        }
      } catch (e) {
        setError('Не удалось загрузить данные компенсационного фонда');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const historyWithRunningAmount = useMemo(() => {
    if (!fundInfo || history.length === 0) return [] as Array<{ date: string; operation: string; amount: number; totalAfter: number; description?: string }>; 
    let runningAmount = fundInfo.amount;
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted.map((entry) => {
      const totalAfter = runningAmount;
      if (entry.operation === 'increase') {
        runningAmount -= entry.amount;
      } else if (entry.operation === 'decrease') {
        runningAmount += entry.amount;
      }
      return { date: entry.date, operation: entry.operation, amount: entry.amount, totalAfter, description: entry.description };
    });
  }, [fundInfo, history]);

  return (
    <Layout
      title="Компенсационный фонд - СРО АУ"
      description="Информация о компенсационном фонде СРО: размер, реквизиты, документы."
      keywords="компенсационный фонд, реквизиты, размер фонда"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded p-4 mb-6">{error}</div>
        )}
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Компенсационный фонд
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о компенсационном фонде саморегулируемой организации 
            арбитражных управляющих в соответствии с требованиями законодательства.
          </p>
        </div>

        {/* Fund Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Информация о фонде
                </h2>
              </CardHeader>
              <CardContent>
                <div className="prose">
                  <p className="mb-4">
                    Компенсационный фонд саморегулируемой организации арбитражных управляющих 
                    создан в соответствии с требованиями Федерального закона "О несостоятельности 
                    (банкротстве)" и предназначен для возмещения ущерба, причиненного арбитражными 
                    управляющими при исполнении возложенных на них обязанностей.
                  </p>
                  <p className="mb-4">
                    Размер компенсационного фонда формируется за счет взносов членов СРО и 
                    не может быть менее 50 000 рублей на каждого члена саморегулируемой организации.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="text-center">
                <BanknotesIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Размер фонда
                </h3>
                <p className="text-2xl font-bold text-beige-700 mb-2">{fundInfo ? formatCurrency(fundInfo.amount, fundInfo.currency) : '—'}</p>
                <p className="text-sm text-neutral-600">{fundInfo ? `на ${formatDate(fundInfo.lastUpdated)}` : ''}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Последнее обновление
                </h3>
                <p className="text-neutral-600">{fundInfo ? formatDate(fundInfo.lastUpdated) : '—'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Документы
                </h3>
                {documents.length === 0 ? (
                  <p className="text-sm text-neutral-600 mb-3">Нет документов</p>
                ) : (
                  <button className="text-beige-600 hover:text-beige-700 text-sm font-medium" onClick={() => setSelectedDocument(documents[0])}>
                    Открыть: {documents[0].title}
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bank Details */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Реквизиты счета компенсационного фонда
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Банковские реквизиты
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-neutral-700">Наименование банка:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.bankName || '—'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">БИК:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.bik || '—'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Корреспондентский счет:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.correspondentAccount || '—'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Реквизиты получателя
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-neutral-700">Получатель:</span>
                    <p className="text-neutral-900">СРО Арбитражных Управляющих</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">ИНН:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.inn || '—'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">КПП:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.kpp || '—'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Расчетный счет:</span>
                    <p className="text-neutral-900">{fundInfo?.bankDetails.accountNumber || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund History */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              История изменений фонда
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Операция
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Размер фонда
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {historyWithRunningAmount.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500" colSpan={4}>
                        Нет данных истории
                      </td>
                    </tr>
                  ) : (
                    historyWithRunningAmount.map((item, idx) => {
                      const isIncrease = item.operation === 'increase';
                      const isDecrease = item.operation === 'decrease';
                      return (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {formatDate(item.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {item.operation === 'increase' ? 'Пополнение фонда' : item.operation === 'decrease' ? 'Списание средств' : 'Перевод'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-neutral-900'}`}>
                            {`${isIncrease ? '+' : isDecrease ? '-' : ''}${formatCurrency(item.amount, fundInfo?.currency || 'RUB')}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                            {formatCurrency(item.totalAfter, fundInfo?.currency || 'RUB')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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
