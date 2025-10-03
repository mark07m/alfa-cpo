import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SiteSettings, SiteSettingsDocument } from '@/database/schemas/site-settings.schema';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { UpdateThemeSettingsDto } from './dto/update-theme-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name) private siteSettingsModel: Model<SiteSettingsDocument>,
  ) {}

  async getSettings(): Promise<SiteSettings> {
    let settings = await this.siteSettingsModel.findOne().exec();
    
    if (!settings) {
      // Создаем настройки по умолчанию, если их нет
      settings = await this.createDefaultSettings();
    }

    return settings;
  }

  async updateSettings(updateSiteSettingsDto: UpdateSiteSettingsDto, userId: string): Promise<SiteSettings> {
    try {
      let settings = await this.siteSettingsModel.findOne().exec();
      
      if (!settings) {
        // Создаем новые настройки, если их нет
        settings = new this.siteSettingsModel({
          ...updateSiteSettingsDto,
          updatedBy: new Types.ObjectId(userId),
        });
      } else {
        // Обновляем существующие настройки
        Object.assign(settings, {
          ...updateSiteSettingsDto,
          updatedBy: new Types.ObjectId(userId),
        });
      }

      return await settings.save();
    } catch (error) {
      throw new BadRequestException('Ошибка при обновлении настроек сайта: ' + error.message);
    }
  }

  async getThemeSettings(): Promise<SiteSettings['themeSettings']> {
    const settings = await this.getSettings();
    return settings.themeSettings;
  }

  async updateThemeSettings(updateThemeSettingsDto: UpdateThemeSettingsDto, userId: string): Promise<SiteSettings> {
    try {
      let settings = await this.siteSettingsModel.findOne().exec();
      
      if (!settings) {
        // Создаем настройки с темой по умолчанию
        settings = await this.createDefaultSettings();
      }

      settings.themeSettings = {
        ...settings.themeSettings,
        ...updateThemeSettingsDto,
      };
      settings.updatedBy = new Types.ObjectId(userId);

      return await settings.save();
    } catch (error) {
      throw new BadRequestException('Ошибка при обновлении настроек темы: ' + error.message);
    }
  }

  async getSeoSettings(): Promise<SiteSettings['seoSettings']> {
    const settings = await this.getSettings();
    return settings.seoSettings;
  }

  async getContactInfo(): Promise<{
    siteName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    workingHours: string;
    socialLinks: SiteSettings['socialLinks'];
  }> {
    const settings = await this.getSettings();
    return {
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      workingHours: settings.workingHours,
      socialLinks: settings.socialLinks,
    };
  }

  private async createDefaultSettings(): Promise<SiteSettings> {
    const defaultSettings = new this.siteSettingsModel({
      siteName: 'СРО Арбитражных Управляющих',
      siteDescription: 'Официальный сайт саморегулируемой организации арбитражных управляющих',
      contactEmail: 'info@sro-au.ru',
      contactPhone: '+7 (495) 123-45-67',
      address: 'г. Москва, ул. Примерная, д. 1',
      workingHours: 'Пн-Пт: 9:00-18:00',
      socialLinks: {},
      seoSettings: {
        defaultTitle: 'СРО Арбитражных Управляющих',
        defaultDescription: 'Официальный сайт саморегулируемой организации арбитражных управляющих',
        defaultKeywords: 'СРО, арбитражные управляющие, банкротство, несостоятельность',
      },
      themeSettings: {
        primaryColor: '#8B7355', // Бежевый
        secondaryColor: '#F5F5DC', // Светло-бежевый
        accentColor: '#2C3E50', // Темно-синий
      },
      updatedBy: new Types.ObjectId(), // Временный ID для создания
    });

    return await defaultSettings.save();
  }

  async resetToDefaults(userId: string): Promise<SiteSettings> {
    try {
      await this.siteSettingsModel.deleteMany().exec();
      const defaultSettings = await this.createDefaultSettings();
      defaultSettings.updatedBy = new Types.ObjectId(userId);
      return await defaultSettings.save();
    } catch (error) {
      throw new BadRequestException('Ошибка при сбросе настроек: ' + error.message);
    }
  }

  async getSettingsHistory(): Promise<SiteSettings[]> {
    return await this.siteSettingsModel
      .find()
      .populate('updatedBy', 'email')
      .sort({ updatedAt: -1 })
      .exec();
  }
}
