'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/Card';
import { Button } from '@/components/admin/ui/Button';
import { Input } from '@/components/admin/ui/Input';
import { Label } from '@/components/admin/ui/Label';
import { Modal } from '@/components/admin/ui/Modal';
import { Alert } from '@/components/admin/ui/Alert';
import { Badge } from '@/components/admin/ui/Badge';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { CompensationFundHistory as HistoryType, CompensationFundHistoryFormData } from '@/types/admin';
import { formatCurrency, formatDate } from '@/lib/utils';

const historyEntrySchema = z.object({
  operation: z.string().min(1, 'Операция обязательна'),
  amount: z.number().min(0.01, 'Сумма должна быть больше 0'),
  description: z.string().min(1, 'Описание обязательно'),
  documentUrl: z.string().optional()
});

interface CompensationFundHistoryProps {
  history: HistoryType[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onAddEntry: (data: CompensationFundHistoryFormData) => Promise<void>;
  onUpdateEntry: (id: string, data: CompensationFundHistoryFormData) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
}

export function CompensationFundHistory({
  history,
  loading,
  pagination,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onPageChange
}: CompensationFundHistoryProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HistoryType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [operationFilter, setOperationFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CompensationFundHistoryFormData>({
    resolver: zodResolver(historyEntrySchema)
  });

  const handleAddEntry = async (data: CompensationFundHistoryFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onAddEntry(data);
      reset();
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка добавления записи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = async (data: CompensationFundHistoryFormData) => {
    if (!editingEntry) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      await onUpdateEntry(editingEntry.date, data);
      reset();
      setShowEditModal(false);
      setEditingEntry(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления записи');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entry: HistoryType) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await onDeleteEntry(entry.date);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка удаления записи');
      }
    }
  };

  const openEditModal = (entry: HistoryType) => {
    setEditingEntry(entry);
    setValue('operation', entry.operation);
    setValue('amount', entry.amount);
    setValue('description', entry.description);
    setValue('documentUrl', entry.documentUrl || '');
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingEntry(null);
    reset();
    setError(null);
  };

  const filteredHistory = history.filter(entry => {
    const matchesSearch = entry.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperation = !operationFilter || entry.operation === operationFilter;
    return matchesSearch && matchesOperation;
  });

  const operationTypes = [...new Set(history.map(entry => entry.operation))];

  return (
    <div className="space-y-6">
      {/* Фильтры и действия */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>История операций</CardTitle>
            <Button onClick={() => setShowAddModal(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Добавить операцию
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск</Label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Поиск по операции или описанию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="operation">Тип операции</Label>
              <select
                id="operation"
                value={operationFilter}
                onChange={(e) => setOperationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Все операции</option>
                {operationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список операций */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((entry, index) => (
                <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">{entry.operation}</h3>
                        <Badge color={entry.amount > 0 ? 'green' : 'red'}>
                          {entry.amount > 0 ? 'Поступление' : 'Расход'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(entry.date)}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          entry.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.amount > 0 ? '+' : ''}{formatCurrency(entry.amount, 'RUB')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(entry)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {entry.documentUrl && (
                    <div className="mt-2">
                      <a
                        href={entry.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        📄 Документ
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет операций</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Показано {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} из {pagination.total}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}

      {/* Модальное окно добавления */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={closeModals}
          title="Добавить операцию"
          size="md"
        >
          <form onSubmit={handleSubmit(handleAddEntry)} className="space-y-4">
            {error && (
              <Alert type="error" title="Ошибка" message={error} />
            )}

            <div>
              <Label htmlFor="operation">Операция *</Label>
              <Input
                id="operation"
                {...register('operation')}
                className={errors.operation ? 'border-red-500' : ''}
                placeholder="Например: Взнос в компенсационный фонд"
              />
              {errors.operation && (
                <p className="text-sm text-red-600 mt-1">{errors.operation.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Сумма *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-red-500' : ''}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Описание *</Label>
              <textarea
                id="description"
                {...register('description')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Подробное описание операции"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="documentUrl">Ссылка на документ</Label>
              <Input
                id="documentUrl"
                {...register('documentUrl')}
                placeholder="https://example.com/document.pdf"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModals}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Добавление...' : 'Добавить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Модальное окно редактирования */}
      {showEditModal && editingEntry && (
        <Modal
          isOpen={true}
          onClose={closeModals}
          title="Редактировать операцию"
          size="md"
        >
          <form onSubmit={handleSubmit(handleEditEntry)} className="space-y-4">
            {error && (
              <Alert type="error" title="Ошибка" message={error} />
            )}

            <div>
              <Label htmlFor="edit-operation">Операция *</Label>
              <Input
                id="edit-operation"
                {...register('operation')}
                className={errors.operation ? 'border-red-500' : ''}
              />
              {errors.operation && (
                <p className="text-sm text-red-600 mt-1">{errors.operation.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-amount">Сумма *</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description">Описание *</Label>
              <textarea
                id="edit-description"
                {...register('description')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-documentUrl">Ссылка на документ</Label>
              <Input
                id="edit-documentUrl"
                {...register('documentUrl')}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={closeModals}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
