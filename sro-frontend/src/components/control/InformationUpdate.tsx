"use client";

import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export interface InformationItem {
  id: number;
  name: string;
  placementDate: string;
  lastUpdateDate?: string;
  status: 'updated' | 'current' | 'needs_update';
  description?: string;
  responsible?: string;
  nextUpdate?: string;
}

interface InformationUpdateProps {
  information: InformationItem[];
  onExport?: () => void;
}

export default function InformationUpdate({ information, onExport }: InformationUpdateProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInformation = information.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'updated':
        return 'bg-green-100 text-green-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'needs_update':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'updated':
        return <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />;
      case 'current':
        return <InformationCircleIcon className="h-4 w-4 mr-2 text-blue-600" />;
      case 'needs_update':
        return <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'updated':
        return 'Обновлено';
      case 'current':
        return 'Актуально';
      case 'needs_update':
        return 'Требует обновления';
      default:
        return 'Неизвестно';
    }
  };

  const getDaysSinceUpdate = (lastUpdateDate?: string) => {
    if (!lastUpdateDate) return null;
    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Информация о размещении и обновлении сведений
            </h2>
            <p className="text-sm text-neutral-600">
              Сведения, размещаемые СРО в соответствии с требованиями законодательства
            </p>
          </div>
          {onExport && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onExport}
              className="mt-4 sm:mt-0"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Legal Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Правовая основа
              </h3>
              <p className="text-sm text-blue-700">
                Размещение и обновление сведений осуществляется в соответствии с требованиями 
                Федерального закона &quot;О несостоятельности (банкротстве)&quot; и иных нормативных актов.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Поиск по названию сведений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500"
              />
            </div>
          </div>
          
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
            >
              <option value="all">Все статусы</option>
              <option value="updated">Обновлено</option>
              <option value="current">Актуально</option>
              <option value="needs_update">Требует обновления</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-600">
          Найдено сведений: {filteredInformation.length} из {information.length}
        </div>

        {/* Information Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Наименование сведений
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Дата размещения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Последнее обновление
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Ответственный
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredInformation.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    Сведения не найдены
                  </td>
                </tr>
              ) : (
                filteredInformation.map((item) => {
                  const daysSinceUpdate = getDaysSinceUpdate(item.lastUpdateDate);
                  
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-neutral-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-neutral-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {item.placementDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.lastUpdateDate ? (
                          <div>
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                              {item.lastUpdateDate}
                            </div>
                            {daysSinceUpdate !== null && (
                              <div className="text-xs text-neutral-500 mt-1">
                                {daysSinceUpdate} дней назад
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-400">Не обновлялось</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.responsible || 'Не назначен'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Next Updates */}
        {information.some(item => item.nextUpdate) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Предстоящие обновления
            </h3>
            <div className="space-y-2">
              {information
                .filter(item => item.nextUpdate)
                .sort((a, b) => new Date(a.nextUpdate!).getTime() - new Date(b.nextUpdate!).getTime())
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">{item.name}</span>
                    </div>
                    <span className="text-sm text-yellow-700">{item.nextUpdate}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800">Обновлено</div>
            <div className="text-2xl font-bold text-green-900">
              {information.filter(i => i.status === 'updated').length}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Актуально</div>
            <div className="text-2xl font-bold text-blue-900">
              {information.filter(i => i.status === 'current').length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">Требует обновления</div>
            <div className="text-2xl font-bold text-yellow-900">
              {information.filter(i => i.status === 'needs_update').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
