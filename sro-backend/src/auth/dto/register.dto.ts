import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @IsString({ message: 'Имя должно быть строкой' })
  firstName: string;

  @IsString({ message: 'Фамилия должна быть строкой' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'Отчество должно быть строкой' })
  middleName?: string;

  @IsOptional()
  @IsPhoneNumber('RU', { message: 'Некорректный номер телефона' })
  phone?: string;
}
