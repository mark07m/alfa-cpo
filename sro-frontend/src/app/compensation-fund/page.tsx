import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { BanknotesIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function CompensationFundPage() {
  return (
    <Layout
      title="Компенсационный фонд - СРО АУ"
      description="Информация о компенсационном фонде СРО: размер, реквизиты, документы."
      keywords="компенсационный фонд, реквизиты, размер фонда"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Компенсационный фонд
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Информация о компенсационном фонде саморегулируемой организации 
            арбитражных управляющих в соответствии с требованиями законодательства.
          </p>
        </div>

        {/* Fund Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                  Информация о фонде
                </h2>
              </CardHeader>
              <CardContent>
                <div className="prose">
                  <p className="mb-4">
                    Компенсационный фонд саморегулируемой организации арбитражных управляющих 
                    создан в соответствии с требованиями Федерального закона "О несостоятельности 
                    (банкротстве)" и предназначен для возмещения ущерба, причиненного арбитражными 
                    управляющими при исполнении возложенных на них обязанностей.
                  </p>
                  <p className="mb-4">
                    Размер компенсационного фонда формируется за счет взносов членов СРО и 
                    не может быть менее 50 000 рублей на каждого члена саморегулируемой организации.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="text-center">
                <BanknotesIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Размер фонда
                </h3>
                <p className="text-2xl font-bold text-beige-700 mb-2">7 500 000 ₽</p>
                <p className="text-sm text-neutral-600">на 01.01.2024</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <CalendarIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Последнее обновление
                </h3>
                <p className="text-neutral-600">15.12.2023</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Документы
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Справка о размере фонда
                </p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                  Скачать PDF
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bank Details */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Реквизиты счета компенсационного фонда
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Банковские реквизиты
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-neutral-700">Наименование банка:</span>
                    <p className="text-neutral-900">ПАО "Сбербанк"</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">БИК:</span>
                    <p className="text-neutral-900">044525225</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Корреспондентский счет:</span>
                    <p className="text-neutral-900">30101810400000000225</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Реквизиты получателя
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-neutral-700">Получатель:</span>
                    <p className="text-neutral-900">СРО Арбитражных Управляющих</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">ИНН:</span>
                    <p className="text-neutral-900">1234567890</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">КПП:</span>
                    <p className="text-neutral-900">123456789</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-700">Расчетный счет:</span>
                    <p className="text-neutral-900">40702810100000000001</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund History */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              История изменений фонда
            </h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Операция
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Размер фонда
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      15.12.2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      Пополнение фонда
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +500 000 ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      7 500 000 ₽
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      01.10.2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      Пополнение фонда
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +300 000 ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      7 000 000 ₽
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      01.07.2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      Пополнение фонда
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +200 000 ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      6 700 000 ₽
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Документы
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <DocumentTextIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Справка о размере фонда
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Справка банка о размере компенсационного фонда на 01.01.2024
                </p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                  Скачать PDF (245 КБ)
                </button>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <DocumentTextIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Положение о фонде
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Положение о компенсационном фонде СРО
                </p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                  Скачать PDF (156 КБ)
                </button>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <DocumentTextIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Отчет о деятельности
                </h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Отчет о деятельности СРО за 2023 год
                </p>
                <button className="text-beige-600 hover:text-beige-700 text-sm font-medium">
                  Скачать PDF (1.2 МБ)
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
