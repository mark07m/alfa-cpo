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
} from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionQueryDto } from './dto/inspection-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInspectionDto: CreateInspectionDto, @Request() req) {
    const inspection = await this.inspectionsService.create(createInspectionDto, req.user.id);
    return ResponseUtil.created(inspection, 'Проверка успешно создана');
  }

  @Get()
  async findAll(@Query() query: InspectionQueryDto) {
    try {
      const result = await this.inspectionsService.findAll(query);
      return ResponseUtil.paginated(result.data, result.pagination, 'Проверки успешно получены');
    } catch (error) {
      console.error('Error in findAll inspections:', error);
      throw error;
    }
  }

  @Get('statistics')
  async getStatistics() {
    const statistics = await this.inspectionsService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика проверок получена');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const inspection = await this.inspectionsService.findOne(id);
    return ResponseUtil.success(inspection, 'Проверка получена');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
    @Request() req,
  ) {
    const inspection = await this.inspectionsService.update(id, updateInspectionDto, req.user.id);
    return ResponseUtil.updated(inspection, 'Проверка успешно обновлена');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.inspectionsService.remove(id);
    return ResponseUtil.deleted('Проверка успешно удалена');
  }
}
