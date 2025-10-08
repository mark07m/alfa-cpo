'use client';

import { useState } from 'react';
import { useCompensationFund } from '@/hooks/admin/useCompensationFund';
import { Button } from '@/components/admin/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Alert } from '@/components/admin/ui/Alert';
import { 
  BanknotesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PencilIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { CompensationFundForm } from '@/components/admin/compensation-fund/CompensationFundForm';
import { CompensationFundHistory } from '@/components/admin/compensation-fund/CompensationFundHistory';
import { CompensationFundStatistics } from '@/components/admin/compensation-fund/CompensationFundStatistics';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CompensationFundPage() {
  const {
    fundInfo,
    statistics,
    history,
    loading,
    error,
    pagination,
    fetchFundInfo,
    fetchStatistics,
    fetchHistory,
    updateFundInfo,
    addHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    exportHistory,
    exportStatistics
  } = useCompensationFund();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'statistics' | 'edit'>('overview');
  const [showEditForm, setShowEditForm] = useState(false);

  const handleExportHistory = async () => {
    try {
      const blob = await exportHistory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compensation-fund-history-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Ошибка экспорта истории:', err);
    }
  };

  const handleExportStatistics = async () => {
    try {
      const blob = await exportStatistics();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compensation-fund-statistics-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Ошибка экспорта статистики:', err);
    }
  };

  if (loading && !fundInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="Ошибка загрузки" message={error} />
    );
  }

  return (
      <div className="space-y-6">
        {/* Заголовок и действия */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Компенсационный фонд</h1>
            <p className="text-sm text-gray-500 mt-1">
              Управление компенсационным фондом СРО
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              onClick={handleExportHistory}
              disabled={loading}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Экспорт истории
            </Button>
            <Button
              variant="outline"
              onClick={handleExportStatistics}
              disabled={loading}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Экспорт статистики
            </Button>
            <Button
              onClick={() => setShowEditForm(true)}
              disabled={loading}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Редактировать
            </Button>
          </div>
        </div>

        {/* Навигация по вкладкам */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Обзор', icon: BanknotesIcon },
              { id: 'history', name: 'История операций', icon: ClockIcon },
              { id: 'statistics', name: 'Статистика', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'history' | 'statistics' | 'edit')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Содержимое вкладок */}
        {activeTab === 'overview' && fundInfo && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Текущий баланс
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(fundInfo.amount, fundInfo.currency)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Последнее обновление: {formatDate(fundInfo.lastUpdated)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Банковские реквизиты
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Банк:</span>
                    <p className="text-sm">{fundInfo.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Счет:</span>
                    <p className="text-sm font-mono">{fundInfo.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">БИК:</span>
                    <p className="text-sm font-mono">{fundInfo.bankDetails.bik}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Последние операции */}
            <Card>
              <CardHeader>
                <CardTitle>Последние операции</CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.slice(0, 5).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{entry.operation}</p>
                          <p className="text-xs text-gray-500">{entry.description}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            entry.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.amount > 0 ? '+' : ''}{formatCurrency(entry.amount, fundInfo.currency)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Нет операций</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <CompensationFundHistory
            history={history}
            loading={loading}
            pagination={pagination}
            onAddEntry={addHistoryEntry}
            onUpdateEntry={updateHistoryEntry}
            onDeleteEntry={deleteHistoryEntry}
            onPageChange={(page) => fetchHistory({ page })}
          />
        )}

        {activeTab === 'statistics' && statistics && (
          <CompensationFundStatistics statistics={statistics} />
        )}

        {/* Модальное окно редактирования */}
        {showEditForm && fundInfo && (
          <CompensationFundForm
            fundInfo={fundInfo}
            onSave={updateFundInfo}
            onCancel={() => setShowEditForm(false)}
          />
        )}
      </div>
  );
}
