"use client";

import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export interface InspectionResult {
  id: number;
  manager: string;
  date: string;
  type: 'Плановая' | 'Внеплановая';
  result: 'Нарушений не выявлено' | 'Выявлены нарушения' | 'Требует доработки';
  status: 'completed' | 'in_progress' | 'cancelled';
  report: boolean;
  violations?: string[];
  recommendations?: string[];
  inspector?: string;
  nextInspection?: string;
}

interface InspectionResultsProps {
  results: InspectionResult[];
  onViewReport?: (id: number) => void;
  onExport?: () => void;
}

export default function InspectionResults({ results, onViewReport, onExport }: InspectionResultsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredResults = results.filter(result => {
    const matchesSearch = result.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = filterResult === 'all' || result.result === filterResult;
    const matchesType = filterType === 'all' || result.type === filterType;
    
    return matchesSearch && matchesResult && matchesType;
  });

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Нарушений не выявлено':
        return 'text-green-600';
      case 'Выявлены нарушения':
        return 'text-red-600';
      case 'Требует доработки':
        return 'text-yellow-600';
      default:
        return 'text-neutral-600';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'Нарушений не выявлено':
        return <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />;
      case 'Выявлены нарушения':
        return <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-600" />;
      case 'Требует доработки':
        return <XCircleIcon className="h-4 w-4 mr-2 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершена';
      case 'in_progress':
        return 'В процессе';
      case 'cancelled':
        return 'Отменена';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4 sm:mb-0">
            Результаты проверок
          </h2>
          {onExport && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExport}
              className="mb-4 sm:mb-0"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Поиск по ФИО..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
              >
                <option value="all">Все результаты</option>
                <option value="Нарушений не выявлено">Без нарушений</option>
                <option value="Выявлены нарушения">С нарушениями</option>
                <option value="Требует доработки">Требует доработки</option>
              </select>
            </div>
            
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
              >
                <option value="all">Все типы</option>
                <option value="Плановая">Плановая</option>
                <option value="Внеплановая">Внеплановая</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-600">
          Найдено результатов: {filteredResults.length} из {results.length}
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Результаты проверок не найдены
            </div>
          ) : (
            filteredResults.map((result) => (
              <div 
                key={result.id}
                className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 sm:mb-0">
                        {result.manager}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {getStatusText(result.status)}
                        </span>
                        {result.inspector && (
                          <span className="text-sm text-neutral-600">
                            Инспектор: {result.inspector}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-neutral-600 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                        {result.date}
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {result.type}
                        </span>
                      </div>
                      <div className={`flex items-center ${getResultColor(result.result)}`}>
                        {getResultIcon(result.result)}
                        {result.result}
                      </div>
                      {result.nextInspection && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          Следующая: {result.nextInspection}
                        </div>
                      )}
                    </div>

                    {/* Violations */}
                    {result.violations && result.violations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Выявленные нарушения:</h4>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                          {result.violations.map((violation, index) => (
                            <li key={index}>{violation}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Рекомендации:</h4>
                        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                          {result.recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                    {result.report ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewReport?.(result.id)}
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Отчет
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Отчет недоступен
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800">Без нарушений</div>
            <div className="text-2xl font-bold text-green-900">
              {results.filter(r => r.result === 'Нарушений не выявлено').length}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-red-800">С нарушениями</div>
            <div className="text-2xl font-bold text-red-900">
              {results.filter(r => r.result === 'Выявлены нарушения').length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">Требует доработки</div>
            <div className="text-2xl font-bold text-yellow-900">
              {results.filter(r => r.result === 'Требует доработки').length}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Всего проверок</div>
            <div className="text-2xl font-bold text-blue-900">
              {results.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
