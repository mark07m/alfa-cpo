import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const message = this.appService.getHello();
    return ResponseUtil.success({ message }, 'API работает корректно');
  }

  @Get('health')
  getHealth() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
    return ResponseUtil.success(health, 'Сервис работает корректно');
  }
}
