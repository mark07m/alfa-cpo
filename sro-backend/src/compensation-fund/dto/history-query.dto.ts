import { 
  IsDateString, 
  IsOptional, 
  IsEnum,
  IsNumber,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(['increase', 'decrease', 'transfer'])
  @IsOptional()
  operation?: 'increase' | 'decrease' | 'transfer';

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
