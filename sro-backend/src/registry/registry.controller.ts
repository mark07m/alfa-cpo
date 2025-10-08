import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { RegistryService } from './registry.service';
import { CreateArbitraryManagerDto } from './dto/create-arbitrary-manager.dto';
import { UpdateArbitraryManagerDto } from './dto/update-arbitrary-manager.dto';
import { RegistryQueryDto } from './dto/registry-query.dto';
import { ImportRegistryDto } from './dto/import-registry.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createArbitraryManagerDto: CreateArbitraryManagerDto, @Request() req) {
    const manager = await this.registryService.create(createArbitraryManagerDto, req.user.id);
    return ResponseUtil.created(manager, 'Арбитражный управляющий успешно добавлен в реестр');
  }

  @Get()
  async findAll(@Query() query: RegistryQueryDto) {
    try {
      console.log('Registry findAll called with query:', query);
      const result = await this.registryService.findAll(query);
      console.log('Registry findAll result:', result);
      return ResponseUtil.paginated(result.data, result.pagination, 'Реестр арбитражных управляющих успешно получен');
    } catch (error) {
      console.error('Error in findAll:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  @Get('statistics')
  async getStatistics() {
    const statistics = await this.registryService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика реестра получена');
  }

  @Get('export/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename="registry.xlsx"')
  async exportToExcel(@Res() res: Response) {
    try {
      const buffer = await this.registryService.exportToExcel();
      res.send(buffer);
    } catch (error) {
      console.error('Error in exportToExcel:', error);
      res.status(500).json({ message: 'Ошибка экспорта в Excel' });
    }
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="registry.csv"')
  async exportToCsv(@Res() res: Response) {
    const csv = await this.registryService.exportToCsv();
    res.send(csv);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @RequirePermissions(Permission.REGISTRY_CREATE)
  @HttpCode(HttpStatus.OK)
  async import(@Body() importData: ImportRegistryDto, @Request() req) {
    const result = await this.registryService.importFromFile(importData, req.user.id);
    return ResponseUtil.success(result, 'Импорт данных в реестр выполнен успешно');
  }

  @Get('inn/:inn')
  async findByInn(@Param('inn') inn: string) {
    const manager = await this.registryService.findByInn(inn);
    return ResponseUtil.success(manager, 'Арбитражный управляющий найден по ИНН');
  }

  @Get('number/:registryNumber')
  async findByRegistryNumber(@Param('registryNumber') registryNumber: string) {
    const manager = await this.registryService.findByRegistryNumber(registryNumber);
    return ResponseUtil.success(manager, 'Арбитражный управляющий найден по номеру реестра');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const manager = await this.registryService.findOne(id);
    return ResponseUtil.success(manager, 'Арбитражный управляющий получен');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_UPDATE)
  async update(@Param('id') id: string, @Body() updateArbitraryManagerDto: UpdateArbitraryManagerDto, @Request() req) {
    const manager = await this.registryService.update(id, updateArbitraryManagerDto, req.user.id);
    return ResponseUtil.updated(manager, 'Арбитражный управляющий успешно обновлен');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @RequirePermissions(Permission.REGISTRY_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.registryService.remove(id);
    return ResponseUtil.deleted('Арбитражный управляющий успешно удален из реестра');
  }
}
