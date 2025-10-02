import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  ShieldCheckIcon, 
  CalendarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function ControlActivityPage() {
  const inspectionSchedule = [
    {
      id: 1,
      manager: 'Иванов И.И.',
      region: 'Москва',
      date: '15.03.2024',
      type: 'Плановая',
      status: 'Запланирована'
    },
    {
      id: 2,
      manager: 'Петров П.П.',
      region: 'Санкт-Петербург',
      date: '22.03.2024',
      type: 'Плановая',
      status: 'Запланирована'
    },
    {
      id: 3,
      manager: 'Сидоров С.С.',
      region: 'Московская область',
      date: '05.04.2024',
      type: 'Внеплановая',
      status: 'Запланирована'
    }
  ];

  const inspectionResults = [
    {
      id: 1,
      manager: 'Козлов К.К.',
      date: '10.01.2024',
      type: 'Плановая',
      result: 'Нарушений не выявлено',
      status: 'completed',
      report: true
    },
    {
      id: 2,
      manager: 'Морозов М.М.',
      date: '15.12.2023',
      type: 'Внеплановая',
      result: 'Выявлены нарушения',
      status: 'completed',
      report: true
    },
    {
      id: 3,
      manager: 'Волков В.В.',
      date: '20.11.2023',
      type: 'Плановая',
      result: 'Нарушений не выявлено',
      status: 'completed',
      report: true
    }
  ];

  const disciplinaryMeasures = [
    {
      id: 1,
      manager: 'Морозов М.М.',
      date: '20.12.2023',
      measure: 'Предупреждение',
      reason: 'Нарушение сроков подачи отчетности',
      status: 'active'
    },
    {
      id: 2,
      manager: 'Новиков Н.Н.',
      date: '10.10.2023',
      measure: 'Выговор',
      reason: 'Несоблюдение стандартов профессиональной деятельности',
      status: 'active'
    },
    {
      id: 3,
      manager: 'Федоров Ф.Ф.',
      date: '05.09.2023',
      measure: 'Исключение из СРО',
      reason: 'Грубое нарушение законодательства',
      status: 'completed'
    }
  ];

  return (
    <Layout
      title="Контроль деятельности членов СРО - СРО АУ"
      description="Информация о контроле деятельности арбитражных управляющих: график проверок, результаты, дисциплинарные меры."
      keywords="контроль, проверки, дисциплинарные меры, арбитражные управляющие, СРО"
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

        {/* Inspection Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              График проверок на 2024 год
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Арбитражный управляющий
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Регион
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Дата проверки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Тип проверки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {inspectionSchedule.map((inspection) => (
                    <tr key={inspection.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        {inspection.manager}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {inspection.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {inspection.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {inspection.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {inspection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Results */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Результаты проверок
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspectionResults.map((result) => (
                <div 
                  key={result.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 mr-3">
                          {result.manager}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Завершена
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {result.date}
                        </div>
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {result.type}
                        </div>
                        <div className="flex items-center">
                          {result.result === 'Нарушений не выявлено' ? (
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                          ) : (
                            <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-600" />
                          )}
                          <span className={result.result === 'Нарушений не выявлено' ? 'text-green-600' : 'text-red-600'}>
                            {result.result}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {result.report ? (
                        <Button size="sm" variant="outline">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Отчет
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Отчет недоступен
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disciplinary Measures */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Дисциплинарные меры
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {disciplinaryMeasures.map((measure) => (
                <div 
                  key={measure.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 mr-3">
                          {measure.manager}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          measure.status === 'active' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {measure.status === 'active' ? (
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircleIcon className="h-3 w-3 mr-1" />
                          )}
                          {measure.status === 'active' ? 'Действует' : 'Завершено'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {measure.date}
                        </div>
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {measure.measure}
                        </div>
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {measure.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
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
