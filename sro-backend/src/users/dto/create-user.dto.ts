import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@/common/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  isActive?: boolean;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];

  @IsOptional()
  profile?: {
    avatar?: string;
    phone?: string;
    position?: string;
  };
}
