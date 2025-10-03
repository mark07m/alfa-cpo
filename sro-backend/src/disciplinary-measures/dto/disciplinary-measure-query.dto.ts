import { IsOptional, IsEnum, IsString, IsDateString, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class DisciplinaryMeasureQueryDto {
  @IsOptional()
  @IsMongoId()
  managerId?: string;

  @IsOptional()
  @IsEnum(['warning', 'reprimand', 'exclusion', 'suspension', 'other'])
  type?: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';

  @IsOptional()
  @IsEnum(['active', 'cancelled', 'expired'])
  status?: 'active' | 'cancelled' | 'expired';

  @IsOptional()
  @IsEnum(['none', 'submitted', 'reviewed', 'approved', 'rejected'])
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  decisionNumber?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsDateString()
  appealDeadlineFrom?: string;

  @IsOptional()
  @IsDateString()
  appealDeadlineTo?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'date';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
