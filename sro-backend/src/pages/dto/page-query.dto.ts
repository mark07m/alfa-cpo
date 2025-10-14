import { IsOptional, IsEnum, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PageQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['published', 'draft', 'archived'])
  status?: 'published' | 'draft' | 'archived';

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsDateString()
  publishedAtFrom?: string;

  @IsOptional()
  @IsDateString()
  publishedAtTo?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isCategoryMain?: boolean;
}
