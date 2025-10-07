'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логирование ошибки
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ExclamationTriangleIcon className="h-24 w-24 text-red-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Произошла ошибка
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            К сожалению, произошла непредвиденная ошибка. 
            Мы уже работаем над её устранением.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="w-full sm:w-auto">
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Попробовать снова
          </Button>
          
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-beige-600 hover:text-beige-700 transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-neutral-500">
          <p>Если проблема повторяется, пожалуйста, свяжитесь с нами:</p>
          <p className="mt-2">
            <a href="mailto:info@sro-au.ru" className="text-beige-600 hover:text-beige-700">
              info@sro-au.ru
            </a>
          </p>
          {error.digest && (
            <p className="mt-2 text-xs">
              Код ошибки: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
