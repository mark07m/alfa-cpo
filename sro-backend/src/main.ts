import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  // CORS
  app.enableCors({
    origin: configService.get('app.corsOrigin'),
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // API prefix
  app.setGlobalPrefix(configService.get('app.apiPrefix') || 'api');
  
  // Статические файлы
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = configService.get('app.port');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${configService.get('app.apiPrefix')}`);
}
bootstrap();
