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
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import * as fs from 'fs';
import * as path from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    return this.documentsService.create(createDocumentDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: DocumentQueryDto) {
    return this.documentsService.findAll(query);
  }

  @Get('public')
  getPublicDocuments(@Query() query: DocumentQueryDto) {
    return this.documentsService.getPublicDocuments(query);
  }

  @Get('categories')
  getCategories() {
    return this.documentsService.getCategories();
  }

  @Get('category/:category')
  getDocumentsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number
  ) {
    return this.documentsService.getDocumentsByCategory(category, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const document = await this.documentsService.findOne(id);
    
    if (!document.isPublic) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Документ недоступен для скачивания'
      });
    }

    // Увеличиваем счетчик скачиваний
    await this.documentsService.incrementDownloadCount(id);

    // Проверяем существование файла
    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Файл не найден на сервере'
      });
    }

    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.fileSize);

    // Создаем поток для чтения файла
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_UPDATE)
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Request() req) {
    return this.documentsService.update(id, updateDocumentDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.DOCUMENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
