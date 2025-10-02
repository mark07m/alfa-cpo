"use client";

import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export interface DisciplinaryMeasure {
  id: number;
  manager: string;
  date: string;
  measure: 'Предупреждение' | 'Выговор' | 'Исключение из СРО' | 'Временное приостановление';
  reason: string;
  status: 'active' | 'completed' | 'cancelled';
  endDate?: string;
  document?: boolean;
  appeal?: boolean;
  appealDate?: string;
  appealResult?: string;
}

interface DisciplinaryMeasuresProps {
  measures: DisciplinaryMeasure[];
  onViewDocument?: (id: number) => void;
  onExport?: () => void;
}

export default function DisciplinaryMeasures({ measures, onViewDocument, onExport }: DisciplinaryMeasuresProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMeasure, setFilterMeasure] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredMeasures = measures.filter(measure => {
    const matchesSearch = measure.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         measure.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeasure = filterMeasure === 'all' || measure.measure === filterMeasure;
    const matchesStatus = filterStatus === 'all' || measure.status === filterStatus;
    
    return matchesSearch && matchesMeasure && matchesStatus;
  });

  const getMeasureColor = (measure: string) => {
    switch (measure) {
      case 'Предупреждение':
        return 'bg-yellow-100 text-yellow-800';
      case 'Выговор':
        return 'bg-orange-100 text-orange-800';
      case 'Исключение из СРО':
        return 'bg-red-100 text-red-800';
      case 'Временное приостановление':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeasureIcon = (measure: string) => {
    switch (measure) {
      case 'Предупреждение':
        return <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-600" />;
      case 'Выговор':
        return <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-orange-600" />;
      case 'Исключение из СРО':
        return <XCircleIcon className="h-4 w-4 mr-2 text-red-600" />;
      case 'Временное приостановление':
        return <XCircleIcon className="h-4 w-4 mr-2 text-purple-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Действует';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ExclamationTriangleIcon className="h-3 w-3 mr-1" />;
      case 'completed':
        return <CheckCircleIcon className="h-3 w-3 mr-1" />;
      case 'cancelled':
        return <XCircleIcon className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4 sm:mb-0">
            Дисциплинарные меры
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
                placeholder="Поиск по ФИО или причине..."
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
                value={filterMeasure}
                onChange={(e) => setFilterMeasure(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
              >
                <option value="all">Все меры</option>
                <option value="Предупреждение">Предупреждение</option>
                <option value="Выговор">Выговор</option>
                <option value="Временное приостановление">Временное приостановление</option>
                <option value="Исключение из СРО">Исключение из СРО</option>
              </select>
            </div>
            
            <div className="relative">
              <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="active">Действует</option>
                <option value="completed">Завершено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-600">
          Найдено мер: {filteredMeasures.length} из {measures.length}
        </div>

        {/* Measures List */}
        <div className="space-y-4">
          {filteredMeasures.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Дисциплинарные меры не найдены
            </div>
          ) : (
            filteredMeasures.map((measure) => (
              <div 
                key={measure.id}
                className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 sm:mb-0">
                        {measure.manager}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(measure.status)}`}>
                          {getStatusIcon(measure.status)}
                          {getStatusText(measure.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-neutral-600 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                        Дата: {measure.date}
                      </div>
                      <div className="flex items-center">
                        {getMeasureIcon(measure.measure)}
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMeasureColor(measure.measure)}`}>
                          {measure.measure}
                        </span>
                      </div>
                      {measure.endDate && (
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          Окончание: {measure.endDate}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-neutral-800 mb-2">Причина применения меры:</h4>
                      <p className="text-sm text-neutral-700">{measure.reason}</p>
                    </div>

                    {/* Appeal Information */}
                    {measure.appeal && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Информация об обжаловании:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>Дата подачи жалобы: {measure.appealDate}</div>
                          {measure.appealResult && (
                            <div>Результат рассмотрения: {measure.appealResult}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                    {measure.document ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewDocument?.(measure.id)}
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Документ
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Документ недоступен
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
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">Предупреждения</div>
            <div className="text-2xl font-bold text-yellow-900">
              {measures.filter(m => m.measure === 'Предупреждение').length}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-orange-800">Выговоры</div>
            <div className="text-2xl font-bold text-orange-900">
              {measures.filter(m => m.measure === 'Выговор').length}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-red-800">Исключения</div>
            <div className="text-2xl font-bold text-red-900">
              {measures.filter(m => m.measure === 'Исключение из СРО').length}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-purple-800">Приостановления</div>
            <div className="text-2xl font-bold text-purple-900">
              {measures.filter(m => m.measure === 'Временное приостановление').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
