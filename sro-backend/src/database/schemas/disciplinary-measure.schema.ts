import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisciplinaryMeasureDocument = DisciplinaryMeasure & Document;

@Schema({ timestamps: true })
export class DisciplinaryMeasure {
  @Prop({ type: Types.ObjectId, ref: 'ArbitraryManager', required: true })
  managerId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['warning', 'reprimand', 'exclusion', 'suspension', 'other'], 
    required: true 
  })
  type: 'warning' | 'reprimand' | 'exclusion' | 'suspension' | 'other';

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  decisionNumber: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'cancelled', 'expired'], 
    default: 'active' 
  })
  status: 'active' | 'cancelled' | 'expired';

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Document' }] })
  documents?: Types.ObjectId[];

  @Prop()
  appealDeadline?: Date;

  @Prop({ 
    type: String, 
    enum: ['none', 'submitted', 'reviewed', 'approved', 'rejected'],
    default: 'none'
  })
  appealStatus?: 'none' | 'submitted' | 'reviewed' | 'approved' | 'rejected';

  @Prop()
  appealNotes?: string;

  @Prop()
  appealDate?: Date;

  @Prop()
  appealDecision?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const DisciplinaryMeasureSchema = SchemaFactory.createForClass(DisciplinaryMeasure);
