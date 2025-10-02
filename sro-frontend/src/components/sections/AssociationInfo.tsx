import React from 'react';
import { CheckBadgeIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface AssociationInfoProps {
  title?: string;
  description?: string;
  membershipInfo?: string;
  qualifications?: string[];
}

export default function AssociationInfo({
  title = "О нашей Ассоциации",
  description = "Ассоциация является членом Национального Союза профессионалов антикризисного управления. Арбитражные управляющие Ассоциации - опытные специалисты в сфере несостоятельности (банкротства) и антикризисного управления.",
  membershipInfo = "В их числе: имеющие стаж работы в качестве арбитражного управляющего более десяти лет; кандидаты наук; имеющие 2 и более высших образования; имеющие допуск на осуществление работ, связанных с использованием сведений, составляющих государственную тайну; имеющие аттестат Федерального агентства по энергетике, дающий право проводить процедуры банкротства субъектов естественных монополий топливно-энергетического комплекса, прошедшие обучение по программе подготовки арбитражных управляющих в делах о банкротстве страховых организаций и кредитных кооперативов.",
  qualifications = [
    "Стаж работы более 10 лет",
    "Кандидаты наук",
    "2 и более высших образования",
    "Допуск к государственной тайне",
    "Аттестат ФАЭ для ТЭК",
    "Специальная подготовка по страховым организациям"
  ]
}: AssociationInfoProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-beige-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            {title}
          </h2>
          <p className="text-lg text-neutral-700 max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-100">
          <div className="flex items-start mb-6">
            <CheckBadgeIcon className="h-8 w-8 text-amber-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Квалификации наших специалистов
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-6">
                {membershipInfo}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qualifications.map((qualification, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-amber-50 to-beige-50 rounded-lg border border-amber-200"
              >
                <div className="flex-shrink-0 mr-3">
                  {index % 3 === 0 && <AcademicCapIcon className="h-5 w-5 text-amber-600" />}
                  {index % 3 === 1 && <ShieldCheckIcon className="h-5 w-5 text-amber-600" />}
                  {index % 3 === 2 && <CheckBadgeIcon className="h-5 w-5 text-amber-600" />}
                </div>
                <span className="text-sm font-medium text-neutral-800">
                  {qualification}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
