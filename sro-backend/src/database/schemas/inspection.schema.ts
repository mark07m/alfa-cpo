import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InspectionDocument = Inspection & Document;

@Schema({ timestamps: true })
export class Inspection {
  @Prop({ type: Types.ObjectId, ref: 'ArbitraryManager', required: true })
  managerId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['planned', 'unplanned'], 
    required: true 
  })
  type: 'planned' | 'unplanned';

  @Prop({ 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop()
  completedDate?: Date;

  @Prop({ required: true })
  inspector: string;

  @Prop({ 
    type: String, 
    enum: ['passed', 'failed', 'needs_improvement'] 
  })
  result?: 'passed' | 'failed' | 'needs_improvement';

  @Prop()
  notes?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'DocumentModel' }] })
  documents?: Types.ObjectId[];

  @Prop({
    type: [{
      id: String,
      description: String,
      severity: String,
      status: String,
      resolutionDate: Date,
      resolutionNotes: String,
    }],
    default: []
  })
  violations: InspectionViolation[];

  @Prop({ type: [String], default: [] })
  recommendations: string[];

  @Prop()
  nextInspectionDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export interface InspectionViolation {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'ignored';
  resolutionDate?: Date;
  resolutionNotes?: string;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
