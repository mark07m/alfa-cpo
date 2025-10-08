import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.NEWS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createNewsDto: CreateNewsDto, @Request() req) {
    const news = await this.newsService.create(createNewsDto, req.user.id);
    return ResponseUtil.created(news, 'Новость успешно создана');
  }

  @Get()
  async findAll(@Query() query: NewsQueryDto) {
    const result = await this.newsService.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Новости успешно получены');
  }

  @Get('featured')
  async getFeaturedNews(@Query('limit') limit?: number) {
    const news = await this.newsService.getFeaturedNews(limit);
    return ResponseUtil.success(news, 'Рекомендуемые новости получены');
  }

  @Get('latest')
  async getLatestNews(@Query('limit') limit?: number) {
    const news = await this.newsService.getLatestNews(limit);
    return ResponseUtil.success(news, 'Последние новости получены');
  }

  @Get('public')
  async getPublicNews(@Query('category') category?: string, @Query('limit') limit?: number) {
    const news = await this.newsService.getPublicNews(category, limit);
    return ResponseUtil.success(news, 'Публичные новости получены');
  }

  @Get('search')
  async searchNews(@Query('q') query: string, @Query('limit') limit?: number) {
    const news = await this.newsService.searchNews(query, limit);
    return ResponseUtil.success(news, 'Результаты поиска получены');
  }

  @Get('category/:category')
  async getNewsByCategory(@Param('category') category: string, @Query('limit') limit?: number) {
    const news = await this.newsService.getNewsByCategory(category, limit);
    return ResponseUtil.success(news, 'Новости по категории получены');
  }

  @Get('categories')
  async getNewsCategories() {
    const categories = await this.newsService.getNewsCategories();
    return ResponseUtil.success(categories, 'Категории новостей получены');
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.NEWS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async createNewsCategory(@Body() createCategoryDto: CreateNewsCategoryDto) {
    const category = await this.newsService.createNewsCategory(createCategoryDto);
    return ResponseUtil.created(category, 'Категория новостей успешно создана');
  }

  @Put('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.NEWS_UPDATE)
  async updateNewsCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateNewsCategoryDto) {
    const category = await this.newsService.updateNewsCategory(id, updateCategoryDto);
    return ResponseUtil.updated(category, 'Категория новостей успешно обновлена');
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNewsCategory(@Param('id') id: string) {
    await this.newsService.deleteNewsCategory(id);
    return ResponseUtil.deleted('Категория новостей успешно удалена');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOne(id);
    return ResponseUtil.success(news, 'Новость получена');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.NEWS_UPDATE)
  async update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto, @Request() req) {
    const news = await this.newsService.update(id, updateNewsDto, req.user.id);
    return ResponseUtil.updated(news, 'Новость успешно обновлена');
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.NEWS_UPDATE)
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Request() req) {
    const news = await this.newsService.updateStatus(id, body.status, req.user.id);
    return ResponseUtil.updated(news, 'Статус новости успешно обновлен');
  }

  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkRemove(@Body() body: { ids: string[] }) {
    await this.newsService.bulkRemove(body.ids);
    return ResponseUtil.deleted('Новости успешно удалены');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.newsService.remove(id);
    return ResponseUtil.deleted('Новость успешно удалена');
  }
}
