"use client";

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
}

export default function FAQSection({
  title = "Часто задаваемые вопросы",
  faqs = []
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const defaultFAQs: FAQItem[] = faqs.length > 0 ? faqs : [
    {
      question: "Кто может стать арбитражным управляющим и вступить в СРО?",
      answer: "Арбитражным управляющим может стать любой гражданин Российской Федерации, достигший 25 лет, не имеющий судимостей, а также имеющий высшее образование, опыт работы и прошедший обучение по специальной программе. Необходимо также сдать квалификационный экзамен и пройти стажировку."
    },
    {
      question: "Какие документы нужны для вступления в СРО АУ?",
      answer: "Для вступления в СРО АУ потребуются: паспорт, диплом о высшем образовании, справка об отсутствии судимости, сертификат о прохождении обучения и квалификационного экзамена, страховой полис на случай профессиональной ответственности. Полный список документов уточняйте у выбранной СРО."
    },
    {
      question: "Какой взнос нужно оплатить при вступлении в СРО?",
      answer: "Обычно при вступлении в СРО оплачивается вступительный взнос. Также могут потребоваться ежемесячные или ежегодные членские взносы. Размеры взносов варьируются в зависимости от организации, поэтому их можно узнать, обратившись непосредственно в СРО."
    },
    {
      question: "Какие шаги нужно пройти для получения статуса арбитражного управляющего?",
      answer: "Чтобы стать арбитражным управляющим, нужно: 1. Пройти обучение по программе подготовки арбитражных управляющих. 2. Сдать квалификационный экзамен. 3. Пройти стажировку. 4. Подать документы для вступления в СРО. 5. Получить страховой полис на случай профессиональной ответственности. 6. Оплатить вступительный взнос и членские взносы. После этого вы будете внесены в реестр арбитражных управляющих."
    },
    {
      question: "Нужно ли арбитражному управляющему страхование ответственности?",
      answer: "Да, арбитражному управляющему требуется страхование профессиональной ответственности. Это нужно для защиты интересов кредиторов и других участников дела о банкротстве на случай ошибок или нарушений. Полис нужно оформить перед вступлением в СРО и ежегодно продлевать."
    },
    {
      question: "Чем занимается арбитражный управляющий в деле о банкротстве?",
      answer: "Арбитражный управляющий выполняет задачи по управлению и продаже имущества должника, анализу его финансового состояния и распределению средств среди кредиторов. Также он представляет интересы всех участников процесса и следит за соблюдением законодательства на каждом этапе банкротства."
    }
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-beige-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
          {title}
        </h2>
        
        <div className="space-y-4">
          {defaultFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border border-amber-100 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-beige-50 transition-colors duration-200"
              >
                <span className="font-medium text-neutral-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-amber-600 transition-transform duration-200 flex-shrink-0 ${
                    openItems.has(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <p className="text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
