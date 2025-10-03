import { IsString, IsOptional, IsObject, ValidateNested, IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsString()
  vk?: string;
}

export class SeoSettingsDto {
  @IsString()
  defaultTitle: string;

  @IsString()
  defaultDescription: string;

  @IsString()
  defaultKeywords: string;

  @IsOptional()
  @IsString()
  ogImage?: string;

  @IsOptional()
  @IsString()
  twitterCard?: string;
}

export class ThemeSettingsDto {
  @IsString()
  primaryColor: string;

  @IsString()
  secondaryColor: string;

  @IsString()
  accentColor: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  faviconUrl?: string;
}

export class UpdateSiteSettingsDto {
  @IsString()
  siteName: string;

  @IsString()
  siteDescription: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  contactPhone: string;

  @IsString()
  address: string;

  @IsString()
  workingHours: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @ValidateNested()
  @Type(() => SeoSettingsDto)
  seoSettings: SeoSettingsDto;

  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  themeSettings: ThemeSettingsDto;
}
