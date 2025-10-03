import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplinaryMeasureDto } from './create-disciplinary-measure.dto';

export class UpdateDisciplinaryMeasureDto extends PartialType(CreateDisciplinaryMeasureDto) {}
