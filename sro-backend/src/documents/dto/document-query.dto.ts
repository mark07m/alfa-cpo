import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsNumber, 
  Min, 
  Max 
} from 'class-validator';
import { Type } from 'class-transformer';

export class DocumentQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(['regulatory', 'rules', 'reports', 'compensation-fund', 'labor-activity', 'accreditation', 'other'])
  @IsOptional()
  category?: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';

  @IsString()
  @IsOptional()
  tag?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: 'title' | 'uploadedAt' | 'downloadCount' | 'fileSize';

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
