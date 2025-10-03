import { IsString, IsOptional, IsArray, IsBoolean, IsDateString, IsMongoId, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  excerpt: string;

  @IsDateString()
  publishedAt: string;

  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsEnum(['published', 'draft', 'archived'])
  @IsOptional()
  status?: 'published' | 'draft' | 'archived';

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
