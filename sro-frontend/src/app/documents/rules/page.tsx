import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  DocumentTextIcon, 
  BookOpenIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

export default function ProfessionalRulesPage() {
  const rules = [
    {
      id: 'code-of-ethics',
      name: 'Кодекс этики арбитражных управляющих',
      description: 'Основные этические принципы и нормы поведения арбитражных управляющих',
      lastUpdated: '15.03.2023',
      size: '456 КБ',
      sections: [
        'Общие положения',
        'Принципы профессиональной этики',
        'Обязанности арбитражного управляющего',
        'Запреты и ограничения',
        'Ответственность за нарушения'
      ]
    },
    {
      id: 'federal-standards',
      name: 'Федеральные стандарты деятельности',
      description: 'Стандарты деятельности арбитражных управляющих, утвержденные Минэкономразвития России',
      lastUpdated: '01.09.2023',
      size: '1.2 МБ',
      sections: [
        'Стандарт проведения процедуры наблюдения',
        'Стандарт проведения процедуры финансового оздоровления',
        'Стандарт проведения процедуры внешнего управления',
        'Стандарт проведения процедуры конкурсного производства',
        'Стандарт проведения процедуры мирового соглашения'
      ]
    },
    {
      id: 'internal-rules',
      name: 'Внутренние правила СРО',
      description: 'Правила профессиональной деятельности, принятые саморегулируемой организацией',
      lastUpdated: '20.11.2023',
      size: '678 КБ',
      sections: [
        'Правила ведения дел',
        'Правила взаимодействия с участниками процедур',
        'Правила отчетности и документооборота',
        'Правила профессионального развития',
        'Правила разрешения споров'
      ]
    }
  ];

  return (
    <Layout
      title="Правила профессиональной деятельности - СРО АУ"
      description="Правила и стандарты профессиональной деятельности арбитражных управляющих, кодекс этики."
      keywords="правила, стандарты, этика, арбитражные управляющие, профессиональная деятельность"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Правила профессиональной деятельности
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Стандарты и правила профессиональной деятельности арбитражных управляющих, 
            кодекс этики и внутренние регламенты саморегулируемой организации.
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Обязательность соблюдения
              </h3>
              <p className="text-blue-700">
                Все члены саморегулируемой организации обязаны соблюдать установленные 
                правила и стандарты профессиональной деятельности. Нарушение правил 
                влечет применение мер дисциплинарного воздействия.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rules List */}
        <div className="space-y-8">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <ScaleIcon className="h-8 w-8 text-beige-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                        {rule.name}
                      </h2>
                      <p className="text-neutral-600 mb-4">
                        {rule.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          Обновлено: {rule.lastUpdated}
                        </div>
                        <div className="flex items-center">
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Размер: {rule.size}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Скачать
                    </Button>
                    <Button variant="outline" size="sm">
                      <PrinterIcon className="h-4 w-4 mr-2" />
                      Печать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Содержание документа:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rule.sections.map((section, index) => (
                      <div key={index} className="flex items-center">
                        <BookOpenIcon className="h-5 w-5 text-beige-600 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <Card className="mt-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Быстрый доступ
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <UserGroupIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Для членов СРО
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Внутренние правила и регламенты
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ScaleIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Федеральные стандарты
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Обязательные для всех управляющих
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Кодекс этики
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Этические принципы профессии
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>

              <div className="text-center">
                <div className="bg-beige-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-beige-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Все документы
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Полный список правил и стандартов
                </p>
                <Button size="sm" variant="outline">
                  Подробнее
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Документов
              </h3>
              <p className="text-2xl font-bold text-beige-700">3</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <BookOpenIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Разделов
              </h3>
              <p className="text-2xl font-bold text-beige-700">15</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <ScaleIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Стандартов
              </h3>
              <p className="text-2xl font-bold text-beige-700">5</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
