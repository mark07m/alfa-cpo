import { IsOptional, IsEnum, IsString, IsDateString, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class InspectionQueryDto {
  @IsOptional()
  @IsMongoId()
  managerId?: string;

  @IsOptional()
  @IsEnum(['planned', 'unplanned'])
  type?: 'planned' | 'unplanned';

  @IsOptional()
  @IsEnum(['scheduled', 'in_progress', 'completed', 'cancelled'])
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  inspector?: string;

  @IsOptional()
  @IsEnum(['passed', 'failed', 'needs_improvement'])
  result?: 'passed' | 'failed' | 'needs_improvement';

  @IsOptional()
  @IsDateString()
  scheduledDateFrom?: string;

  @IsOptional()
  @IsDateString()
  scheduledDateTo?: string;

  @IsOptional()
  @IsDateString()
  completedDateFrom?: string;

  @IsOptional()
  @IsDateString()
  completedDateTo?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledDate';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
