import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsEnum, 
  IsNotEmpty, 
  MaxLength, 
  MinLength,
  IsNumber,
  IsDateString,
  IsMongoId,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';

export class EventAgendaItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  speaker?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  content?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  location: string;

  @IsMongoId()
  @IsOptional()
  type?: string;

  @IsEnum(['draft', 'published', 'cancelled', 'completed'])
  @IsOptional()
  status?: 'draft' | 'published' | 'cancelled' | 'completed';

  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsBoolean()
  @IsOptional()
  registrationRequired?: boolean;

  @IsDateString()
  @IsOptional()
  registrationDeadline?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  materials?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(200)
  organizer?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  requirements?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventAgendaItemDto)
  @IsOptional()
  agenda?: EventAgendaItemDto[];

  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  seoDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  seoKeywords?: string[];
}
