import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsCategoryService } from './news-category.service';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';

@Controller('news/categories')
export class NewsCategoryController {
  constructor(private readonly newsCategoryService: NewsCategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_CATEGORY_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNewsCategoryDto: CreateNewsCategoryDto) {
    return this.newsCategoryService.create(createNewsCategoryDto);
  }

  @Get()
  findAll() {
    return this.newsCategoryService.findAll();
  }

  @Get('active')
  findActive() {
    return this.newsCategoryService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsCategoryService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.newsCategoryService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_CATEGORY_UPDATE)
  update(@Param('id') id: string, @Body() updateNewsCategoryDto: UpdateNewsCategoryDto) {
    return this.newsCategoryService.update(id, updateNewsCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.NEWS_CATEGORY_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.newsCategoryService.remove(id);
  }

  @Patch('order/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.NEWS_CATEGORY_UPDATE)
  updateOrder(@Body() categories: { id: string; order: number }[]) {
    return this.newsCategoryService.updateOrder(categories);
  }
}
