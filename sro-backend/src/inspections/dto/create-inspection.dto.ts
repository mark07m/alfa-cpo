import { IsEnum, IsString, IsDateString, IsOptional, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class InspectionViolationDto {
  @IsString()
  description: string;

  @IsEnum(['low', 'medium', 'high', 'critical'])
  severity: 'low' | 'medium' | 'high' | 'critical';

  @IsEnum(['open', 'resolved', 'ignored'])
  status: 'open' | 'resolved' | 'ignored';

  @IsOptional()
  @IsDateString()
  resolutionDate?: Date;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class CreateInspectionDto {
  @IsMongoId()
  managerId: string;

  @IsEnum(['planned', 'unplanned'])
  type: 'planned' | 'unplanned';

  @IsEnum(['scheduled', 'in_progress', 'completed', 'cancelled'])
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @IsDateString()
  scheduledDate: Date;

  @IsOptional()
  @IsDateString()
  completedDate?: Date;

  @IsString()
  inspector: string;

  @IsOptional()
  @IsEnum(['passed', 'failed', 'needs_improvement'])
  result?: 'passed' | 'failed' | 'needs_improvement';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  documents?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionViolationDto)
  violations?: InspectionViolationDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recommendations?: string[];

  @IsOptional()
  @IsDateString()
  nextInspectionDate?: Date;
}
