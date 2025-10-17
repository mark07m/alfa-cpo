import { Controller, Get, Query } from '@nestjs/common';
import { DisciplinaryMeasuresService } from './disciplinary-measures.service';
import { DisciplinaryMeasureQueryDto } from './dto/disciplinary-measure-query.dto';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('public/disciplinary-measures')
export class PublicDisciplinaryMeasuresController {
  constructor(private readonly disciplinaryMeasuresService: DisciplinaryMeasuresService) {}

  @Get()
  async findAll(@Query() query: DisciplinaryMeasureQueryDto) {
    const result = await this.disciplinaryMeasuresService.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Дисциплинарные меры (публично) успешно получены');
  }

  @Get('statistics')
  async getStatistics() {
    const statistics = await this.disciplinaryMeasuresService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика дисциплинарных мер (публично) получена');
  }
}


