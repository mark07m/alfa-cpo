import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsEnum, 
  IsDateString, 
  IsNumber, 
  IsArray, 
  IsNotEmpty, 
  MaxLength, 
  MinLength,
  Matches,
  IsMongoId,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

class InsuranceDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contractNumber?: string;

  @IsDateString()
  @IsOptional()
  contractDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  insuranceCompany?: string;
}

class CompensationFundContributionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  purpose: string;

  @IsDateString()
  date: string;

  @IsNumber()
  amount: number;
}

class InspectionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  result: string;
}

class DisciplinaryMeasureDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  decisionNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  penalty: string;
}

class OtherSroParticipationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  sroName: string;

  @IsDateString()
  joinDate: string;

  @IsDateString()
  @IsOptional()
  leaveDate?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  status: string;
}

export class CreateArbitraryManagerDto {
  // Основная информация
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{12}$/, { message: 'ИНН должен содержать 12 цифр' })
  inn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registryNumber: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'СНИЛС должен содержать 11 цифр' })
  snils?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  stateRegistryNumber?: string;

  @IsDateString()
  @IsOptional()
  stateRegistryDate?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { message: 'Неверный формат телефона' })
  phone: string;

  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  region?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsEnum(['active', 'excluded', 'suspended'])
  @IsOptional()
  status?: 'active' | 'excluded' | 'suspended';

  @IsDateString()
  joinDate: string;

  @IsDateString()
  @IsOptional()
  excludeDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  excludeReason?: string;

  // Личная информация
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  birthPlace?: string;

  @IsDateString()
  @IsOptional()
  registrationDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  decisionNumber?: string;

  // Профессиональная подготовка
  @IsString()
  @IsOptional()
  @MaxLength(500)
  education?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  workExperience?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  internship?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  examCertificate?: string;

  // Дисквалификация и судимости
  @IsString()
  @IsOptional()
  @MaxLength(500)
  disqualification?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  criminalRecord?: string;

  @IsDateString()
  @IsOptional()
  criminalRecordDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  criminalRecordNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  criminalRecordName?: string;

  // Страхование
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceDto)
  insurance?: InsuranceDto;

  // Компенсационный фонд
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CompensationFundContributionDto)
  compensationFundContributions?: CompensationFundContributionDto[];

  @IsNumber()
  @IsOptional()
  compensationFundContribution?: number;

  // Проверки
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InspectionDto)
  inspections?: InspectionDto[];

  @IsDateString()
  @IsOptional()
  lastInspection?: string;

  // Дисциплинарные взыскания
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DisciplinaryMeasureDto)
  disciplinaryMeasures?: DisciplinaryMeasureDto[];

  // Участие в других СРО
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OtherSroParticipationDto)
  otherSroParticipation?: OtherSroParticipationDto[];

  // Соответствие члена
  @IsString()
  @IsOptional()
  @MaxLength(200)
  complianceStatus?: string;

  @IsDateString()
  @IsOptional()
  complianceDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  complianceNumber?: string;

  // Контактная информация
  @IsString()
  @IsOptional()
  @MaxLength(500)
  postalAddress?: string;

  // Дополнительные поля
  @IsString()
  @IsOptional()
  @MaxLength(500)
  penalties?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  documents?: string[];
}
