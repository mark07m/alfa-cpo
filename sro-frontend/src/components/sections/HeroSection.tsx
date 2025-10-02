import React from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface HeroSectionProps {
  backgroundSrc: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function HeroSection({
  backgroundSrc,
  title = "СРО Арбитражных Управляющих",
  subtitle = "Саморегулируемая организация арбитражных управляющих, обеспечивающая высокие стандарты профессиональной деятельности в сфере несостоятельности (банкротства).",
  primaryButtonText = "Поиск в реестре",
  primaryButtonHref = "/registry",
  secondaryButtonText = "Компенсационный фонд",
  secondaryButtonHref = "/compensation-fund"
}: HeroSectionProps) {
  return (
    <section 
      className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-beige-50 via-beige-100 to-amber-50"
      style={{
        backgroundImage: `url('${backgroundSrc}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Градиентный оверлей вместо черного */}
      <div className="absolute inset-0 bg-gradient-to-r from-beige-900/20 via-beige-800/30 to-amber-900/20"></div>
      
      {/* Контент */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            {title}
          </h1>
          <p className="text-xl text-neutral-700 mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={primaryButtonHref} 
              className="btn-primary text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2 inline" />
              {primaryButtonText}
            </Link>
            <Link 
              href={secondaryButtonHref} 
              className="btn-outline text-center py-3 px-6 rounded-lg font-medium transition-colors duration-200 w-full sm:w-auto border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white shadow-lg hover:shadow-xl"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2 inline" />
              {secondaryButtonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}