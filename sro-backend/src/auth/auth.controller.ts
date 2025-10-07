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
    return this.authService.register(registerDto, ipAddress, userAgent);
  }

  @UseGuards(RateLimitGuard, LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');
    return this.authService.login(req.user, ipAddress, userAgent);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() request) {
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');
    return this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
      ipAddress,
      userAgent
    );
  }

  @Post('logout')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto, @Req() request) {
    const ipAddress = this.getClientIp(request);
    return this.authService.forgotPassword(forgotPasswordDto.email, ipAddress);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    return this.authService.updateProfile(user.id, updateProfileDto);
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
