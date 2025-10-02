import React from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';

interface QuickLinkProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  buttonText?: string;
}

export default function QuickLink({
  title,
  description,
  href,
  icon,
  buttonText = "Подробнее"
}: QuickLinkProps) {
  return (
    <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-amber-200 bg-gradient-to-br from-white to-beige-50">
      <CardContent>
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-beige-200 shadow-lg">
              {icon}
            </div>
          </div>
        )}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
        <p className="text-neutral-600 mb-4">
          {description}
        </p>
        <Link 
          href={href} 
          className="btn-outline w-full text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  );
}
