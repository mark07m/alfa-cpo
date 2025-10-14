import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface NewsCardProps {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  cover?: string;
  href?: string;
  defaultCover?: string;
}

export default function NewsCard({
  id,
  title,
  date,
  excerpt,
  cover,
  href = "#",
  defaultCover = "/assets/news_cover_beige.png"
}: NewsCardProps) {
  const coverImage = cover || defaultCover;
  const [useFallback, setUseFallback] = useState(false);
  const resolvedSrc = useFallback ? defaultCover : coverImage;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-amber-200">
      {/* Обложка новости */}
      <div className="relative w-full h-48 bg-gradient-to-br from-beige-100 to-amber-50">
        <Image
          src={resolvedSrc}
          alt={title}
          fill
          className="object-cover"
          loading="lazy"
          onError={() => setUseFallback(true)}
        />
        {/* Декоративная рамка */}
        <div className="absolute inset-0 border-2 border-white/50"></div>
      </div>
      
      <CardHeader>
        <div className="text-sm text-neutral-500 mb-2">
          {date}
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent>
        <p className="text-neutral-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <Link href={href}>
          <Button variant="ghost" size="sm">
            Читать далее
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
