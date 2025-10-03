import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  IsPhoneNumber,
  IsNotEmpty,
  MaxLength,
  MinLength
} from 'class-validator';

export class RegisterEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  organization?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}
