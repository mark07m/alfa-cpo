import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArbitraryManagerDocument = ArbitraryManager & Document;

@Schema({ timestamps: true })
export class ArbitraryManager {
  // Основная информация
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  inn: string;

  @Prop({ required: true, unique: true })
  registryNumber: string;

  @Prop()
  snils?: string; // СНИЛС

  @Prop()
  stateRegistryNumber?: string; // Номер в Госреестре

  @Prop()
  stateRegistryDate?: Date; // Дата включения в Госреестр

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  region?: string;

  @Prop()
  city?: string; // Населенный пункт

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

  // Личная информация
  @Prop()
  birthDate?: Date;

  @Prop()
  birthPlace?: string;

  @Prop()
  registrationDate?: Date;

  @Prop()
  decisionNumber?: string;

  // Профессиональная подготовка
  @Prop()
  education?: string;

  @Prop()
  workExperience?: string;

  @Prop()
  internship?: string;

  @Prop()
  examCertificate?: string;

  // Дисквалификация и судимости
  @Prop()
  disqualification?: string;

  @Prop()
  criminalRecord?: string;

  @Prop()
  criminalRecordDate?: Date;

  @Prop()
  criminalRecordNumber?: string;

  @Prop()
  criminalRecordName?: string;

  // Страхование
  @Prop({
    type: {
      startDate: Date,
      endDate: Date,
      amount: Number,
      contractNumber: String,
      contractDate: Date,
      insuranceCompany: String,
    },
  })
  insurance?: {
    startDate?: Date;
    endDate?: Date;
    amount?: number;
    contractNumber?: string;
    contractDate?: Date;
    insuranceCompany?: string;
  };

  // Компенсационный фонд
  @Prop({
    type: [{
      purpose: String,
      date: Date,
      amount: Number,
    }],
  })
  compensationFundContributions?: {
    purpose: string;
    date: Date;
    amount: number;
  }[];

  @Prop()
  compensationFundContribution?: number; // Общая сумма взносов

  // Проверки
  @Prop({
    type: [{
      type: String,
      startDate: Date,
      endDate: Date,
      result: String,
    }],
  })
  inspections?: {
    type: string;
    startDate: Date;
    endDate: Date;
    result: string;
  }[];

  @Prop()
  lastInspection?: Date;

  // Дисциплинарные взыскания
  @Prop({
    type: [{
      startDate: Date,
      endDate: Date,
      decisionNumber: String,
      penalty: String,
    }],
  })
  disciplinaryMeasures?: {
    startDate: Date;
    endDate: Date;
    decisionNumber: string;
    penalty: string;
  }[];

  // Участие в других СРО
  @Prop({
    type: [{
      sroName: String,
      joinDate: Date,
      leaveDate: Date,
      status: String,
    }],
  })
  otherSroParticipation?: {
    sroName: string;
    joinDate: Date;
    leaveDate?: Date;
    status: string;
  }[];

  // Соответствие члена
  @Prop()
  complianceStatus?: string;

  @Prop()
  complianceDate?: Date;

  @Prop()
  complianceNumber?: string;

  // Контактная информация
  @Prop()
  postalAddress?: string;

  // Дополнительные поля
  @Prop()
  penalties?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Document' }] })
  documents?: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const ArbitraryManagerSchema = SchemaFactory.createForClass(ArbitraryManager);
