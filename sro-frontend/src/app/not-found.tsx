'use client';

import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-beige-600">404</h1>
          <h2 className="text-3xl font-semibold text-neutral-900 mb-4">
            Страница не найдена
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <HomeIcon className="h-5 w-5 mr-2" />
              На главную
            </Button>
          </Link>
          
          <div className="text-center">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-beige-600 hover:text-beige-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться назад
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-neutral-500">
          <p>Если вы считаете, что это ошибка, пожалуйста, свяжитесь с нами:</p>
          <p className="mt-2">
            <a href="mailto:info@sro-au.ru" className="text-beige-600 hover:text-beige-700">
              info@sro-au.ru
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}