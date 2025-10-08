'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/admin/ui/Button';
import { Modal } from '@/components/admin/ui/Modal';
import { Alert } from '@/components/admin/ui/Alert';
import { 
  DocumentArrowDownIcon, 
  DocumentArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ArbitratorsImportExportProps {
  onImport: (file: File) => Promise<{ success: number; errors: string[] }>;
  onExport: () => Promise<void>;
  onExportCsv: () => Promise<void>;
  loading?: boolean;
}

export function ArbitratorsImportExport({
  onImport,
  onExport,
  onExportCsv,
  loading = false
}: ArbitratorsImportExportProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      const result = await onImport(selectedFile);
      setImportResult(result);
      
      if (result.success > 0) {
        // Закрываем модал через 2 секунды после успешного импорта
        setTimeout(() => {
          setShowImportModal(false);
          setSelectedFile(null);
          setImportResult(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: 0,
        errors: ['Ошибка импорта файла']
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      await onExport();
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleExportCsv = async () => {
    try {
      await onExportCsv();
      setShowExportModal(false);
    } catch (error) {
      console.error('Export CSV error:', error);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    resetImport();
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => setShowImportModal(true)}
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <DocumentArrowUpIcon className="h-4 w-4" />
          <span>Импорт</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowExportModal(true)}
          className="flex items-center space-x-2"
          disabled={loading}
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          <span>Экспорт</span>
        </Button>
      </div>

      {/* Модал импорта */}
      <Modal
        isOpen={showImportModal}
        onClose={closeImportModal}
        title="Импорт данных реестра"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Выберите файл Excel (.xlsx) или CSV (.csv) для импорта данных арбитражных управляющих.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <DocumentArrowUpIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Нажмите для выбора файла'}
                </span>
                <span className="text-xs text-gray-500">
                  Поддерживаются форматы: .xlsx, .xls, .csv
                </span>
              </label>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Выбран файл: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}

          {importResult && (
            <div className="space-y-2">
              {importResult.success > 0 && (
                <Alert
                  type="success"
                  title="Импорт выполнен успешно"
                  message={`Импортировано записей: ${importResult.success}`}
                />
              )}
              
              {importResult.errors.length > 0 && (
                <Alert
                  type="error"
                  title="Ошибки при импорте"
                  message={
                    <div className="space-y-1">
                      {importResult.errors.map((error, index) => (
                        <div key={index} className="text-sm">{error}</div>
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={closeImportModal}
              disabled={isImporting}
            >
              Отмена
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
              loading={isImporting}
            >
              {isImporting ? 'Импорт...' : 'Импортировать'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модал экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных реестра"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Выберите формат для экспорта данных реестра арбитражных управляющих.
          </p>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="w-full flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Экспорт в Excel (.xlsx)</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCsv}
              className="w-full flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Экспорт в CSV (.csv)</span>
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(false)}
            >
              Отмена
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
