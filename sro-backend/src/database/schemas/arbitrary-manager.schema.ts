import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArbitraryManagerDocument = ArbitraryManager & Document;

@Schema({ timestamps: true })
export class ArbitraryManager {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  inn: string;

  @Prop({ required: true, unique: true })
  registryNumber: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  region?: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'excluded', 'suspended'], 
    default: 'active' 
  })
  status: 'active' | 'excluded' | 'suspended';

  @Prop({ required: true })
  joinDate: Date;

  @Prop()
  excludeDate?: Date;

  @Prop()
  excludeReason?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  birthPlace?: string;

  @Prop()
  registrationDate?: Date;

  @Prop()
  decisionNumber?: string;

  @Prop()
  education?: string;

  @Prop()
  workExperience?: string;

  @Prop()
  internship?: string;

  @Prop()
  examCertificate?: string;

  @Prop()
  disqualification?: string;

  @Prop()
  criminalRecord?: string;

  @Prop()
  insurance?: string;

  @Prop()
  compensationFundContribution?: number;

  @Prop()
  penalties?: string;

  @Prop()
  complianceStatus?: string;

  @Prop()
  lastInspection?: Date;

  @Prop()
  postalAddress?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Document' }] })
  documents?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const ArbitraryManagerSchema = SchemaFactory.createForClass(ArbitraryManager);
