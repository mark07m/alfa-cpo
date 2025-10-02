import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <Layout
      title="Страница не найдена - СРО Арбитражных Управляющих"
      description="Запрашиваемая страница не найдена"
      showBreadcrumbs={false}
    >
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-beige-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              Страница не найдена
            </h2>
            <p className="text-neutral-600 mb-8">
              К сожалению, запрашиваемая страница не существует или была перемещена.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <HomeIcon className="h-5 w-5 mr-2" />
                На главную
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Назад
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
