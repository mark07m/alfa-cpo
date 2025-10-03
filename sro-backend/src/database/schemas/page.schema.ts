import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  excerpt?: string;

  @Prop({ 
    type: String, 
    enum: ['published', 'draft', 'archived'], 
    default: 'draft' 
  })
  status: 'published' | 'draft' | 'archived';

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({ type: [String] })
  seoKeywords?: string[];

  @Prop()
  template?: string;

  @Prop({
    type: Map,
    of: MongooseSchema.Types.Mixed,
  })
  metadata?: Record<string, any>;

  @Prop()
  publishedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const PageSchema = SchemaFactory.createForClass(Page);
