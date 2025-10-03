import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventTypeDocument = EventType & Document;

@Schema({ timestamps: true })
export class EventType {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop()
  color?: string;

  @Prop()
  icon?: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventTypeSchema = SchemaFactory.createForClass(EventType);
