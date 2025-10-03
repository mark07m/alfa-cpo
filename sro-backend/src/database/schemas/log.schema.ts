import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ 
    type: String, 
    enum: ['debug', 'info', 'warn', 'error'], 
    required: true 
  })
  level: 'debug' | 'info' | 'warn' | 'error';

  @Prop({ required: true })
  message: string;

  @Prop()
  context?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  ip?: string;

  @Prop()
  userAgent?: string;

  @Prop({
    type: Map,
    of: MongooseSchema.Types.Mixed,
  })
  metadata?: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
export const LogModel = { name: 'Log', schema: LogSchema };
