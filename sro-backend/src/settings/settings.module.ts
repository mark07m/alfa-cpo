import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SiteSettings, SiteSettingsSchema } from '@/database/schemas/site-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteSettings.name, schema: SiteSettingsSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
