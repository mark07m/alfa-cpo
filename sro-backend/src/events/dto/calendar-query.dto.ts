import { 
  IsDateString, 
  IsOptional, 
  IsString,
  IsEnum
} from 'class-validator';

export class CalendarQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsEnum(['draft', 'published', 'cancelled', 'completed'])
  @IsOptional()
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}
