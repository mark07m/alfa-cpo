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
  const corsOrigin = configService.get('app.corsOrigin');
  const nodeEnv = configService.get('app.nodeEnv');
  app.enableCors({
    origin: nodeEnv === 'development' ? true : corsOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    exposedHeaders: 'Content-Disposition',
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // API prefix
  app.setGlobalPrefix(configService.get('app.apiPrefix') || 'api');
  
  // Статические файлы — используем process.cwd() чтобы путь совпадал с тем, куда FilesService пишет файлы
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = configService.get('app.port');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${configService.get('app.apiPrefix')}`);
}
bootstrap();
