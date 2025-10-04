'use client';

import { Button } from '@/components/admin/ui/Button';
import { 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DisciplinaryMeasuresActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function DisciplinaryMeasuresActions({
  selectedCount,
  onBulkDelete,
  onClearSelection
}: DisciplinaryMeasuresActionsProps) {
  const handleBulkStatusChange = (status: string) => {
    console.log(`Изменение статуса ${selectedCount} дисциплинарных мер на: ${status}`);
    // Здесь будет логика изменения статуса
  };

  const handleBulkExport = () => {
    console.log(`Экспорт ${selectedCount} дисциплинарных мер`);
    // Здесь будет логика экспорта
  };

  const handleBulkAppeal = () => {
    console.log(`Создание апелляции для ${selectedCount} дисциплинарных мер`);
    // Здесь будет логика создания апелляции
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-red-900">
            Выбрано дисциплинарных мер: {selectedCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="text-red-600 hover:text-red-700"
          >
            Очистить выбор
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('cancelled')}
            className="flex items-center space-x-1 text-green-600 hover:text-green-700"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Отменить</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('expired')}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
          >
            <XCircleIcon className="h-4 w-4" />
            <span>Истечь</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkAppeal}
            className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span>Апелляция</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-700"
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Удалить</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
