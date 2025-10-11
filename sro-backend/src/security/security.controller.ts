import { Controller, Get, Post, Body, Query, UseGuards, Req, Res } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResponseUtil } from '@/common/utils/response.util';
import type { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('events')
  async getEvents(@Query() query: any) {
    const { page, limit, type, userId, dateFrom, dateTo } = query;
    const result = await this.securityService.getEvents({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      type,
      userId,
      dateFrom,
      dateTo,
    });
    return ResponseUtil.success(result.data, 'События получены', result.pagination);
  }

  @Get('stats')
  async getStats(@Query('period') period: 'day' | 'week' | 'month' = 'week') {
    const stats = await this.securityService.getStats(period);
    return ResponseUtil.success(stats, 'Статистика получена');
  }

  @Post('block-ip')
  async blockIp(@Body('ipAddress') ipAddress: string, @Body('reason') reason?: string, @Body('expiresAt') expiresAt?: string, @Req() request?: any) {
    const createdBy = request?.user?.id;
    const res = await this.securityService.blockIp(ipAddress, reason, createdBy, expiresAt ? new Date(expiresAt) : undefined);
    return ResponseUtil.created(res, 'IP заблокирован');
  }

  @Post('unblock-ip')
  async unblockIp(@Body('ipAddress') ipAddress: string) {
    const res = await this.securityService.unblockIp(ipAddress);
    return ResponseUtil.success(res, 'IP разблокирован');
  }

  @Get('blocked-ips')
  async getBlockedIps() {
    const list = await this.securityService.getBlockedIps();
    return ResponseUtil.success(list, 'Список заблокированных IP');
  }

  @Get('active-sessions')
  async getActiveSessions() {
    const list = await this.securityService.getActiveSessions();
    return ResponseUtil.success(list, 'Активные сессии');
  }

  @Post('reset-failed-attempts')
  async resetFailedAttempts(@Body('userId') userId: string) {
    await this.securityService.resetFailedAttempts(userId);
    return ResponseUtil.success(null, 'Счетчики неудачных попыток сброшены');
  }

  @Post('terminate-sessions')
  async terminateSessions(@Body('userId') userId: string) {
    await this.securityService.terminateSessions(userId);
    return ResponseUtil.success(null, 'Сессии пользователя завершены');
  }

  @Post('test-settings')
  async testSettings() {
    // Заглушка: в реальном сценарии прогоняем политики, валидируем правила и возвращаем отчет
    return ResponseUtil.success({ ok: true }, 'Проверка настроек выполнена');
  }

  @Get('export-logs')
  async exportLogs(
    @Query('format') format: 'csv' | 'excel' = 'excel',
    @Query() query: any,
    @Res() res: Response,
  ) {
    const { type, userId, dateFrom, dateTo } = query;
    const rows = await this.securityService.getEventsForExport({ type, userId, dateFrom, dateTo });
    const header = ['timestamp', 'status', 'email', 'userId', 'ipAddress', 'userAgent', 'failureReason'];
    const csv = [header.join(','), ...rows.map(r => [
      new Date(r.timestamp).toISOString(),
      r.status,
      (r.email || '').replace(/,/g, ' '),
      String(r.userId || ''),
      r.ipAddress,
      (r.userAgent || '').replace(/,/g, ' '),
      (r.failureReason || '').replace(/,/g, ' '),
    ].join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="security-logs.${format === 'excel' ? 'csv' : 'csv'}"`);
    res.send(csv);
  }
}


