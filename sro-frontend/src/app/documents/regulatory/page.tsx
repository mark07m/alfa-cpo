import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function RegulatoryDocumentsPage() {
  const documentCategories = [
    {
      id: 'founding',
      name: 'Учредительные документы',
      description: 'Устав, свидетельства о регистрации, выписки из реестра',
      documents: [
        {
          name: 'Устав СРО Арбитражных Управляющих',
          date: '15.03.2023',
          size: '245 КБ',
          description: 'Устав саморегулируемой организации арбитражных управляющих, редакция от 15.03.2023'
        },
        {
          name: 'Свидетельство о государственной регистрации',
          date: '10.01.2014',
          size: '156 КБ',
          description: 'Свидетельство о государственной регистрации юридического лица'
        },
        {
          name: 'Свидетельство о постановке на налоговый учет',
          date: '10.01.2014',
          size: '89 КБ',
          description: 'Свидетельство о постановке на учет в налоговом органе'
        },
        {
          name: 'Выписка из реестра СРО АУ',
          date: '01.12.2023',
          size: '1.2 МБ',
          description: 'Выписка из единого государственного реестра саморегулируемых организаций'
        }
      ]
    },
    {
      id: 'internal',
      name: 'Внутренние документы',
      description: 'Положения, приказы, политики организации',
      documents: [
        {
          name: 'Положение о компенсационном фонде',
          date: '20.05.2023',
          size: '178 КБ',
          description: 'Положение о порядке формирования и использования компенсационного фонда'
        },
        {
          name: 'Положение о дисциплинарной ответственности',
          date: '15.08.2023',
          size: '234 КБ',
          description: 'Положение о порядке применения мер дисциплинарного воздействия'
        },
        {
          name: 'Политика обработки персональных данных',
          date: '01.09.2023',
          size: '167 КБ',
          description: 'Политика в отношении обработки персональных данных'
        }
      ]
    },
    {
      id: 'regulatory',
      name: 'Нормативные акты',
      description: 'Федеральные законы и подзаконные акты',
      documents: [
        {
          name: 'ФЗ "О несостоятельности (банкротстве)"',
          date: '26.10.2002',
          size: '2.1 МБ',
          description: 'Федеральный закон от 26.10.2002 № 127-ФЗ "О несостоятельности (банкротстве)"'
        },
        {
          name: 'Приказ Минэкономразвития о требованиях к СРО',
          date: '15.12.2022',
          size: '456 КБ',
          description: 'Приказ Минэкономразвития России от 15.12.2022 № 1234'
        }
      ]
    }
  ];

  return (
    <Layout
      title="Нормативные документы СРО - СРО АУ"
      description="Нормативные и учредительные документы саморегулируемой организации арбитражных управляющих."
      keywords="документы, нормативные акты, устав, СРО, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Нормативные документы СРО
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Учредительные документы, внутренние положения и нормативные акты, 
            регламентирующие деятельность саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Поиск документов
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Название документа"
                placeholder="Введите название документа"
                leftIcon={<DocumentTextIcon className="h-5 w-5" />}
              />
              <Input
                label="Категория"
                placeholder="Выберите категорию"
                leftIcon={<FolderIcon className="h-5 w-5" />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 sm:flex-none">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Найти документы
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                Важная информация
              </h3>
              <p className="text-amber-700">
                Все документы представлены в формате PDF. Для просмотра документов 
                необходимо наличие программы для чтения PDF-файлов. Документы 
                актуализируются в соответствии с изменениями в законодательстве.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Document Categories */}
        <div className="space-y-8">
          {documentCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <FolderIcon className="h-8 w-8 text-beige-600 mr-3" />
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      {category.name}
                    </h2>
                    <p className="text-neutral-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <DocumentTextIcon className="h-6 w-6 text-beige-600 mr-3 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                {doc.name}
                              </h3>
                              <p className="text-neutral-600 mb-3">
                                {doc.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {doc.date}
                                </div>
                                <div className="flex items-center">
                                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                                  {doc.size}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm">
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Всего документов
              </h3>
              <p className="text-2xl font-bold text-beige-700">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Последнее обновление
              </h3>
              <p className="text-neutral-600">01.12.2023</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <FolderIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Категорий
              </h3>
              <p className="text-2xl font-bold text-beige-700">3</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
