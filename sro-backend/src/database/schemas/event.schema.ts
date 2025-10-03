import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  content?: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'EventType' })
  type?: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['draft', 'published', 'cancelled', 'completed'], 
    default: 'draft' 
  })
  status: 'draft' | 'published' | 'cancelled' | 'completed';

  @Prop()
  maxParticipants?: number;

  @Prop({ default: 0 })
  currentParticipants: number;

  @Prop({ default: false })
  registrationRequired: boolean;

  @Prop()
  registrationDeadline?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'DocumentModel' }] })
  materials?: Types.ObjectId[];

  @Prop()
  imageUrl?: string;

  @Prop()
  cover?: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  organizer?: string;

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  price?: number;

  @Prop({ default: 'RUB' })
  currency: string;

  @Prop()
  requirements?: string;

  @Prop({
    type: [{
      id: String,
      time: String,
      title: String,
      description: String,
      speaker: String,
      duration: Number,
    }],
    default: []
  })
  agenda: EventAgendaItem[];

  @Prop()
  seoTitle?: string;

  @Prop()
  seoDescription?: string;

  @Prop({ type: [String] })
  seoKeywords?: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export interface EventAgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  duration?: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
