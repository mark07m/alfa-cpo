import Layout from '@/components/layout/Layout';
import { InformationUpdate, InformationItem } from '@/components/control';

export default function InformationUpdatesPage() {
  const informationItems: InformationItem[] = [
    {
      id: 1,
      name: 'Устав СРО',
      placementDate: '10.01.2014',
      lastUpdateDate: '15.03.2023',
      status: 'updated',
      description: 'Учредительный документ саморегулируемой организации',
      responsible: 'Юридический отдел'
    },
    {
      id: 2,
      name: 'Правила профессиональной деятельности',
      placementDate: '15.01.2014',
      lastUpdateDate: '20.11.2023',
      status: 'updated',
      description: 'Стандарты и правила деятельности арбитражных управляющих',
      responsible: 'Методологический отдел'
    },
    {
      id: 3,
      name: 'Состав органов управления',
      placementDate: '10.01.2014',
      lastUpdateDate: '01.12.2023',
      status: 'updated',
      description: 'Информация о руководящих органах СРО',
      responsible: 'Секретариат'
    },
    {
      id: 4,
      name: 'График проверок',
      placementDate: '01.01.2024',
      lastUpdateDate: '01.01.2024',
      status: 'current',
      description: 'План проведения проверок деятельности членов СРО на 2024 год',
      responsible: 'Отдел контроля',
      nextUpdate: '01.01.2025'
    },
    {
      id: 5,
      name: 'Реестр членов СРО',
      placementDate: '10.01.2014',
      lastUpdateDate: '15.01.2024',
      status: 'updated',
      description: 'Список арбитражных управляющих - членов СРО',
      responsible: 'Отдел реестра'
    },
    {
      id: 6,
      name: 'Сведения о компенсационном фонде',
      placementDate: '10.01.2014',
      lastUpdateDate: '15.12.2023',
      status: 'updated',
      description: 'Информация о размере и состоянии компенсационного фонда',
      responsible: 'Финансовый отдел'
    },
    {
      id: 7,
      name: 'Бухгалтерская отчетность',
      placementDate: '31.12.2022',
      lastUpdateDate: '31.12.2022',
      status: 'needs_update',
      description: 'Годовая бухгалтерская отчетность за 2022 год',
      responsible: 'Бухгалтерия',
      nextUpdate: '31.12.2024'
    },
    {
      id: 8,
      name: 'Отчет о деятельности СРО',
      placementDate: '31.12.2022',
      lastUpdateDate: '31.12.2022',
      status: 'needs_update',
      description: 'Годовой отчет о деятельности СРО за 2022 год',
      responsible: 'Аналитический отдел',
      nextUpdate: '31.12.2024'
    },
    {
      id: 9,
      name: 'Положение о компенсационном фонде',
      placementDate: '15.01.2014',
      lastUpdateDate: '20.05.2023',
      status: 'updated',
      description: 'Порядок формирования и использования компенсационного фонда',
      responsible: 'Юридический отдел'
    },
    {
      id: 10,
      name: 'Политика обработки персональных данных',
      placementDate: '01.09.2023',
      lastUpdateDate: '01.09.2023',
      status: 'current',
      description: 'Политика в отношении обработки персональных данных',
      responsible: 'Отдел информационной безопасности'
    }
  ];

  const handleExport = () => {
    console.log('Exporting information updates...');
  };

  return (
    <Layout
      title="Информация о размещении и обновлении сведений - СРО АУ"
      description="Информация о размещении и обновлении сведений на сайте СРО в соответствии с требованиями законодательства."
      keywords="информация, обновления, размещение сведений, СРО, законодательство"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Информация о размещении и обновлении сведений
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Сведения о размещении и обновлении информации на сайте саморегулируемой организации 
            в соответствии с требованиями федерального законодательства.
          </p>
        </div>

        <InformationUpdate 
          information={informationItems}
          onExport={handleExport}
        />
      </div>
    </Layout>
  );
}
