import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ImportRegistryDto {
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  format?: 'excel' | 'csv';
}
