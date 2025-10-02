'use client';

import React, { useState } from 'react';
import { DocumentCategory as DocumentCategoryType, Document } from '@/types';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import DocumentCard from './DocumentCard';
import { 
  FolderIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface DocumentCategoryProps {
  category: DocumentCategoryType;
  onDownload?: (document: Document) => void;
  onPrint?: (document: Document) => void;
  onPreview?: (document: Document) => void;
  defaultExpanded?: boolean;
  showDocumentCount?: boolean;
  className?: string;
}

const DocumentCategory: React.FC<DocumentCategoryProps> = ({
  category,
  onDownload,
  onPrint,
  onPreview,
  defaultExpanded = false,
  showDocumentCount = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'founding':
        return '🏛️';
      case 'internal':
        return '📋';
      case 'regulatory':
        return '⚖️';
      case 'rules':
        return '📖';
      case 'reports':
        return '📊';
      default:
        return '📁';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'founding':
        return 'text-blue-600 bg-blue-100';
      case 'internal':
        return 'text-green-600 bg-green-100';
      case 'regulatory':
        return 'text-purple-600 bg-purple-100';
      case 'rules':
        return 'text-orange-600 bg-orange-100';
      case 'reports':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-beige-600 bg-beige-100';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-neutral-50 p-2 -m-2 rounded-lg transition-colors duration-200"
          onClick={toggleExpanded}
        >
          <div className="flex items-center">
            <div className="text-2xl mr-3">
              {getCategoryIcon(category.id)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {category.name}
              </h2>
              <p className="text-neutral-600 text-sm">
                {category.description}
              </p>
              {showDocumentCount && (
                <div className="flex items-center mt-1">
                  <DocumentTextIcon className="h-4 w-4 text-neutral-400 mr-1" />
                  <span className="text-sm text-neutral-500">
                    {category.documents.length} документов
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {category.documents.length > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium mr-3 ${getCategoryColor(category.id)}`}>
                {category.documents.length}
              </span>
            )}
            {category.documents.length > 0 && (
              <div className="text-neutral-400">
                {isExpanded ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && category.documents.length > 0 && (
        <CardContent>
          <div className="space-y-4">
            {category.documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={onDownload}
                onPrint={onPrint}
                onPreview={onPreview}
                showActions={true}
                className="border-l-4 border-l-beige-300"
              />
            ))}
          </div>
        </CardContent>
      )}

      {isExpanded && category.documents.length === 0 && (
        <CardContent>
          <div className="text-center py-8">
            <FolderIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Документы отсутствуют
            </h3>
            <p className="text-neutral-600">
              В данной категории пока нет документов
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DocumentCategory;
