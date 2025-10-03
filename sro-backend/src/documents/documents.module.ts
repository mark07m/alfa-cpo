import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentModel, DocumentSchema } from '@/database/schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentModel.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
