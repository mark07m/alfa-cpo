'use client';

import React, { useState, useEffect } from 'react';
import { DocumentViewerProps } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { 
  XMarkIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline';

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  showDownload = true,
  showPrint = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Здесь будет логика загрузки PDF и определения количества страниц
    // Пока что используем моковые данные
    setTotalPages(5);
    setIsLoading(false);
  }, [document]);

  const handleDownload = () => {
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  if (error) {
    return (
      <Modal isOpen={true} onClose={onClose} size="lg">
        <div className="p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Ошибка загрузки документа
            </h3>
            <p className="text-neutral-600 mb-6">
              Не удалось загрузить документ. Возможно, файл поврежден или недоступен.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={onClose}>
                Закрыть
              </Button>
              {showDownload && (
                <Button variant="outline" onClick={handleDownload}>
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="full">
      <div className="flex flex-col h-full">
        {/* Заголовок и панель инструментов */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-neutral-900 truncate">
              {document.title}
            </h2>
            <span className="text-sm text-neutral-500">
              {document.fileType.toUpperCase()} • {Math.round(document.fileSize / 1024)} КБ
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Навигация по страницам */}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm text-neutral-600 min-w-[80px] text-center">
                {currentPage} из {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Масштаб */}
            <div className="flex items-center space-x-1 border-l border-neutral-200 pl-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <MagnifyingGlassMinusIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetZoom}
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <MagnifyingGlassPlusIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm text-neutral-600 ml-2">
                {Math.round(scale * 100)}%
              </span>
            </div>

            {/* Действия с документом */}
            <div className="flex items-center space-x-2 border-l border-neutral-200 pl-4">
              {showDownload && (
                <Button
                  size="sm"
                  onClick={handleDownload}
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              )}
              {showPrint && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                >
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Печать
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Область просмотра документа */}
        <div className="flex-1 bg-neutral-100 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-600 mx-auto mb-4"></div>
                <p className="text-neutral-600">Загрузка документа...</p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div 
                className="bg-white shadow-lg mx-auto"
                style={{ 
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  width: 'fit-content'
                }}
              >
                {/* Здесь будет встроенный PDF viewer или iframe */}
                <div className="w-[800px] h-[1000px] border border-neutral-300 flex items-center justify-center bg-white">
                  <div className="text-center text-neutral-500">
                    <DocumentArrowDownIcon className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Предварительный просмотр PDF</p>
                    <p className="text-sm mb-4">
                      Страница {currentPage} из {totalPages}
                    </p>
                    <p className="text-xs">
                      Для полного просмотра скачайте документ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Информация о документе */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div>
              <span className="font-medium">Размер:</span> {Math.round(document.fileSize / 1024)} КБ
              {document.version && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-medium">Версия:</span> {document.version}
                </>
              )}
            </div>
            <div>
              <span className="font-medium">Обновлено:</span> {new Date(document.updatedAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentViewer;
