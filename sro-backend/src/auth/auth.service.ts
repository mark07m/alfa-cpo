import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User, UserDocument } from '@/database/schemas/user.schema';
import { RefreshTokenService } from './refresh-token.service';
import { PasswordResetService } from './password-reset.service';
import { LoginLoggerService } from './login-logger.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private passwordResetService: PasswordResetService,
    private loginLoggerService: LoginLoggerService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const userObj = (user as UserDocument).toObject();
      const { password, ...result } = userObj;
      return result;
    }
    return null;
  }

  async login(user: any, ipAddress?: string, userAgent?: string) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user,
      ipAddress,
      userAgent
    );

    // Логируем успешный вход
    await this.loginLoggerService.logLoginAttempt(
      user.email,
      ipAddress || 'unknown',
      userAgent,
      'success',
      user._id.toString()
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  async refreshTokens(refreshToken: string, ipAddress?: string, userAgent?: string) {
    const user = await this.refreshTokenService.validateRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.refreshTokenService.generateRefreshToken(
      user,
      ipAddress,
      userAgent
    );

    // Отзываем старый refresh token
    await this.refreshTokenService.revokeRefreshToken(refreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions,
      },
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.revokeRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string, ipAddress?: string) {
    const token = await this.passwordResetService.generateResetToken(email, ipAddress);
    
    // Здесь должна быть отправка email с токеном
    // Пока просто возвращаем токен для тестирования
    return { 
      message: 'Инструкции по восстановлению пароля отправлены на email',
      token // В продакшене не возвращаем токен
    };
  }

  async resetPassword(token: string, newPassword: string) {
    await this.passwordResetService.resetPassword(token, newPassword);
    return { message: 'Пароль успешно изменен' };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.usersService.update(userId, updateProfileDto);
  }

  async validateUserById(id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
