import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccreditedOrganizationDocument = AccreditedOrganization & Document;

@Schema({ timestamps: true })
export class AccreditedOrganization {
  @Prop({ required: true })
  name: string;

  @Prop()
  shortName?: string;

  @Prop({ required: true, unique: true, index: true })
  inn: string;

  @Prop()
  kpp?: string;

  @Prop({ required: true, unique: true, index: true })
  ogrn: string;

  @Prop({ required: true })
  legalAddress: string;

  @Prop()
  actualAddress?: string;

  @Prop()
  region?: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  website?: string;

  @Prop({ required: true })
  directorName: string;

  @Prop({ required: true })
  directorPosition: string;

  @Prop({ required: true, unique: true, index: true })
  accreditationNumber: string;

  @Prop({ required: true })
  accreditationDate: Date;

  @Prop({ required: true })
  accreditationExpiryDate: Date;

  @Prop({ type: String, enum: ['active', 'suspended', 'revoked', 'expired'], default: 'active' })
  status: 'active' | 'suspended' | 'revoked' | 'expired';

  @Prop({ type: String, enum: ['educational', 'training', 'assessment', 'other'], required: true })
  accreditationType: 'educational' | 'training' | 'assessment' | 'other';

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({
    type: [
      {
        id: String,
        name: String,
        type: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    default: [],
  })
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  @Prop({
    type: [
      {
        name: String,
        position: String,
        phone: String,
        email: String,
      },
    ],
    default: [],
  })
  contacts: Array<{
    name: string;
    position: string;
    phone: string;
    email: string;
  }>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const AccreditedOrganizationSchema = SchemaFactory.createForClass(AccreditedOrganization);

// Текстовый индекс для поиска
AccreditedOrganizationSchema.index({ name: 'text', shortName: 'text', accreditationNumber: 'text' });

