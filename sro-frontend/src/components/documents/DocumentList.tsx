'use client';

import React, { useState, useMemo } from 'react';
import { Document, DocumentSearchFilters } from '@/types';
import DocumentCard from './DocumentCard';
import { MagnifyingGlassIcon, FunnelIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface DocumentListProps {
  documents: Document[];
  onDownload?: (document: Document) => void;
  onPrint?: (document: Document) => void;
  onPreview?: (document: Document) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDownload,
  onPrint,
  onPreview,
  showSearch = true,
  showFilters = true,
  className = ''
}) => {
  const [searchFilters, setSearchFilters] = useState<DocumentSearchFilters>({
    query: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    fileType: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Поиск по названию и описанию
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const matchesQuery = 
          doc.title.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Фильтр по категории
      if (searchFilters.category && doc.category !== searchFilters.category) {
        return false;
      }

      // Фильтр по типу файла
      if (searchFilters.fileType && doc.fileType !== searchFilters.fileType) {
        return false;
      }

      // Фильтр по дате
      if (searchFilters.dateFrom) {
        const docDate = new Date(doc.updatedAt);
        const fromDate = new Date(searchFilters.dateFrom);
        if (docDate < fromDate) return false;
      }

      if (searchFilters.dateTo) {
        const docDate = new Date(doc.updatedAt);
        const toDate = new Date(searchFilters.dateTo);
        if (docDate > toDate) return false;
      }

      return true;
    });
  }, [documents, searchFilters]);

  const handleSearchChange = (field: keyof DocumentSearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setSearchFilters({
      query: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      fileType: ''
    });
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(documents.map(doc => doc.category)));
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat === 'regulatory' ? 'Нормативные' : 
             cat === 'rules' ? 'Правила' :
             cat === 'reports' ? 'Отчеты' : 'Прочие'
    }));
  }, [documents]);

  const fileTypes = useMemo(() => {
    const uniqueTypes = Array.from(new Set(documents.map(doc => doc.fileType)));
    return uniqueTypes.map(type => ({
      value: type,
      label: type.toUpperCase()
    }));
  }, [documents]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Поиск и фильтры */}
      {(showSearch || showFilters) && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">
              Поиск и фильтрация
            </h3>
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Основной поиск */}
            {showSearch && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Поиск по названию"
                  placeholder="Введите название документа"
                  value={searchFilters.query}
                  onChange={(e) => handleSearchChange('query', e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
                <Input
                  label="Категория"
                  type="select"
                  value={searchFilters.category}
                  onChange={(e) => handleSearchChange('category', e.target.value)}
                  options={[
                    { value: '', label: 'Все категории' },
                    ...categories
                  ]}
                />
              </div>
            )}

            {/* Расширенные фильтры */}
            {showAdvancedFilters && showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                <Input
                  label="Тип файла"
                  type="select"
                  value={searchFilters.fileType}
                  onChange={(e) => handleSearchChange('fileType', e.target.value)}
                  options={[
                    { value: '', label: 'Все типы' },
                    ...fileTypes
                  ]}
                />
                <Input
                  label="Дата от"
                  type="date"
                  value={searchFilters.dateFrom}
                  onChange={(e) => handleSearchChange('dateFrom', e.target.value)}
                />
                <Input
                  label="Дата до"
                  type="date"
                  value={searchFilters.dateTo}
                  onChange={(e) => handleSearchChange('dateTo', e.target.value)}
                />
              </div>
            )}

            {/* Кнопки управления */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {}} // Здесь будет логика поиска
                className="flex-1 sm:flex-none"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Найти документы
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="flex-1 sm:flex-none"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Найдено документов: {filteredDocuments.length}
          </h3>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Документы не найдены
            </h3>
            <p className="text-neutral-600">
              Попробуйте изменить параметры поиска или сбросить фильтры
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onDownload={onDownload}
                onPrint={onPrint}
                onPreview={onPreview}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
