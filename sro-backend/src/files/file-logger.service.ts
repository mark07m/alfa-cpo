import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogSchema } from '@/database/schemas/log.schema';

@Injectable()
export class FileLoggerService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<Log>,
  ) {}

  async logFileUpload(
    userId: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    const logEntry = new this.logModel({
      level: success ? 'info' : 'error',
      message: success 
        ? `Файл загружен: ${fileName} (${fileSize} байт, ${mimeType})`
        : `Ошибка загрузки файла: ${fileName} - ${error}`,
      context: 'file-upload',
      userId,
      metadata: {
        fileName,
        fileSize,
        mimeType,
        success,
        error,
      },
    });

    await logEntry.save();
  }

  async logFileDownload(
    userId: string,
    fileId: string,
    fileName: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    const logEntry = new this.logModel({
      level: success ? 'info' : 'error',
      message: success 
        ? `Файл скачан: ${fileName}`
        : `Ошибка скачивания файла: ${fileName} - ${error}`,
      context: 'file-download',
      userId,
      metadata: {
        fileId,
        fileName,
        success,
        error,
      },
    });

    await logEntry.save();
  }

  async logFileDelete(
    userId: string,
    fileId: string,
    fileName: string,
    success: boolean,
    error?: string,
  ): Promise<void> {
    const logEntry = new this.logModel({
      level: success ? 'info' : 'error',
      message: success 
        ? `Файл удален: ${fileName}`
        : `Ошибка удаления файла: ${fileName} - ${error}`,
      context: 'file-delete',
      userId,
      metadata: {
        fileId,
        fileName,
        success,
        error,
      },
    });

    await logEntry.save();
  }

  async logFileAccess(
    userId: string,
    fileId: string,
    fileName: string,
    action: 'view' | 'download' | 'thumbnail',
    success: boolean,
    error?: string,
  ): Promise<void> {
    const logEntry = new this.logModel({
      level: success ? 'info' : 'error',
      message: success 
        ? `Доступ к файлу (${action}): ${fileName}`
        : `Ошибка доступа к файлу (${action}): ${fileName} - ${error}`,
      context: 'file-access',
      userId,
      metadata: {
        fileId,
        fileName,
        action,
        success,
        error,
      },
    });

    await logEntry.save();
  }
}
