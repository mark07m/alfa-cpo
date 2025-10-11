import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { UpdateThemeSettingsDto } from './dto/update-theme-settings.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings() {
    const settings = await this.settingsService.getSettings();
    return ResponseUtil.success(settings, 'Настройки сайта получены');
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateSettings(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto, @Request() req) {
    const settings = await this.settingsService.updateSettings(updateSiteSettingsDto, req.user.id);
    return ResponseUtil.updated(settings, 'Настройки сайта успешно обновлены');
  }

  @Get('theme')
  async getThemeSettings() {
    const theme = await this.settingsService.getThemeSettings();
    return ResponseUtil.success(theme, 'Настройки темы получены');
  }

  @Put('theme')
  @UseGuards(JwtAuthGuard)
  async updateThemeSettings(@Body() updateThemeSettingsDto: UpdateThemeSettingsDto, @Request() req) {
    const theme = await this.settingsService.updateThemeSettings(updateThemeSettingsDto, req.user.id);
    return ResponseUtil.updated(theme, 'Настройки темы успешно обновлены');
  }

  @Get('seo')
  async getSeoSettings() {
    const seo = await this.settingsService.getSeoSettings();
    return ResponseUtil.success(seo, 'SEO настройки получены');
  }

  @Get('contact')
  async getContactInfo() {
    const contact = await this.settingsService.getContactInfo();
    return ResponseUtil.success(contact, 'Контактная информация получена');
  }

  @Put('reset')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resetToDefaults(@Request() req) {
    const settings = await this.settingsService.resetToDefaults(req.user.id);
    return ResponseUtil.success(settings, 'Настройки сброшены к значениям по умолчанию');
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getSettingsHistory() {
    const history = await this.settingsService.getSettingsHistory();
    return ResponseUtil.success(history, 'История изменений настроек получена');
  }

  // Security settings endpoint (separate section)
  @Put('security')
  @UseGuards(JwtAuthGuard)
  async updateSecuritySettings(@Body() body: any) {
    // На данном этапе сохраняем как есть (заглушка)
    // При необходимости можно добавить схему/хранилище для SecuritySettings
    return ResponseUtil.updated(body, 'Настройки безопасности обновлены');
  }
}
