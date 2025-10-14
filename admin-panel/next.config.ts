import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Настройки для уменьшения частоты обновлений в режиме разработки
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Увеличиваем интервал проверки изменений для уменьшения частоты обновлений
      config.watchOptions = {
        poll: 2000, // Проверяем изменения каждые 2 секунды вместо мгновенно
        aggregateTimeout: 500, // Ждем 500ms перед перезагрузкой
        ignored: /node_modules/, // Игнорируем изменения в node_modules
      };
    }
    return config;
  },
  
  // Настройки для оптимизации изображений
  images: {
    // Отключаем оптимизацию изображений в режиме разработки для избежания ошибок
    unoptimized: process.env.NODE_ENV === 'development',
    // Разрешенные домены для внешних изображений
    domains: ['localhost'],
    // Разрешенные форматы изображений
    formats: ['image/webp', 'image/avif'],
    // Настройки для статических изображений
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Разрешенные типы файлов
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*',
      },
    ]
  },
};

export default nextConfig;
