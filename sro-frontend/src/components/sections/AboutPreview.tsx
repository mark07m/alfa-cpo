import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AboutPreviewProps {
  imageSrc: string;
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  buttonText?: string;
  buttonHref?: string;
}

export default function AboutPreview({
  imageSrc,
  title = "О нашей организации",
  description = "Саморегулируемая организация арбитражных управляющих объединяет профессионалов, работающих в сфере несостоятельности (банкротства). Мы обеспечиваем высокие стандарты профессиональной деятельности и защищаем интересы всех участников процедур банкротства.",
  stats = [
    { value: "150+", label: "Арбитражных управляющих" },
    { value: "10+", label: "Лет успешной работы" },
    { value: "100%", label: "Соответствие стандартам" }
  ],
  buttonText = "Подробнее об организации",
  buttonHref = "/about"
}: AboutPreviewProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 via-beige-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Текстовая часть */}
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-neutral-700 mb-6">
              {description}
            </p>
            <p className="text-neutral-700 mb-8">
              Наша организация создана в соответствии с требованиями федерального законодательства 
              и осуществляет свою деятельность в целях саморегулирования профессиональной деятельности 
              арбитражных управляющих.
            </p>
            <Link 
              href={buttonHref} 
              className="btn-primary text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
            >
              {buttonText}
            </Link>
          </div>
          
          {/* Иллюстрация */}
          <div className="relative">
            <div className="relative w-full h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src={imageSrc}
                alt="О нашей организации"
                fill
                className="object-cover"
                priority
              />
              {/* Декоративная рамка */}
              <div className="absolute inset-0 rounded-2xl border-2 border-beige-200"></div>
            </div>
            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-beige-400 rounded-full opacity-60"></div>
          </div>
        </div>
        
        {/* Статистика */}
        {stats && stats.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-amber-100">
                <div className="text-4xl font-bold text-amber-600 mb-2">{stat.value}</div>
                <div className="text-lg text-neutral-700">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
