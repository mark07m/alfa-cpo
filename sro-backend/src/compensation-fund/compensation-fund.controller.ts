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
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('compensation-fund')
export class CompensationFundController {
  constructor(private readonly compensationFundService: CompensationFundService) {}

  @Get()
  async getFundInfo() {
    const fundInfo = await this.compensationFundService.getFundInfo();
    return ResponseUtil.success(fundInfo, 'Информация о компенсационном фонде получена');
  }

  @Get('statistics')
  async getFundStatistics() {
    const statistics = await this.compensationFundService.getFundStatistics();
    return ResponseUtil.success(statistics, 'Статистика компенсационного фонда получена');
  }

  @Get('recent')
  async getRecentHistory(@Query('limit') limit?: number) {
    const history = await this.compensationFundService.getRecentHistory(limit);
    return ResponseUtil.success(history, 'Последние записи истории получены');
  }

  @Get('history')
  async getHistory(@Query() query: HistoryQueryDto) {
    const result = await this.compensationFundService.getHistory(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'История компенсационного фонда получена');
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.SETTINGS_UPDATE)
  async updateFundInfo(@Body() updateCompensationFundDto: UpdateCompensationFundDto, @Request() req) {
    const fundInfo = await this.compensationFundService.updateFundInfo(updateCompensationFundDto, req.user.id);
    return ResponseUtil.updated(fundInfo, 'Информация о компенсационном фонде успешно обновлена');
  }

  @Post('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.SETTINGS_UPDATE)
  @HttpCode(HttpStatus.CREATED)
  async addHistoryEntry(@Body() addHistoryEntryDto: AddHistoryEntryDto, @Request() req) {
    const entry = await this.compensationFundService.addHistoryEntry(addHistoryEntryDto, req.user.id);
    return ResponseUtil.created(entry, 'Запись в историю компенсационного фонда успешно добавлена');
  }
}
