import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsNotEmpty, 
  MaxLength, 
  MinLength,
  IsBoolean
} from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;
}
