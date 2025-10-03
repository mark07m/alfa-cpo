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

@Controller('api/disciplinary-measures')
@UseGuards(JwtAuthGuard)
export class DisciplinaryMeasuresController {
  constructor(private readonly disciplinaryMeasuresService: DisciplinaryMeasuresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDisciplinaryMeasureDto: CreateDisciplinaryMeasureDto, @Request() req) {
    return this.disciplinaryMeasuresService.create(createDisciplinaryMeasureDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() query: DisciplinaryMeasureQueryDto) {
    try {
      return await this.disciplinaryMeasuresService.findAll(query);
    } catch (error) {
      console.error('Error in findAll disciplinary measures:', error);
      throw error;
    }
  }

  @Get('statistics')
  getStatistics() {
    return this.disciplinaryMeasuresService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplinaryMeasuresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplinaryMeasureDto: UpdateDisciplinaryMeasureDto,
    @Request() req,
  ) {
    return this.disciplinaryMeasuresService.update(id, updateDisciplinaryMeasureDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.disciplinaryMeasuresService.remove(id);
  }
}
