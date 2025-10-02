import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { MagnifyingGlassIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function RegistryPage() {
  return (
    <Layout
      title="Реестр арбитражных управляющих - СРО АУ"
      description="Поиск арбитражных управляющих в реестре СРО. Поиск по ФИО, ИНН, номеру в реестре."
      keywords="реестр, арбитражные управляющие, поиск, ФИО, ИНН"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Реестр арбитражных управляющих
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Поиск арбитражных управляющих - членов саморегулируемой организации. 
            Используйте форму поиска для быстрого нахождения нужного специалиста.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Поиск в реестре
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                label="ФИО арбитражного управляющего"
                placeholder="Введите ФИО"
                leftIcon={<UserGroupIcon className="h-5 w-5" />}
              />
              <Input
                label="ИНН"
                placeholder="Введите ИНН (12 цифр)"
                leftIcon={<DocumentTextIcon className="h-5 w-5" />}
              />
              <Input
                label="Номер в реестре"
                placeholder="Введите номер"
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1 sm:flex-none">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Найти
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none">
                Сбросить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    Результаты поиска
                  </h2>
                  <span className="text-sm text-neutral-600">
                    Найдено: 150 арбитражных управляющих
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Results */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div 
                      key={item}
                      className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            Иванов Иван Иванович
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
                            <div>
                              <span className="font-medium">ИНН:</span> 123456789012
                            </div>
                            <div>
                              <span className="font-medium">Номер в реестре:</span> АУ-001
                            </div>
                            <div>
                              <span className="font-medium">Телефон:</span> +7 (495) 123-45-67
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> ivanov@example.com
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Действующий
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Предыдущая
                    </Button>
                    <Button size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">
                      Следующая
                    </Button>
                  </nav>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Фильтры
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Статус
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-neutral-300 text-beige-600 focus:ring-beige-500" defaultChecked />
                        <span className="ml-2 text-sm text-neutral-700">Действующие</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-neutral-300 text-beige-600 focus:ring-beige-500" />
                        <span className="ml-2 text-sm text-neutral-700">Исключенные</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Регион
                    </label>
                    <select className="form-input">
                      <option>Все регионы</option>
                      <option>Москва</option>
                      <option>Санкт-Петербург</option>
                      <option>Московская область</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Статистика
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Всего в реестре:</span>
                    <span className="text-sm font-medium text-neutral-900">150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Действующие:</span>
                    <span className="text-sm font-medium text-green-600">145</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600">Исключенные:</span>
                    <span className="text-sm font-medium text-red-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
