import { Controller, Get, Query } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { InspectionQueryDto } from './dto/inspection-query.dto';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('public/inspections')
export class PublicInspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Get()
  async findAll(@Query() query: InspectionQueryDto) {
    const result = await this.inspectionsService.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Проверки (публично) успешно получены');
  }

  @Get('statistics')
  async getStatistics() {
    const statistics = await this.inspectionsService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика проверок (публично) получена');
  }
}


