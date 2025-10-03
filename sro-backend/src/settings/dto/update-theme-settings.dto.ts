import { IsString, IsOptional } from 'class-validator';

export class UpdateThemeSettingsDto {
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
