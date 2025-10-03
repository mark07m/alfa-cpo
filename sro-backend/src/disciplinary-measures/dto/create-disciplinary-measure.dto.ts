import { IsEnum, IsString, IsDateString, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateDisciplinaryMeasureDto {
  @IsMongoId()
  managerId: string;

  @IsEnum(['warning', 'reprimand', 'exclusion', 'suspension', 'other'])
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';

  @IsString()
  reason: string;

  @IsDateString()
  date: Date;

  @IsString()
  decisionNumber: string;

  @IsOptional()
  @IsEnum(['active', 'cancelled', 'expired'])
  status?: 'active' | 'cancelled' | 'expired';

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  documents?: string[];

  @IsOptional()
  @IsDateString()
  appealDeadline?: Date;

  @IsOptional()
  @IsEnum(['none', 'submitted', 'reviewed', 'approved', 'rejected'])
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  appealNotes?: string;

  @IsOptional()
  @IsDateString()
  appealDate?: Date;

  @IsOptional()
  @IsString()
  appealDecision?: string;
}
