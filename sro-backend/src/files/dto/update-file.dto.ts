import { 
  IsString, 
  IsOptional, 
  IsArray, 
  MaxLength, 
  IsBoolean 
} from 'class-validator';

export class UpdateFileDto {
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
  isPublic?: boolean;
}
