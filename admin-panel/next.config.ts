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
};

export default nextConfig;
