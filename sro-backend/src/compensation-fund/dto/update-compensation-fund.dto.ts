import { 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsEnum,
  IsNotEmpty,
  Min,
  MaxLength,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

export class BankDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  bankName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  bik: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  correspondentAccount: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  inn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  kpp: string;
}

export class UpdateCompensationFundDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @ValidateNested()
  @Type(() => BankDetailsDto)
  @IsOptional()
  bankDetails?: BankDetailsDto;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
