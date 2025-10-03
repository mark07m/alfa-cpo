import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  IsDateString,
  Min, 
  Max 
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsEnum(['draft', 'published', 'cancelled', 'completed'])
  @IsOptional()
  status?: 'draft' | 'published' | 'cancelled' | 'completed';

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  registrationRequired?: boolean;

  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'title' | 'startDate' | 'createdAt' | 'currentParticipants';

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
