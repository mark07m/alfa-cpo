import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { LoginLoggerService } from '../login-logger.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private loginLoggerService: LoginLoggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ipAddress = this.getClientIp(request);
    const email = request.body?.email;

    // Проверяем, не заблокирован ли IP
    const isBlocked = await this.loginLoggerService.isIpBlocked(ipAddress);
    if (isBlocked) {
      await this.loginLoggerService.logLoginAttempt(
        email,
        ipAddress,
        request.get('User-Agent'),
        'blocked',
        undefined,
        'IP заблокирован из-за превышения лимита попыток'
      );
        throw new HttpException('Слишком много попыток входа. Попробуйте позже.', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
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
