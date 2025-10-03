import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsNotEmpty, 
  MaxLength, 
  MinLength,
  IsBoolean
} from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isPublic?: boolean;
}
