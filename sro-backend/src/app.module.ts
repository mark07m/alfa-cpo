import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { NewsModule } from '@/content/news.module';
import { RegistryModule } from '@/registry/registry.module';
import appConfig from '@/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    NewsModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
