import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InspectionsService } from './inspections.service';
import { InspectionsController } from './inspections.controller';
import { PublicInspectionsController } from './public-inspections.controller';
import { Inspection, InspectionSchema } from '@/database/schemas/inspection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
    ]),
  ],
  controllers: [InspectionsController, PublicInspectionsController],
  providers: [InspectionsService],
  exports: [InspectionsService],
})
export class InspectionsModule {}
