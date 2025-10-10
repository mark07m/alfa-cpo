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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { ResponseUtil } from '@/common/utils/response.util';
import * as fs from 'fs';
import * as path from 'path';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

// Настройка Multer для загрузки документов
const multerConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Неподдерживаемый тип файла'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
};

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDocumentDto: CreateDocumentDto, @Request() req) {
    const document = await this.documentsService.create(createDocumentDto, req.user.id);
    return ResponseUtil.created(document, 'Документ успешно создан');
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_CREATE)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Обрабатываем валидацию tags и isPublic
    if (uploadDocumentDto.tags && typeof uploadDocumentDto.tags === 'string') {
      const tagsString = uploadDocumentDto.tags as any;
      (uploadDocumentDto as any).tags = tagsString.split(',').map(tag => tag.trim());
    }
    
    if (uploadDocumentDto.isPublic && typeof uploadDocumentDto.isPublic === 'string') {
      const isPublicString = uploadDocumentDto.isPublic as any;
      (uploadDocumentDto as any).isPublic = isPublicString === 'true';
    }

    const document = await this.documentsService.uploadDocument(file, uploadDocumentDto, req.user.id);
    return ResponseUtil.created(document, 'Документ успешно загружен');
  }

  @Get()
  async findAll(@Query() query: DocumentQueryDto) {
    const result = await this.documentsService.findAll(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Документы успешно получены');
  }

  @Get('public')
  async getPublicDocuments(@Query() query: DocumentQueryDto) {
    const result = await this.documentsService.getPublicDocuments(query);
    return ResponseUtil.paginated(result.data, result.pagination, 'Публичные документы получены');
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.documentsService.getCategories();
    return ResponseUtil.success(categories, 'Категории документов получены');
  }

  @Get('category/:category')
  async getDocumentsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number
  ) {
    const documents = await this.documentsService.getDocumentsByCategory(category, limit);
    return ResponseUtil.success(documents, 'Документы по категории получены');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const document = await this.documentsService.findOne(id);
    return ResponseUtil.success(document, 'Документ получен');
  }

  // Версионирование документов
  @Get(':id/versions')
  async getVersions(@Param('id') id: string) {
    const versions = await this.documentsService.getVersions(id);
    return ResponseUtil.success(versions, 'Версии документа получены');
  }

  @Post(':id/versions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_UPDATE)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @HttpCode(HttpStatus.CREATED)
  async uploadVersion(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('changeLog') changeLog: string,
    @Request() req: any,
  ) {
    const version = await this.documentsService.addVersion(id, file, changeLog, req.user.id);
    return ResponseUtil.created(version, 'Версия документа добавлена');
  }

  @Delete(':id/versions/:versionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.DOCUMENTS_UPDATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteVersion(@Param('id') id: string, @Param('versionId') versionId: string) {
    await this.documentsService.deleteVersion(id, versionId);
    return ResponseUtil.deleted('Версия документа удалена');
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

  @Get(':id/preview')
  async previewDocument(@Param('id') id: string, @Res() res: Response) {
    const document = await this.documentsService.findOne(id);
    
    if (!document.isPublic) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: 'Документ недоступен для просмотра'
      });
    }

    // Проверяем существование файла
    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Файл не найден на сервере'
      });
    }

    // Устанавливаем заголовки для просмотра
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    res.setHeader('Content-Length', document.fileSize);

    // Создаем поток для чтения файла
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.DOCUMENTS_UPDATE)
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto, @Request() req) {
    const document = await this.documentsService.update(id, updateDocumentDto, req.user.id);
    return ResponseUtil.updated(document, 'Документ успешно обновлен');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.DOCUMENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.documentsService.remove(id);
    return ResponseUtil.deleted('Документ успешно удален');
  }

  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.DOCUMENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkRemove(@Body() body: { ids: string[] }) {
    await this.documentsService.bulkRemove(body.ids);
    return ResponseUtil.deleted('Документы успешно удалены');
  }
}
