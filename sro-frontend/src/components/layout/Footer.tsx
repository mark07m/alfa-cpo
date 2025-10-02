import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О СРО */}
          <div>
            <h3 className="text-lg font-semibold mb-4">О СРО</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Об Ассоциации
                </Link>
              </li>
              <li>
                <Link href="/about/leadership" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Руководство
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  История
                </Link>
              </li>
            </ul>
          </div>

          {/* Деятельность */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Деятельность</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/compensation-fund" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Компенсационный фонд
                </Link>
              </li>
              <li>
                <Link href="/accreditation" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Аккредитация
                </Link>
              </li>
              <li>
                <Link href="/labor-activity" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Трудовая деятельность
                </Link>
              </li>
            </ul>
          </div>

          {/* Документы */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Документы</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/documents/regulatory" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Нормативные документы
                </Link>
              </li>
              <li>
                <Link href="/documents/rules" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Правила деятельности
                </Link>
              </li>
              <li>
                <Link href="/registry" className="text-neutral-300 hover:text-white transition-colors duration-200">
                  Реестр АУ
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-2 text-neutral-300">
              <p>г. Москва, ул. Примерная, д. 1</p>
              <p>+7 (495) 123-45-67</p>
              <p>info@sro-au.ru</p>
              <p>Пн-Пт: 9:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-neutral-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 text-sm">
              © {currentYear} СРО Арбитражных Управляющих. Все права защищены.
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors duration-200">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors duration-200">
                Условия использования
              </Link>
            </div>
          </div>
          
          {/* Legal info */}
          <div className="mt-4 text-xs text-neutral-500">
            <p>ОГРН: 1234567890123 | ИНН: 1234567890</p>
            <p>Лицензия на осуществление деятельности по управлению саморегулируемой организацией арбитражных управляющих</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
