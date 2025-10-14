import { IsString, IsOptional, IsEnum, IsArray, IsDateString, IsObject, IsBoolean } from 'class-validator';

export class CreatePageDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsEnum(['published', 'draft', 'archived'])
  status?: 'published' | 'draft' | 'archived';

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;

  @IsOptional()
  @IsBoolean()
  isCategoryMain?: boolean;
}
