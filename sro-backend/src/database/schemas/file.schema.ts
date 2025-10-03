import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = FileModel & Document;

@Schema({ timestamps: true })
export class FileModel {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileExtension: string;

  @Prop({ default: false })
  isImage: boolean;

  @Prop()
  imageWidth?: number;

  @Prop()
  imageHeight?: number;

  @Prop()
  thumbnailPath?: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  description?: string;

  @Prop({
    type: {
      width: Number,
      height: Number,
      format: String,
      quality: Number,
    },
  })
  imageMetadata?: {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ default: Date.now })
  lastAccessedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);

// Индексы для оптимизации поиска
FileSchema.index({ mimeType: 1 });
FileSchema.index({ isImage: 1 });
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ uploadedAt: -1 });
FileSchema.index({ tags: 1 });
FileSchema.index({ isPublic: 1 });
