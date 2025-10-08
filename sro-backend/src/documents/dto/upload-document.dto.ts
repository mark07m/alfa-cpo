import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsArray, 
  IsNotEmpty, 
  MaxLength, 
  MinLength,
  IsBoolean
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsEnum(['regulatory', 'rules', 'reports', 'compensation-fund', 'labor-activity', 'accreditation', 'other'])
  @IsNotEmpty()
  category: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';

  @IsString()
  @IsOptional()
  version?: string;

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
