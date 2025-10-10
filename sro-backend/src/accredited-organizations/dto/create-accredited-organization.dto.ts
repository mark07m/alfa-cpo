import { 
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsArray,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateAccreditedOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  shortName?: string;

  @IsString()
  @Matches(/^\d{10}$/)
  inn: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{9}$/)
  kpp?: string;

  @IsString()
  @Matches(/^\d{13}$/)
  ogrn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  legalAddress: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  actualAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  region?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  website?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  directorName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  directorPosition: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  accreditationNumber: string;

  @IsDateString()
  accreditationDate: string;

  @IsDateString()
  accreditationExpiryDate: string;

  @IsEnum(['active', 'suspended', 'revoked', 'expired'])
  @IsOptional()
  status?: 'active' | 'suspended' | 'revoked' | 'expired';

  @IsEnum(['educational', 'training', 'assessment', 'other'])
  accreditationType: 'educational' | 'training' | 'assessment' | 'other';

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsArray()
  @IsOptional()
  services?: string[];

  @IsArray()
  @IsOptional()
  contacts?: Array<{ name: string; position: string; phone: string; email: string }>;
}


