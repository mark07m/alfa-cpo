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
import { DisciplinaryMeasuresService } from './disciplinary-measures.service';
import { CreateDisciplinaryMeasureDto } from './dto/create-disciplinary-measure.dto';
import { UpdateDisciplinaryMeasureDto } from './dto/update-disciplinary-measure.dto';
import { DisciplinaryMeasureQueryDto } from './dto/disciplinary-measure-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('disciplinary-measures')
@UseGuards(JwtAuthGuard)
export class DisciplinaryMeasuresController {
  constructor(private readonly disciplinaryMeasuresService: DisciplinaryMeasuresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDisciplinaryMeasureDto: CreateDisciplinaryMeasureDto, @Request() req) {
    const measure = await this.disciplinaryMeasuresService.create(createDisciplinaryMeasureDto, req.user.id);
    return ResponseUtil.created(measure, 'Дисциплинарная мера успешно создана');
  }

  @Get()
  async findAll(@Query() query: DisciplinaryMeasureQueryDto) {
    try {
      const result = await this.disciplinaryMeasuresService.findAll(query);
      return ResponseUtil.paginated(result.data, result.pagination, 'Дисциплинарные меры успешно получены');
    } catch (error) {
      console.error('Error in findAll disciplinary measures:', error);
      throw error;
    }
  }

  @Get('statistics')
  async getStatistics() {
    const statistics = await this.disciplinaryMeasuresService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика дисциплинарных мер получена');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const measure = await this.disciplinaryMeasuresService.findOne(id);
    return ResponseUtil.success(measure, 'Дисциплинарная мера получена');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDisciplinaryMeasureDto: UpdateDisciplinaryMeasureDto,
    @Request() req,
  ) {
    const measure = await this.disciplinaryMeasuresService.update(id, updateDisciplinaryMeasureDto, req.user.id);
    return ResponseUtil.updated(measure, 'Дисциплинарная мера успешно обновлена');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.disciplinaryMeasuresService.remove(id);
    return ResponseUtil.deleted('Дисциплинарная мера успешно удалена');
  }
}
