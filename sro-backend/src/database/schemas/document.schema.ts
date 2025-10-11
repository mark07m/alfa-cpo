import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DocumentDocument = DocumentModel & Document;

@Schema({ timestamps: true })
export class DocumentModel {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ 
    type: String, 
    enum: ['regulatory', 'rules', 'reports', 'compensation-fund', 'labor-activity', 'accreditation', 'other'],
    required: true 
  })
  category: 'regulatory' | 'rules' | 'reports' | 'compensation-fund' | 'labor-activity' | 'accreditation' | 'other';

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  uploadedAt: Date;

  @Prop()
  version?: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: {
      author: String,
      publisher: String,
      language: String,
      pages: Number,
    },
  })
  metadata?: {
    author?: string;
    publisher?: string;
    language?: string;
    pages?: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, auto: true },
        version: String,
        fileUrl: String,
        fileName: String,
        mimeType: String,
        fileSize: Number,
        changeLog: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  versions?: Array<{
    _id: Types.ObjectId;
    version: string;
    fileUrl: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    changeLog?: string;
    createdAt: Date;
    createdBy: Types.ObjectId;
  }>;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentModel);
// Composite and single-field indexes for frequent queries and sorting
DocumentSchema.index({ category: 1, isPublic: 1 });
DocumentSchema.index({ tags: 1 });
DocumentSchema.index({ uploadedAt: -1 });
