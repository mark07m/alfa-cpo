import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { 
  DocumentTextIcon, 
  ScaleIcon, 
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function DocumentsPage() {
  return (
    <Layout
      title="Документы - СРО Арбитражных Управляющих"
      description="Нормативные документы, правила деятельности, учредительные документы саморегулируемой организации арбитражных управляющих."
      keywords="документы, нормативные акты, правила, устав, СРО, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Документооборот СРО
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Полный комплект документов саморегулируемой организации арбитражных управляющих: 
            от учредительных документов до правил профессиональной деятельности
          </p>
        </div>

        {/* Document Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-8 text-center">
            Основные разделы документооборота
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <ScaleIcon className="h-8 w-8 text-beige-600 mr-3" />
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Учредительные и нормативные документы
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-6">
                  Основополагающие документы СРО, определяющие правовой статус, 
                  цели и принципы деятельности организации.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Устав саморегулируемой организации</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Свидетельства о государственной регистрации</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Выписки из ЕГРЮЛ</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Положения о компенсационном фонде</span>
                  </div>
                </div>
                <a 
                  href="/documents/regulatory" 
                  className="inline-flex items-center text-beige-600 hover:text-beige-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  Просмотреть документы
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200 group">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-beige-600 mr-3" />
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Правила и стандарты деятельности
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 mb-6">
                  Документы, регламентирующие профессиональную деятельность 
                  арбитражных управляющих и этические нормы.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Кодекс этики арбитражных управляющих</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Федеральные стандарты деятельности</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Внутренние правила СРО</span>
                  </div>
                  <div className="flex items-center text-sm text-neutral-600">
                    <DocumentTextIcon className="h-4 w-4 mr-2 text-beige-500" />
                    <span>Методические рекомендации</span>
                  </div>
                </div>
                <a 
                  href="/documents/rules" 
                  className="inline-flex items-center text-beige-600 hover:text-beige-700 font-medium group-hover:translate-x-1 transition-transform duration-200"
                >
                  Просмотреть правила
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Популярные документы
            </h2>
            <p className="text-neutral-600">
              Наиболее востребованные документы для быстрого доступа
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a 
                href="/documents/regulatory" 
                className="flex items-center p-6 border border-neutral-200 rounded-lg hover:bg-beige-50 hover:border-beige-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-beige-200 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-beige-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-beige-700">Устав СРО</p>
                  <p className="text-sm text-neutral-600">Основополагающий документ организации</p>
                </div>
              </a>

              <a 
                href="/documents/rules" 
                className="flex items-center p-6 border border-neutral-200 rounded-lg hover:bg-beige-50 hover:border-beige-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-beige-200 transition-colors">
                  <ScaleIcon className="h-6 w-6 text-beige-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-beige-700">Кодекс этики</p>
                  <p className="text-sm text-neutral-600">Этические принципы деятельности</p>
                </div>
              </a>

              <a 
                href="/documents/regulatory" 
                className="flex items-center p-6 border border-neutral-200 rounded-lg hover:bg-beige-50 hover:border-beige-300 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-beige-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-beige-200 transition-colors">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-beige-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-beige-700">Свидетельства</p>
                  <p className="text-sm text-neutral-600">Документы о регистрации</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Document Statistics */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Общая информация о документообороте
            </h2>
            <p className="text-neutral-600">
              Актуальная статистика по количеству и типам документов в системе
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-beige-100 to-beige-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl font-bold text-beige-700">12</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Учредительные документы</h3>
                <p className="text-sm text-neutral-600">Устав, свидетельства, выписки</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-beige-100 to-beige-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl font-bold text-beige-700">8</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Правила деятельности</h3>
                <p className="text-sm text-neutral-600">Стандарты и кодексы</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-beige-100 to-beige-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl font-bold text-beige-700">15</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Формы и бланки</h3>
                <p className="text-sm text-neutral-600">Шаблоны документов</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-beige-100 to-beige-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-3xl font-bold text-beige-700">6</span>
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">Отчеты</h3>
                <p className="text-sm text-neutral-600">Годовые и периодические</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <div className="flex items-center justify-center text-sm text-neutral-600">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                <span>Последнее обновление: 01.12.2023</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
