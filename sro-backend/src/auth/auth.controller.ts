import { ResponseUtil } from '@/common/utils/response.util';
import { Controller, Post, Body, UseGuards, Request, Get, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@/database/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');
    const data = await this.authService.register(registerDto, ipAddress, userAgent);
    return ResponseUtil.created(data, 'Регистрация успешна');
  }

  @UseGuards(RateLimitGuard, LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');
    const data = await this.authService.login(req.user, ipAddress, userAgent);
    return ResponseUtil.success(data, 'Вход выполнен успешно');
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');
    const data = await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
      ipAddress,
      userAgent
    );
    return ResponseUtil.success(data, 'Токены обновлены');
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.logout(refreshTokenDto.refreshToken);
    return ResponseUtil.success(null, 'Вы вышли из системы');
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const data = await this.authService.forgotPassword(forgotPasswordDto.email, ipAddress);
    return ResponseUtil.success(data, 'Инструкции по восстановлению пароля отправлены');
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
    return ResponseUtil.success(null, 'Пароль успешно изменен');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    const data = await this.authService.getProfile(user.id);
    return ResponseUtil.success(data, 'Профиль получен');
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const data = await this.authService.updateProfile(user.id, updateProfileDto);
    return ResponseUtil.updated(data, 'Профиль обновлен');
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }
}
