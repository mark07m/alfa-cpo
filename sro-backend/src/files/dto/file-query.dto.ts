import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  Min, 
  Max 
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FileQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  mimeType?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isImage?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  uploadedBy?: string;

  @IsEnum(['originalName', 'fileName', 'uploadedAt', 'fileSize', 'downloadCount'])
  @IsOptional()
  sortBy?: 'originalName' | 'fileName' | 'uploadedAt' | 'fileSize' | 'downloadCount';

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}
