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

@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInspectionDto: CreateInspectionDto, @Request() req) {
    return this.inspectionsService.create(createInspectionDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() query: InspectionQueryDto) {
    try {
      return await this.inspectionsService.findAll(query);
    } catch (error) {
      console.error('Error in findAll inspections:', error);
      throw error;
    }
  }

  @Get('statistics')
  getStatistics() {
    return this.inspectionsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
    @Request() req,
  ) {
    return this.inspectionsService.update(id, updateInspectionDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.inspectionsService.remove(id);
  }
}
