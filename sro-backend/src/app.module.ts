import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { NewsModule } from '@/content/news.module';
import { RegistryModule } from '@/registry/registry.module';
import { DocumentsModule } from '@/documents/documents.module';
import { EventsModule } from '@/events/events.module';
import { CompensationFundModule } from '@/compensation-fund/compensation-fund.module';
import { InspectionsModule } from '@/inspections/inspections.module';
import { DisciplinaryMeasuresModule } from '@/disciplinary-measures/disciplinary-measures.module';
import { PagesModule } from '@/pages/pages.module';
import { SettingsModule } from '@/settings/settings.module';
import { FilesModule } from '@/files/files.module';
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
    DocumentsModule,
    EventsModule,
    CompensationFundModule,
    InspectionsModule,
    DisciplinaryMeasuresModule,
    PagesModule,
    SettingsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
