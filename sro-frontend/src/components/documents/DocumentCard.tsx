'use client';

import React from 'react';
import { Document } from '@/types';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/dateUtils';
import { 
  DocumentTextIcon, 
  CalendarIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface DocumentCardProps {
  document: Document;
  onDownload?: (document: Document) => void;
  onPrint?: (document: Document) => void;
  onPreview?: (document: Document) => void;
  showActions?: boolean;
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onPrint,
  onPreview,
  showActions = true,
  className = ''
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };


  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow duration-200 ${className}`}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <div className="text-2xl mr-3 mt-1 flex-shrink-0">
                {getFileTypeIcon(document.fileType)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                  {document.title}
                </h3>
                {document.description && (
                  <p className="text-neutral-600 mb-3 line-clamp-3">
                    {document.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(document.updatedAt)}
                  </div>
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    {formatFileSize(document.fileSize)}
                  </div>
                  {document.version && (
                    <div className="flex items-center">
                      <span className="bg-beige-100 text-beige-800 px-2 py-1 rounded text-xs">
                        v{document.version}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {showActions && (
            <div className="ml-4 flex space-x-2">
              {onPreview && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(document)}
                  title="Предварительный просмотр"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  size="sm"
                  onClick={() => onDownload(document)}
                  title="Скачать документ"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              )}
              {onPrint && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPrint(document)}
                  title="Печать документа"
                >
                  <PrinterIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
