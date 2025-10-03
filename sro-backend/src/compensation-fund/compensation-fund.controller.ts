import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CompensationFundService } from './compensation-fund.service';
import { UpdateCompensationFundDto } from './dto/update-compensation-fund.dto';
import { AddHistoryEntryDto } from './dto/add-history-entry.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';

@Controller('compensation-fund')
export class CompensationFundController {
  constructor(private readonly compensationFundService: CompensationFundService) {}

  @Get()
  getFundInfo() {
    return this.compensationFundService.getFundInfo();
  }

  @Get('statistics')
  getFundStatistics() {
    return this.compensationFundService.getFundStatistics();
  }

  @Get('recent')
  getRecentHistory(@Query('limit') limit?: number) {
    return this.compensationFundService.getRecentHistory(limit);
  }

  @Get('history')
  getHistory(@Query() query: HistoryQueryDto) {
    return this.compensationFundService.getHistory(query);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.SETTINGS_UPDATE)
  updateFundInfo(@Body() updateCompensationFundDto: UpdateCompensationFundDto, @Request() req) {
    return this.compensationFundService.updateFundInfo(updateCompensationFundDto, req.user.userId);
  }

  @Post('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.SETTINGS_UPDATE)
  @HttpCode(HttpStatus.CREATED)
  addHistoryEntry(@Body() addHistoryEntryDto: AddHistoryEntryDto, @Request() req) {
    return this.compensationFundService.addHistoryEntry(addHistoryEntryDto, req.user.userId);
  }
}
