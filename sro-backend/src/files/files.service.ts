import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FileModel, FileDocument } from '@/database/schemas/file.schema';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { FileLoggerService } from './file-logger.service';
import * as fs from 'fs';
import * as path from 'path';
// import sharp from 'sharp'; // Временно отключено из-за проблем с установкой
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel.name) private fileModel: Model<FileDocument>,
    private fileLoggerService: FileLoggerService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    userId: string,
  ): Promise<FileModel> {
    try {
      // Отладочная информация
      console.log('File object:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: !!file.buffer,
        path: file.path,
        fieldname: file.fieldname
      });

      // Создаем уникальное имя файла
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      
      // Определяем тип файла
      const isImage = file.mimetype.startsWith('image/');
      
      // Создаем директории
      const uploadDir = path.join(process.cwd(), 'uploads', 'files');
      const thumbnailDir = path.join(uploadDir, 'thumbnails');
      
      await fs.promises.mkdir(uploadDir, { recursive: true });
      if (isImage) {
        await fs.promises.mkdir(thumbnailDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/uploads/files/${fileName}`;

      // Читаем файл из временной папки и сохраняем в постоянную
      let fileBuffer: Buffer;
      if (file.buffer) {
        // Если есть buffer (memory storage)
        fileBuffer = file.buffer;
        console.log('Using file.buffer, size:', fileBuffer.length);
      } else if (file.path) {
        // Если файл сохранен на диск (disk storage)
        console.log('Reading file from path:', file.path);
        fileBuffer = await fs.promises.readFile(file.path);
        console.log('Read file buffer, size:', fileBuffer.length);
        // Удаляем временный файл
        await fs.promises.unlink(file.path);
      } else {
        console.log('No buffer or path found, file object:', file);
        throw new BadRequestException('Файл не найден');
      }

      // Проверяем, что fileBuffer не undefined
      if (!fileBuffer || fileBuffer.length === 0) {
        console.log('FileBuffer is empty or undefined');
        throw new BadRequestException('Файл пустой или поврежден');
      }

      // Сохраняем файл
      await fs.promises.writeFile(filePath, fileBuffer);

      let imageMetadata: any = {};
      let thumbnailPath: string | undefined;
      let thumbnailUrl: string | undefined;

      // Обрабатываем изображения (временно отключено из-за проблем с sharp)
      if (isImage) {
        // const image = sharp(fileBuffer);
        // const metadata = await image.metadata();
        
        imageMetadata = {
          width: 0,
          height: 0,
          format: 'unknown',
          quality: 90,
        };

        // Создаем превью (временно отключено)
        // const thumbnailFileName = `thumb_${fileName}`;
        // thumbnailPath = path.join(thumbnailDir, thumbnailFileName);
        // thumbnailUrl = `/uploads/files/thumbnails/${thumbnailFileName}`;

        // await image
        //   .resize(300, 300, { 
        //     fit: 'inside',
        //     withoutEnlargement: true 
        //   })
        //   .jpeg({ quality: 80 })
        //   .toFile(thumbnailPath);
      }

      // Создаем запись в БД
      const fileRecord = new this.fileModel({
        originalName: file.originalname,
        fileName,
        filePath,
        fileUrl,
        mimeType: file.mimetype,
        fileSize: file.size || fileBuffer.length,
        fileExtension: fileExtension.toLowerCase(),
        isImage,
        imageWidth: imageMetadata.width,
        imageHeight: imageMetadata.height,
        thumbnailPath,
        thumbnailUrl,
        description: uploadFileDto.description,
        tags: Array.isArray(uploadFileDto.tags) ? uploadFileDto.tags : [],
        isPublic: uploadFileDto.isPublic !== false,
        imageMetadata,
        uploadedBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
        uploadedAt: new Date(),
        lastAccessedAt: new Date(),
      });

      const savedFile = await fileRecord.save();
      
      // Логируем успешную загрузку
      await this.fileLoggerService.logFileUpload(
        userId,
        file.originalname,
        file.size || fileBuffer.length,
        file.mimetype,
        true,
      );
      
      return savedFile;
    } catch (error) {
      // Логируем ошибку загрузки
      await this.fileLoggerService.logFileUpload(
        userId,
        file.originalname,
        file.size || 0,
        file.mimetype,
        false,
        error.message,
      );
      
      throw new InternalServerErrorException(`Ошибка загрузки файла: ${error.message}`);
    }
  }

  async findAll(query: FileQueryDto) {
    const {
      search,
      mimeType,
      isImage,
      isPublic,
      tag,
      uploadedBy,
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { originalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (mimeType) {
      filter.mimeType = mimeType;
    }

    if (typeof isImage === 'boolean') {
      filter.isImage = isImage;
    }

    if (typeof isPublic === 'boolean') {
      filter.isPublic = isPublic;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (uploadedBy) {
      filter.uploadedBy = new Types.ObjectId(uploadedBy);
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.fileModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('uploadedBy', 'firstName lastName email')
        .populate('updatedBy', 'firstName lastName email')
        .exec(),
      this.fileModel.countDocuments(filter),
    ]);

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<FileModel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID файла');
    }

    const file = await this.fileModel
      .findById(id)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .exec();

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto, userId: string): Promise<FileModel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID файла');
    }

    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    const updatedFile = await this.fileModel
      .findByIdAndUpdate(
        id,
        {
          ...updateFileDto,
          updatedBy: new Types.ObjectId(userId),
        },
        { new: true }
      )
      .populate('uploadedBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .exec();

    if (!updatedFile) {
      throw new NotFoundException('Файл не найден');
    }
    
    return updatedFile;
  }

  async remove(id: string, userId?: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID файла');
    }

    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    try {
      // Удаляем физические файлы
      if (fs.existsSync(file.filePath)) {
        await fs.promises.unlink(file.filePath);
      }

      if (file.thumbnailPath && fs.existsSync(file.thumbnailPath)) {
        await fs.promises.unlink(file.thumbnailPath);
      }

      // Удаляем запись из БД
      await this.fileModel.findByIdAndDelete(id);
      
      // Логируем успешное удаление
      if (userId) {
        await this.fileLoggerService.logFileDelete(
          userId,
          id,
          file.originalName,
          true,
        );
      }
    } catch (error) {
      // Логируем ошибку удаления
      if (userId) {
        await this.fileLoggerService.logFileDelete(
          userId,
          id,
          file.originalName,
          false,
          error.message,
        );
      }
      
      throw new InternalServerErrorException(`Ошибка удаления файла: ${error.message}`);
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID файла');
    }

    await this.fileModel.findByIdAndUpdate(id, {
      $inc: { downloadCount: 1 },
      $set: { lastAccessedAt: new Date() },
    });
  }

  async getFileStream(id: string, userId?: string): Promise<{ stream: fs.ReadStream; file: FileModel }> {
    const file = await this.findOne(id);
    
    if (!fs.existsSync(file.filePath)) {
      throw new NotFoundException('Файл не найден на диске');
    }

    const stream = fs.createReadStream(file.filePath);
    
    // Увеличиваем счетчик скачиваний
    await this.incrementDownloadCount(id);
    
    // Логируем скачивание
    if (userId) {
      await this.fileLoggerService.logFileDownload(
        userId,
        id,
        file.originalName,
        true,
      );
    }

    return { stream, file };
  }

  async getThumbnailStream(id: string): Promise<{ stream: fs.ReadStream; file: FileModel }> {
    const file = await this.findOne(id);
    
    if (!file.isImage || !file.thumbnailPath) {
      throw new BadRequestException('Превью недоступно для данного файла');
    }

    if (!fs.existsSync(file.thumbnailPath)) {
      throw new NotFoundException('Превью не найдено на диске');
    }

    const stream = fs.createReadStream(file.thumbnailPath);
    return { stream, file };
  }

  async getFileStats(): Promise<any> {
    const stats = await this.fileModel.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          totalImages: { $sum: { $cond: ['$isImage', 1, 0] } },
          totalDownloads: { $sum: '$downloadCount' },
        },
      },
    ]);

    const mimeTypeStats = await this.fileModel.aggregate([
      {
        $group: {
          _id: '$mimeType',
          count: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      ...stats[0],
      mimeTypeStats,
    };
  }
}
