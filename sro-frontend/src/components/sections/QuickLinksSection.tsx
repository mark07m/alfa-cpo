import React from 'react';
import QuickLink from '@/components/cards/QuickLink';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';

interface QuickLinkItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  buttonText?: string;
}

interface QuickLinksSectionProps {
  title?: string;
  links?: QuickLinkItem[];
}

export default function QuickLinksSection({
  title = "Быстрый доступ",
  links = []
}: QuickLinksSectionProps) {
  // Заглушка для демонстрации, если ссылки не переданы
  const defaultLinks: QuickLinkItem[] = links.length > 0 ? links : [
    {
      title: "Реестр АУ",
      description: "Поиск арбитражных управляющих по ФИО, ИНН или номеру",
      href: "/registry",
      icon: <UserGroupIcon className="h-12 w-12 text-beige-600 mx-auto" />,
      buttonText: "Перейти к реестру"
    },
    {
      title: "Компенсационный фонд",
      description: "Информация о размере и реквизитах фонда",
      href: "/compensation-fund",
      icon: <BanknotesIcon className="h-12 w-12 text-beige-600 mx-auto" />,
      buttonText: "Подробнее"
    },
    {
      title: "Нормативные документы",
      description: "Устав, правила и другие документы СРО",
      href: "/documents",
      icon: <DocumentTextIcon className="h-12 w-12 text-beige-600 mx-auto" />,
      buttonText: "Смотреть документы"
    },
    {
      title: "Контроль деятельности",
      description: "График проверок и результаты контроля",
      href: "/control",
      icon: <MagnifyingGlassIcon className="h-12 w-12 text-beige-600 mx-auto" />,
      buttonText: "Подробнее"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultLinks.map((link, index) => (
            <QuickLink
              key={index}
              title={link.title}
              description={link.description}
              href={link.href}
              icon={link.icon}
              buttonText={link.buttonText}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
