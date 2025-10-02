"use client";

import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export interface InspectionItem {
  id: number;
  manager: string;
  region: string;
  date: string;
  type: 'Плановая' | 'Внеплановая';
  status: 'Запланирована' | 'В процессе' | 'Завершена';
  inspector?: string;
  notes?: string;
}

interface InspectionScheduleProps {
  inspections: InspectionItem[];
  onExport?: () => void;
}

export default function InspectionSchedule({ inspections, onExport }: InspectionScheduleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || inspection.type === filterType;
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Запланирована':
        return 'bg-blue-100 text-blue-800';
      case 'В процессе':
        return 'bg-yellow-100 text-yellow-800';
      case 'Завершена':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Плановая' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4 sm:mb-0">
            График проверок
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
                placeholder="Поиск по ФИО или региону..."
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
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beige-500 focus:border-beige-500 appearance-none bg-white"
              >
                <option value="all">Все типы</option>
                <option value="Плановая">Плановая</option>
                <option value="Внеплановая">Внеплановая</option>
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
                <option value="Запланирована">Запланирована</option>
                <option value="В процессе">В процессе</option>
                <option value="Завершена">Завершена</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-neutral-600">
          Найдено проверок: {filteredInspections.length} из {inspections.length}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Арбитражный управляющий
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Регион
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Дата проверки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Тип проверки
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Инспектор
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Проверки не найдены
                  </td>
                </tr>
              ) : (
                filteredInspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {inspection.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {inspection.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                        {inspection.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(inspection.type)}`}>
                        {inspection.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {inspection.inspector || 'Не назначен'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Запланировано</div>
            <div className="text-2xl font-bold text-blue-900">
              {inspections.filter(i => i.status === 'Запланирована').length}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-yellow-800">В процессе</div>
            <div className="text-2xl font-bold text-yellow-900">
              {inspections.filter(i => i.status === 'В процессе').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm font-medium text-green-800">Завершено</div>
            <div className="text-2xl font-bold text-green-900">
              {inspections.filter(i => i.status === 'Завершена').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
