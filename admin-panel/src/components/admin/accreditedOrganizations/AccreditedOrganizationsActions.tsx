'use client';

import { useState } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface AccreditedOrganizationsActionsProps {
  selectedCount: number;
  onAdd: () => void;
  onBulkDelete: () => void;
  onExport: () => void;
  onExportExcel: () => void;
}

export function AccreditedOrganizationsActions({
  selectedCount,
  onAdd,
  onBulkDelete,
  onExport,
  onExportExcel
}: AccreditedOrganizationsActionsProps) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onAdd}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Добавить организацию</span>
        </Button>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Выбрано: {selectedCount}
            </span>
            <Button
              variant="outline"
              onClick={onBulkDelete}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Удалить выбранные</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onExport();
                    setShowExportMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Экспорт в PDF
                </button>
                <button
                  onClick={() => {
                    onExportExcel();
                    setShowExportMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Экспорт в Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
