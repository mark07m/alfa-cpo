import { 
  IsString, 
  IsNumber, 
  IsEnum, 
  IsOptional,
  IsNotEmpty,
  IsDateString,
  Min,
  MaxLength
} from 'class-validator';

export class AddHistoryEntryDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsEnum(['increase', 'decrease', 'transfer'])
  @IsNotEmpty()
  operation: 'increase' | 'decrease' | 'transfer';

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  documentUrl?: string;
}
