"use client";

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import InspectionSchedule, { InspectionItem } from './InspectionSchedule';
import InspectionResults, { InspectionResult } from './InspectionResults';
import DisciplinaryMeasures, { DisciplinaryMeasure } from './DisciplinaryMeasures';
import InformationUpdate, { InformationItem } from './InformationUpdate';
import { 
  ShieldCheckIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface ControlPageProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function ControlPage({ 
  title = "Контроль деятельности членов СРО - СРО АУ",
  description = "Информация о контроле деятельности арбитражных управляющих: график проверок, результаты, дисциплинарные меры.",
  keywords = "контроль, проверки, дисциплинарные меры, арбитражные управляющие, СРО"
}: ControlPageProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'results' | 'disciplinary' | 'information'>('schedule');

  // Mock data for inspections
  const inspections: InspectionItem[] = [
    {
      id: 1,
      manager: 'Иванов И.И.',
      region: 'Москва',
      date: '15.03.2024',
      type: 'Плановая',
      status: 'Запланирована',
      inspector: 'Петров П.П.',
      notes: 'Проверка соответствия стандартам деятельности'
    },
    {
      id: 2,
      manager: 'Петров П.П.',
      region: 'Санкт-Петербург',
      date: '22.03.2024',
      type: 'Плановая',
      status: 'Запланирована',
      inspector: 'Сидоров С.С.'
    },
    {
      id: 3,
      manager: 'Сидоров С.С.',
      region: 'Московская область',
      date: '05.04.2024',
      type: 'Внеплановая',
      status: 'В процессе',
      inspector: 'Козлов К.К.',
      notes: 'Проверка по жалобе'
    },
    {
      id: 4,
      manager: 'Козлов К.К.',
      region: 'Краснодарский край',
      date: '10.01.2024',
      type: 'Плановая',
      status: 'Завершена',
      inspector: 'Морозов М.М.'
    }
  ];

  // Mock data for inspection results
  const inspectionResults: InspectionResult[] = [
    {
      id: 1,
      manager: 'Козлов К.К.',
      date: '10.01.2024',
      type: 'Плановая',
      result: 'Нарушений не выявлено',
      status: 'completed',
      report: true,
      inspector: 'Морозов М.М.',
      nextInspection: '10.01.2027'
    },
    {
      id: 2,
      manager: 'Морозов М.М.',
      date: '15.12.2023',
      type: 'Внеплановая',
      result: 'Выявлены нарушения',
      status: 'completed',
      report: true,
      violations: [
        'Нарушение сроков подачи отчетности',
        'Несоблюдение стандартов документооборота'
      ],
      recommendations: [
        'Улучшить систему документооборота',
        'Провести дополнительное обучение'
      ],
      inspector: 'Волков В.В.'
    },
    {
      id: 3,
      manager: 'Волков В.В.',
      date: '20.11.2023',
      type: 'Плановая',
      result: 'Требует доработки',
      status: 'completed',
      report: true,
      recommendations: [
        'Доработать систему внутреннего контроля'
      ],
      inspector: 'Новиков Н.Н.'
    }
  ];

  // Mock data for disciplinary measures
  const disciplinaryMeasures: DisciplinaryMeasure[] = [
    {
      id: 1,
      manager: 'Морозов М.М.',
      date: '20.12.2023',
      measure: 'Предупреждение',
      reason: 'Нарушение сроков подачи отчетности',
      status: 'active',
      document: true
    },
    {
      id: 2,
      manager: 'Новиков Н.Н.',
      date: '10.10.2023',
      measure: 'Выговор',
      reason: 'Несоблюдение стандартов профессиональной деятельности',
      status: 'active',
      document: true,
      appeal: true,
      appealDate: '15.10.2023',
      appealResult: 'Жалоба отклонена'
    },
    {
      id: 3,
      manager: 'Федоров Ф.Ф.',
      date: '05.09.2023',
      measure: 'Исключение из СРО',
      reason: 'Грубое нарушение законодательства',
      status: 'completed',
      document: true,
      appeal: true,
      appealDate: '10.09.2023',
      appealResult: 'Жалоба удовлетворена частично'
    },
    {
      id: 4,
      manager: 'Смирнов С.С.',
      date: '01.08.2023',
      measure: 'Временное приостановление',
      reason: 'Нарушение процедур проведения процедур банкротства',
      status: 'completed',
      endDate: '01.11.2023',
      document: true
    }
  ];

  // Mock data for information updates
  const informationItems: InformationItem[] = [
    {
      id: 1,
      name: 'Устав СРО',
      placementDate: '15.01.2023',
      lastUpdateDate: '01.12.2023',
      status: 'updated',
      description: 'Основной учредительный документ',
      responsible: 'Юридический отдел',
      nextUpdate: '01.12.2024'
    },
    {
      id: 2,
      name: 'Реестр членов СРО',
      placementDate: '20.01.2023',
      lastUpdateDate: '15.01.2024',
      status: 'updated',
      description: 'Список арбитражных управляющих',
      responsible: 'Отдел реестра'
    },
    {
      id: 3,
      name: 'Сведения о компенсационном фонде',
      placementDate: '25.01.2023',
      lastUpdateDate: '01.01.2024',
      status: 'current',
      description: 'Размер и реквизиты фонда',
      responsible: 'Финансовый отдел',
      nextUpdate: '01.07.2024'
    },
    {
      id: 4,
      name: 'Правила профессиональной деятельности',
      placementDate: '30.01.2023',
      lastUpdateDate: '15.06.2023',
      status: 'needs_update',
      description: 'Стандарты и правила работы',
      responsible: 'Методологический отдел',
      nextUpdate: '15.06.2024'
    },
    {
      id: 5,
      name: 'График проверок',
      placementDate: '01.02.2023',
      lastUpdateDate: '01.01.2024',
      status: 'updated',
      description: 'План проведения проверок на год',
      responsible: 'Отдел контроля'
    },
    {
      id: 6,
      name: 'Бухгалтерская отчетность',
      placementDate: '01.03.2023',
      lastUpdateDate: '31.12.2023',
      status: 'current',
      description: 'Годовая бухгалтерская отчетность',
      responsible: 'Бухгалтерия',
      nextUpdate: '31.12.2024'
    }
  ];

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting data...');
  };

  const handleViewReport = (id: number) => {
    // Mock report viewing
    console.log(`Viewing report for inspection ${id}`);
  };

  const handleViewDocument = (id: number) => {
    // Mock document viewing
    console.log(`Viewing document for measure ${id}`);
  };

  const tabs = [
    { id: 'schedule', name: 'График проверок', icon: CalendarIcon },
    { id: 'results', name: 'Результаты', icon: CheckCircleIcon },
    { id: 'disciplinary', name: 'Дисциплинарные меры', icon: ExclamationTriangleIcon },
    { id: 'information', name: 'Информация о сведениях', icon: DocumentTextIcon }
  ];

  return (
    <Layout
      title={title}
      description={description}
      keywords={keywords}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Контроль деятельности членов СРО
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о контроле за деятельностью арбитражных управляющих, 
            графике проверок, результатах и применяемых мерах воздействия.
          </p>
        </div>


        {/* Control Rules */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Правила контроля
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <p className="mb-4">
                Саморегулируемая организация осуществляет контроль за соблюдением 
                членами СРО требований законодательства и внутренних стандартов 
                профессиональной деятельности.
              </p>
              <p className="mb-4">
                Контроль включает в себя плановые и внеплановые проверки, 
                анализ отчетности, рассмотрение жалоб и обращений.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Виды контроля:
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Плановые проверки (не реже одного раза в три года)</li>
                <li>Внеплановые проверки по жалобам и обращениям</li>
                <li>Анализ отчетности и документооборота</li>
                <li>Мониторинг соблюдения стандартов деятельности</li>
                <li>Контроль за повышением квалификации</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'schedule' | 'results' | 'disciplinary' | 'information')}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-beige-500 text-beige-600'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === 'schedule' && (
            <InspectionSchedule 
              inspections={inspections}
              onExport={handleExport}
            />
          )}
          
          {activeTab === 'results' && (
            <InspectionResults 
              results={inspectionResults}
              onViewReport={handleViewReport}
              onExport={handleExport}
            />
          )}
          
          {activeTab === 'disciplinary' && (
            <DisciplinaryMeasures 
              measures={disciplinaryMeasures}
              onViewDocument={handleViewDocument}
              onExport={handleExport}
            />
          )}
          
          {activeTab === 'information' && (
            <InformationUpdate 
              information={informationItems}
              onExport={handleExport}
            />
          )}
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center">
              <ShieldCheckIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Проверок в год
              </h3>
              <p className="text-2xl font-bold text-beige-700">48</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Без нарушений
              </h3>
              <p className="text-2xl font-bold text-green-700">42</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                С нарушениями
              </h3>
              <p className="text-2xl font-bold text-red-700">6</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <UserGroupIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Дисциплинарных мер
              </h3>
              <p className="text-2xl font-bold text-beige-700">3</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
