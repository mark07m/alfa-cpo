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
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPageDto: CreatePageDto, @Request() req) {
    const page = await this.pagesService.create(createPageDto, req.user.id);
    return ResponseUtil.created(page, 'Страница успешно создана');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: PageQueryDto) {
    const result = await this.pagesService.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Страницы успешно получены');
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  async getStatistics() {
    const statistics = await this.pagesService.getStatistics();
    return ResponseUtil.success(statistics, 'Статистика страниц получена');
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard)
  async getTemplates() {
    const templates = await this.pagesService.getTemplates();
    return ResponseUtil.success(templates, 'Шаблоны страниц получены');
  }

  @Get('slugs')
  async getSlugs() {
    const slugs = await this.pagesService.getSlugs();
    return ResponseUtil.success(slugs, 'Слаги страниц получены');
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);
    return ResponseUtil.success(page, 'Страница получена');
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const page = await this.pagesService.findOne(id);
    return ResponseUtil.success(page, 'Страница получена');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req,
  ) {
    const page = await this.pagesService.update(id, updatePageDto, req.user.id);
    return ResponseUtil.updated(page, 'Страница успешно обновлена');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.pagesService.remove(id);
    return ResponseUtil.deleted('Страница успешно удалена');
  }
}
