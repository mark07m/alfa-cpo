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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { StreamableFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

// Настройка Multer для загрузки файлов
const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/temp');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = randomUUID();
      const ext = extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Неподдерживаемый тип файла'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @RequirePermissions(Permission.FILE_UPLOAD)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    return this.filesService.uploadFile(file, uploadFileDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @RequirePermissions(Permission.FILE_READ)
  async findAll(@Query() query: FileQueryDto) {
    return this.filesService.findAll(query);
  }

  @Get('public')
  async findPublic(@Query() query: FileQueryDto) {
    // Публичный доступ только к публичным файлам
    query.isPublic = true;
    return this.filesService.findAll(query);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.FILE_READ)
  async getStats() {
    return this.filesService.getFileStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @RequirePermissions(Permission.FILE_READ)
  async findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id;
    const { stream, file } = await this.filesService.getFileStream(id, userId);
    
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.fileSize.toString(),
    });

    stream.pipe(res);
  }

  @Get(':id/thumbnail')
  async getThumbnail(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { stream, file } = await this.filesService.getThumbnailStream(id);
    
    res.set({
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000', // 1 год кэширования
    });

    stream.pipe(res);
  }

  @Get(':id/view')
  async viewFile(
    @Param('id') id: string,
    @Res() res: Response,
    @Request() req?: any,
  ) {
    const userId = req?.user?.id;
    const { stream, file } = await this.filesService.getFileStream(id, userId);
    
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `inline; filename="${file.originalName}"`,
      'Content-Length': file.fileSize.toString(),
    });

    stream.pipe(res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @RequirePermissions(Permission.FILE_UPDATE)
  async update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Request() req: any,
  ) {
    return this.filesService.update(id, updateFileDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(Permission.FILE_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.filesService.remove(id, req.user.id);
  }
}
