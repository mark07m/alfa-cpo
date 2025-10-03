import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistryService } from './registry.service';
import { RegistryController } from './registry.controller';
import { ArbitraryManager, ArbitraryManagerSchema } from '@/database/schemas/arbitrary-manager.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArbitraryManager.name, schema: ArbitraryManagerSchema },
    ]),
  ],
  controllers: [RegistryController],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
