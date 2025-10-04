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

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateSettings(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto, @Request() req) {
    return this.settingsService.updateSettings(updateSiteSettingsDto, req.user.userId);
  }

  @Get('theme')
  getThemeSettings() {
    return this.settingsService.getThemeSettings();
  }

  @Put('theme')
  @UseGuards(JwtAuthGuard)
  updateThemeSettings(@Body() updateThemeSettingsDto: UpdateThemeSettingsDto, @Request() req) {
    return this.settingsService.updateThemeSettings(updateThemeSettingsDto, req.user.userId);
  }

  @Get('seo')
  getSeoSettings() {
    return this.settingsService.getSeoSettings();
  }

  @Get('contact')
  getContactInfo() {
    return this.settingsService.getContactInfo();
  }

  @Put('reset')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  resetToDefaults(@Request() req) {
    return this.settingsService.resetToDefaults(req.user.userId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getSettingsHistory() {
    return this.settingsService.getSettingsHistory();
  }
}
