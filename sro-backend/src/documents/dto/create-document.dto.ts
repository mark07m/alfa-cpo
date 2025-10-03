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
  IsObject,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentMetadataDto {
  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @IsOptional()
  pages?: number;
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['regulatory', 'rules', 'reports', 'compensation-fund', 'labor-activity', 'accreditation', 'other'])
  @IsNotEmpty()
  category: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';

  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  originalName: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ValidateNested()
  @Type(() => DocumentMetadataDto)
  @IsOptional()
  metadata?: DocumentMetadataDto;
}
