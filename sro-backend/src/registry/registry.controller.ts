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

@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArbitraryManagerDto: CreateArbitraryManagerDto, @Request() req) {
    return this.registryService.create(createArbitraryManagerDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() query: RegistryQueryDto) {
    try {
      console.log('Registry findAll called with query:', query);
      const result = await this.registryService.findAll(query);
      console.log('Registry findAll result:', result);
      return result;
    } catch (error) {
      console.error('Error in findAll:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  @Get('statistics')
  getStatistics() {
    return this.registryService.getStatistics();
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
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.REGISTRY_CREATE)
  @HttpCode(HttpStatus.OK)
  import(@Body() importData: ImportRegistryDto, @Request() req) {
    return this.registryService.importFromFile(importData, req.user.userId);
  }

  @Get('inn/:inn')
  findByInn(@Param('inn') inn: string) {
    return this.registryService.findByInn(inn);
  }

  @Get('number/:registryNumber')
  findByRegistryNumber(@Param('registryNumber') registryNumber: string) {
    return this.registryService.findByRegistryNumber(registryNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.REGISTRY_UPDATE)
  update(@Param('id') id: string, @Body() updateArbitraryManagerDto: UpdateArbitraryManagerDto, @Request() req) {
    return this.registryService.update(id, updateArbitraryManagerDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.REGISTRY_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.registryService.remove(id);
  }
}
