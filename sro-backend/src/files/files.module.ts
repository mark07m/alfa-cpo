import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileLoggerService } from './file-logger.service';
import { FileModel, FileSchema } from '@/database/schemas/file.schema';
import { LogModel, LogSchema } from '@/database/schemas/log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema },
      { name: LogModel.name, schema: LogSchema },
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, FileLoggerService],
  exports: [FilesService, FileLoggerService],
})
export class FilesModule {}
