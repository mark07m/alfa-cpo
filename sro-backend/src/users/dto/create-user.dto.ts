import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '@/common/types';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

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
