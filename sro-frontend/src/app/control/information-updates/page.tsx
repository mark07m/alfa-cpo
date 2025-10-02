import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { 
  InformationCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function InformationUpdatesPage() {
  const informationItems = [
    {
      id: 1,
      name: 'Устав СРО',
      initialDate: '10.01.2014',
      lastUpdate: '15.03.2023',
      status: 'updated',
      description: 'Учредительный документ саморегулируемой организации'
    },
    {
      id: 2,
      name: 'Правила профессиональной деятельности',
      initialDate: '15.01.2014',
      lastUpdate: '20.11.2023',
      status: 'updated',
      description: 'Стандарты и правила деятельности арбитражных управляющих'
    },
    {
      id: 3,
      name: 'Состав органов управления',
      initialDate: '10.01.2014',
      lastUpdate: '01.12.2023',
      status: 'updated',
      description: 'Информация о руководящих органах СРО'
    },
    {
      id: 4,
      name: 'График проверок',
      initialDate: '01.01.2024',
      lastUpdate: '01.01.2024',
      status: 'current',
      description: 'План проведения проверок деятельности членов СРО на 2024 год'
    },
    {
      id: 5,
      name: 'Реестр членов СРО',
      initialDate: '10.01.2014',
      lastUpdate: '15.01.2024',
      status: 'updated',
      description: 'Список арбитражных управляющих - членов СРО'
    },
    {
      id: 6,
      name: 'Сведения о компенсационном фонде',
      initialDate: '10.01.2014',
      lastUpdate: '15.12.2023',
      status: 'updated',
      description: 'Информация о размере и состоянии компенсационного фонда'
    },
    {
      id: 7,
      name: 'Бухгалтерская отчетность',
      initialDate: '31.12.2022',
      lastUpdate: '31.12.2022',
      status: 'outdated',
      description: 'Годовая бухгалтерская отчетность за 2022 год'
    },
    {
      id: 8,
      name: 'Отчет о деятельности СРО',
      initialDate: '31.12.2022',
      lastUpdate: '31.12.2022',
      status: 'outdated',
      description: 'Годовой отчет о деятельности СРО за 2022 год'
    },
    {
      id: 9,
      name: 'Положение о компенсационном фонде',
      initialDate: '15.01.2014',
      lastUpdate: '20.05.2023',
      status: 'updated',
      description: 'Порядок формирования и использования компенсационного фонда'
    },
    {
      id: 10,
      name: 'Политика обработки персональных данных',
      initialDate: '01.09.2023',
      lastUpdate: '01.09.2023',
      status: 'current',
      description: 'Политика в отношении обработки персональных данных'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'updated':
        return {
          icon: CheckCircleIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Обновлено'
        };
      case 'current':
        return {
          icon: CheckCircleIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Актуально'
        };
      case 'outdated':
        return {
          icon: ExclamationTriangleIcon,
          color: 'text-amber-600',
          bgColor: 'bg-amber-100',
          text: 'Требует обновления'
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Неизвестно'
        };
    }
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

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Правовая основа
              </h3>
              <p className="text-blue-700">
                Размещение сведений о деятельности саморегулируемой организации 
                осуществляется в соответствии с требованиями Федерального закона 
                "О несостоятельности (банкротстве)" и иных нормативных правовых актов.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information Table */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Сведения о размещении и обновлении информации
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Наименование сведений
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Описание
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Дата размещения
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Дата последнего обновления
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {informationItems.map((item) => {
                    const statusInfo = getStatusInfo(item.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={item.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-neutral-600 max-w-xs">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-neutral-900">
                            <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                            {item.initialDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-neutral-900">
                            <ClockIcon className="h-4 w-4 mr-2 text-beige-600" />
                            {item.lastUpdate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Обозначения статусов
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Обновлено
                </span>
                <span className="text-sm text-neutral-600">
                  Информация была обновлена после первоначального размещения
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Актуально
                </span>
                <span className="text-sm text-neutral-600">
                  Информация актуальна и не требует обновления
                </span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mr-3">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  Требует обновления
                </span>
                <span className="text-sm text-neutral-600">
                  Информация устарела и требует обновления
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Всего сведений
              </h3>
              <p className="text-2xl font-bold text-beige-700">{informationItems.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Обновлено
              </h3>
              <p className="text-2xl font-bold text-green-700">
                {informationItems.filter(item => item.status === 'updated').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Актуально
              </h3>
              <p className="text-2xl font-bold text-blue-700">
                {informationItems.filter(item => item.status === 'current').length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Требует обновления
              </h3>
              <p className="text-2xl font-bold text-amber-700">
                {informationItems.filter(item => item.status === 'outdated').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
