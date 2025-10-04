'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Calendar } from '@/components/admin/inspections/Calendar';
import { InspectionDetails } from '@/components/admin/inspections/InspectionDetails';
import { Button } from '@/components/admin/ui/Button';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useInspections } from '@/hooks/admin/useInspections';

export default function InspectionsCalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const { inspections, loading } = useInspections();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dayInspections = inspections.filter(inspection => {
      const inspectionDate = new Date(inspection.plannedDate);
      return inspectionDate.toDateString() === date.toDateString();
    });
    setSelectedInspection(dayInspections.length > 0 ? dayInspections[0] : null);
  };

  const handleInspectionSelect = (inspection: any) => {
    setSelectedInspection(inspection);
  };

  const handleCreateInspection = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Назад</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Календарь проверок</h1>
              <p className="text-gray-600">Планирование и просмотр проверок по датам</p>
            </div>
          </div>
          <Button onClick={handleCreateInspection} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Создать проверку</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Календарь */}
          <div className="lg:col-span-2">
            <Calendar
              inspections={inspections}
              loading={loading}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onInspectionSelect={handleInspectionSelect}
            />
          </div>

          {/* Детали проверки */}
          <div className="lg:col-span-1">
            <InspectionDetails
              inspection={selectedInspection}
              selectedDate={selectedDate}
              onCreateInspection={handleCreateInspection}
            />
          </div>
        </div>

        {/* Форма создания проверки */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Здесь будет форма создания проверки */}
              <div className="text-center py-8">
                <p className="text-gray-500">Форма создания проверки будет добавлена</p>
                <Button onClick={handleCloseForm} className="mt-4">
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
