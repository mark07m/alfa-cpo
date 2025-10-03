import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisciplinaryMeasuresService } from './disciplinary-measures.service';
import { DisciplinaryMeasuresController } from './disciplinary-measures.controller';
import { DisciplinaryMeasure, DisciplinaryMeasureSchema } from '@/database/schemas/disciplinary-measure.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DisciplinaryMeasure.name, schema: DisciplinaryMeasureSchema },
    ]),
  ],
  controllers: [DisciplinaryMeasuresController],
  providers: [DisciplinaryMeasuresService],
  exports: [DisciplinaryMeasuresService],
})
export class DisciplinaryMeasuresModule {}
