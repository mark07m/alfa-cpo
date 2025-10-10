'use client';

import { Button } from '@/components/admin/ui/Button';
import { 
  TrashIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface InspectionsActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export function InspectionsActions({
  selectedCount,
  onBulkDelete,
  onClearSelection
}: InspectionsActionsProps) {
  const handleBulkStatusChange = (status: string) => {
    console.log(`Изменение статуса ${selectedCount} проверок на: ${status}`);
    // Здесь будет логика изменения статуса
  };

  const handleBulkExport = () => {
    console.log(`Экспорт ${selectedCount} проверок`);
    // Здесь будет логика экспорта
  };

  return (
    <div className="bg-primary-50/30 border border-primary-200/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-primary-900">
            Выбрано проверок: {selectedCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="text-primary-600 hover:text-primary-700"
          >
            Очистить выбор
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('completed')}
            className="flex items-center space-x-1 text-green-600 hover:text-green-700"
          >
            <CheckCircleIcon className="h-4 w-4" />
            <span>Завершить</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkStatusChange('cancelled')}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <XCircleIcon className="h-4 w-4" />
            <span>Отменить</span>
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
