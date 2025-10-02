import Layout from '@/components/layout/Layout';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  AcademicCapIcon, 
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function ProfessionalDevelopmentPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Семинар "Новеллы в законодательстве о банкротстве"',
      date: '15.02.2024',
      time: '10:00 - 16:00',
      location: 'г. Москва, ул. Примерная, д. 1',
      format: 'Офлайн',
      participants: 45,
      status: 'upcoming',
      description: 'Обсуждение последних изменений в законодательстве о несостоятельности (банкротстве)'
    },
    {
      id: 2,
      title: 'Онлайн-курс "Этика арбитражного управляющего"',
      date: '20.02.2024',
      time: '14:00 - 17:00',
      location: 'Онлайн',
      format: 'Онлайн',
      participants: 120,
      status: 'upcoming',
      description: 'Интерактивный курс по этическим принципам профессиональной деятельности'
    },
    {
      id: 3,
      title: 'Практический семинар "Особенности процедуры наблюдения"',
      date: '28.02.2024',
      time: '09:00 - 15:00',
      location: 'г. Санкт-Петербург, ул. Образцовая, д. 5',
      format: 'Офлайн',
      participants: 30,
      status: 'upcoming',
      description: 'Разбор практических кейсов и особенностей ведения процедуры наблюдения'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'Конференция "Современные тенденции в банкротстве"',
      date: '15.12.2023',
      participants: 150,
      status: 'completed',
      materials: true
    },
    {
      id: 5,
      title: 'Семинар "Цифровизация процедур банкротства"',
      date: '10.11.2023',
      participants: 80,
      status: 'completed',
      materials: true
    },
    {
      id: 6,
      title: 'Курс повышения квалификации "Налоговые аспекты банкротства"',
      date: '25.10.2023',
      participants: 60,
      status: 'completed',
      materials: false
    }
  ];

  return (
    <Layout
      title="Повышение уровня профессиональной подготовки - СРО АУ"
      description="Программы повышения квалификации, семинары, конференции и обучающие мероприятия для арбитражных управляющих."
      keywords="повышение квалификации, обучение, семинары, конференции, арбитражные управляющие"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-6">
            Повышение уровня профессиональной подготовки
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Программы повышения квалификации, семинары, конференции и обучающие мероприятия 
            для членов саморегулируемой организации арбитражных управляющих.
          </p>
        </div>

        {/* Policy Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Политика повышения квалификации
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose">
              <p className="mb-4">
                Саморегулируемая организация арбитражных управляющих обеспечивает 
                повышение квалификации своих членов в соответствии с требованиями 
                федерального законодательства.
              </p>
              <p className="mb-4">
                Каждый член СРО обязан проходить повышение квалификации не реже 
                одного раза в три года в объеме не менее 40 часов.
              </p>
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Формы повышения квалификации:
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Очные семинары и конференции</li>
                <li>Онлайн-курсы и вебинары</li>
                <li>Практические занятия и мастер-классы</li>
                <li>Самостоятельное изучение материалов</li>
                <li>Участие в профессиональных форумах</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Предстоящие мероприятия
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-neutral-900 mr-3">
                          {event.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {event.status === 'upcoming' ? 'Предстоящее' : 'Завершено'}
                        </span>
                      </div>
                      <p className="text-neutral-600 mb-4">
                        {event.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-2 text-beige-600" />
                          {event.participants} участников
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button>
                        Записаться
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Past Events */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Прошедшие мероприятия
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <div 
                  key={event.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-neutral-900 mr-3">
                          {event.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Завершено
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-neutral-600">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-beige-600" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1 text-beige-600" />
                          {event.participants} участников
                        </div>
                        <div className="flex items-center">
                          {event.materials ? (
                            <>
                              <DocumentTextIcon className="h-4 w-4 mr-1 text-green-600" />
                              <span className="text-green-600">Материалы доступны</span>
                            </>
                          ) : (
                            <>
                              <ExclamationCircleIcon className="h-4 w-4 mr-1 text-amber-600" />
                              <span className="text-amber-600">Материалы недоступны</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {event.materials ? (
                        <Button variant="outline" size="sm">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Материалы
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Материалы недоступны
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Materials Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Методические материалы
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <DocumentTextIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Учебные пособия
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Комплект учебных материалов по процедурам банкротства
                </p>
                <Button size="sm" variant="outline">
                  Скачать
                </Button>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <VideoCameraIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Видеолекции
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Записи лекций и семинаров для самостоятельного изучения
                </p>
                <Button size="sm" variant="outline">
                  Смотреть
                </Button>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <AcademicCapIcon className="h-8 w-8 text-beige-600 mb-3" />
                <h3 className="font-semibold text-neutral-900 mb-2">
                  Тесты и задания
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Интерактивные тесты для проверки знаний
                </p>
                <Button size="sm" variant="outline">
                  Пройти
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="text-center">
              <AcademicCapIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Мероприятий в год
              </h3>
              <p className="text-2xl font-bold text-beige-700">24</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <UserGroupIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Участников
              </h3>
              <p className="text-2xl font-bold text-beige-700">485</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <ClockIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Часов обучения
              </h3>
              <p className="text-2xl font-bold text-beige-700">1,200</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Материалов
              </h3>
              <p className="text-2xl font-bold text-beige-700">156</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
