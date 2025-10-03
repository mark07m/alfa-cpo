import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function StructurePage() {
  return (
    <Layout
      title="Структура - СРО Арбитражных Управляющих"
      description="Организационная структура управления саморегулируемой организации арбитражных управляющих."
      keywords="структура, СРО, арбитражные управляющие, управление, органы, комитеты"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Организационная структура
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Структура управления саморегулируемой организации арбитражных управляющих
          </p>
        </div>

        {/* Organizational Chart */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Схема управления
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* General Assembly */}
              <div className="text-center">
                <Card className="max-w-md mx-auto bg-beige-50 border-beige-200">
                  <CardContent className="py-6">
                    <BuildingOfficeIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Общее собрание членов
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Высший орган управления
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-beige-300"></div>
              </div>

              {/* Board of Directors */}
              <div className="text-center">
                <Card className="max-w-md mx-auto bg-beige-50 border-beige-200">
                  <CardContent className="py-6">
                    <BriefcaseIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Правление
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      Исполнительный орган управления
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow down */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-beige-300"></div>
              </div>

              {/* President and Committees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Card className="bg-beige-50 border-beige-200">
                    <CardContent className="py-6">
                      <UserGroupIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Президент
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        Руководитель Ассоциации
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Card className="bg-beige-50 border-beige-200">
                    <CardContent className="py-6">
                      <AcademicCapIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Комитеты
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        Специализированные органы
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Bodies */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Органы управления
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Общее собрание членов
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Высший орган управления Ассоциации, состоящий из всех членов СРО. 
                      Собирается не реже одного раза в год.
                    </p>
                    <h4 className="font-semibold text-neutral-900 mb-2">Полномочия:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Избрание правления и президента</li>
                      <li>Утверждение устава и изменений к нему</li>
                      <li>Принятие решений о реорганизации и ликвидации</li>
                      <li>Утверждение годового отчета и бюджета</li>
                      <li>Принятие решений по важнейшим вопросам деятельности</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <BriefcaseIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Правление
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Исполнительный орган управления, осуществляющий текущее руководство 
                      деятельностью Ассоциации между общими собраниями.
                    </p>
                    <h4 className="font-semibold text-neutral-900 mb-2">Состав:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Президент Ассоциации</li>
                      <li>Вице-президент</li>
                      <li>5 членов правления</li>
                      <li>Секретарь (без права голоса)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <UserGroupIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Президент
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Руководитель Ассоциации, избираемый общим собранием на срок 3 года. 
                      Осуществляет общее руководство деятельностью СРО.
                    </p>
                    <h4 className="font-semibold text-neutral-900 mb-2">Полномочия:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Представление интересов Ассоциации</li>
                      <li>Руководство деятельностью правления</li>
                      <li>Подписание документов от имени СРО</li>
                      <li>Назначение руководителей структурных подразделений</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Комитеты и комиссии
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4">
                      Специализированные органы, создаваемые для решения конкретных 
                      задач в различных сферах деятельности Ассоциации.
                    </p>
                    <h4 className="font-semibold text-neutral-900 mb-2">Виды комитетов:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Комитет по этике</li>
                      <li>Комитет по контролю</li>
                      <li>Комитет по образованию</li>
                      <li>Ревизионная комиссия</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Committees Details */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Комитеты и комиссии
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <ShieldCheckIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Комитет по этике
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Рассматривает вопросы соблюдения этических норм и профессиональной 
                      этики арбитражными управляющими.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Председатель:</span> Петров П.П.
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Состав:</span> 5 членов
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Срок полномочий:</span> 2 года
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <CogIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Комитет по контролю
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Осуществляет контроль за соблюдением членами Ассоциации требований 
                      законодательства и внутренних документов.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Председатель:</span> Сидоров С.С.
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Состав:</span> 7 членов
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Срок полномочий:</span> 2 года
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Комитет по образованию
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Разрабатывает программы повышения квалификации и организует 
                      образовательные мероприятия для членов Ассоциации.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Председатель:</span> Козлов К.К.
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Состав:</span> 6 членов
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Срок полномочий:</span> 2 года
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <ChartBarIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Ревизионная комиссия
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Осуществляет контроль за финансово-хозяйственной деятельностью 
                      Ассоциации и использованием средств компенсационного фонда.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Председатель:</span> Волков В.В.
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Состав:</span> 3 члена
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Срок полномочий:</span> 2 года
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Structure */}
        <Card className="mb-12">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Административная структура
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Секретариат
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Обеспечивает организационную поддержку деятельности органов управления.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Руководитель:</span> Секретарь
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Сотрудники:</span> 5 человек
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-beige-600 mr-3" />
                    Образовательный центр
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Организует образовательные программы и мероприятия для членов СРО.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Руководитель:</span> Директор центра
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Сотрудники:</span> 8 человек
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <CogIcon className="h-6 w-6 text-beige-600 mr-3" />
                    IT-отдел
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="prose">
                    <p className="mb-4 text-sm">
                      Обеспечивает техническую поддержку и развитие информационных систем.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Руководитель:</span> IT-директор
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Сотрудники:</span> 4 человека
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Decision Making Process */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
              Процедуры принятия решений
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Общее собрание</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Созывается не реже одного раза в год</li>
                <li>Кворум составляет 50% + 1 голос от общего числа членов</li>
                <li>Решения принимаются простым большинством голосов</li>
                <li>Важные вопросы требуют квалифицированного большинства (2/3 голосов)</li>
              </ul>

              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Правление</h3>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Собирается по мере необходимости, но не реже 1 раза в квартал</li>
                <li>Кворум составляет 50% + 1 голос от числа членов правления</li>
                <li>Решения принимаются простым большинством голосов</li>
                <li>При равенстве голосов решающий голос имеет председатель</li>
              </ul>

              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Комитеты</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Собираются по мере необходимости</li>
                <li>Кворум составляет большинство от числа членов комитета</li>
                <li>Решения принимаются простым большинством голосов</li>
                <li>Решения носят рекомендательный характер</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
