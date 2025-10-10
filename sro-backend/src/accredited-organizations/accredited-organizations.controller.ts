import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
  Header,
} from '@nestjs/common';
import type { Response } from 'express';
import { AccreditedOrganizationsService } from './accredited-organizations.service';
import { CreateAccreditedOrganizationDto } from './dto/create-accredited-organization.dto';
import { UpdateAccreditedOrganizationDto } from './dto/update-accredited-organization.dto';
import { AccreditedOrganizationQueryDto } from './dto/acc-org-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('accredited-organizations')
export class AccreditedOrganizationsController {
  constructor(private readonly service: AccreditedOrganizationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAccreditedOrganizationDto, @Request() req) {
    const org = await this.service.create(dto, req.user.id);
    return ResponseUtil.created(org, 'Организация добавлена');
  }

  @Get()
  async findAll(@Query() query: AccreditedOrganizationQueryDto) {
    const result = await this.service.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Список организаций получен');
  }

  @Get('stats')
  async getStats() {
    const stats = await this.service.getStats();
    return ResponseUtil.success(stats, 'Статистика аккредитованных организаций получена');
  }

  @Get('check-inn')
  async checkInnUnique(@Query('inn') inn: string, @Query('excludeId') excludeId?: string) {
    const unique = await this.service.checkInnUnique(inn, excludeId);
    return ResponseUtil.success({ unique });
  }

  @Get('check-ogrn')
  async checkOgrnUnique(@Query('ogrn') ogrn: string, @Query('excludeId') excludeId?: string) {
    const unique = await this.service.checkOgrnUnique(ogrn, excludeId);
    return ResponseUtil.success({ unique });
  }

  @Get('check-accreditation-number')
  async checkAccreditationNumberUnique(@Query('accreditationNumber') n: string, @Query('excludeId') excludeId?: string) {
    const unique = await this.service.checkAccreditationNumberUnique(n, excludeId);
    return ResponseUtil.success({ unique });
  }

  @Get('export')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="accredited-organizations.xlsx"')
  async export(@Res() res: Response, @Query() query: AccreditedOrganizationQueryDto) {
    try {
      const buffer = await this.service.exportToExcel(query);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка экспорта' });
    }
  }

  @Get('expiring-soon')
  async getExpiringSoon(@Query('days') days?: string) {
    const list = await this.service.getExpiringSoon(days ? Number(days) : 30);
    return ResponseUtil.success(list, 'Список организаций с истекающей аккредитацией');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const org = await this.service.findOne(id);
    return ResponseUtil.success(org, 'Организация получена');
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateAccreditedOrganizationDto, @Request() req) {
    const org = await this.service.update(id, dto, req.user.id);
    return ResponseUtil.updated(org, 'Организация обновлена');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return ResponseUtil.deleted('Организация удалена');
  }

  @Post('bulk-delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkDelete(@Body() body: { ids: string[] }) {
    await this.service.bulkDelete(body.ids || []);
    return ResponseUtil.deleted('Организации удалены');
  }
}


