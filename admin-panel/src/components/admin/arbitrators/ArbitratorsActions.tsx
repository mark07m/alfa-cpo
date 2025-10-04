'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ArbitratorsActionsProps {
  selectedCount: number;
  onStatusUpdate: (status: 'active' | 'excluded' | 'suspended') => void;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function ArbitratorsActions({ 
  selectedCount, 
  onStatusUpdate, 
  onDelete, 
  onClearSelection 
}: ArbitratorsActionsProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusUpdate = (status: 'active' | 'excluded' | 'suspended') => {
    onStatusUpdate(status);
    setShowStatusMenu(false);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-blue-900">
            Выбрано: {selectedCount} арбитражных управляющих
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Изменение статуса */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center space-x-1"
            >
              <CheckCircleIcon className="h-4 w-4" />
              <span>Изменить статус</span>
            </Button>
            
            {showStatusMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusUpdate('active')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    Действительный
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('suspended')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    Приостановлен
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('excluded')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                    Исключен
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Удаление */}
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Удалить</span>
          </Button>

          {/* Очистить выбор */}
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="flex items-center space-x-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Очистить</span>
          </Button>
        </div>
      </div>

      {/* Закрыть меню при клике вне его */}
      {showStatusMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  );
}
