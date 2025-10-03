import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CompensationFundDocument = CompensationFund & Document;

@Schema({ timestamps: true })
export class CompensationFund {
  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'RUB' })
  currency: string;

  @Prop({ required: true })
  lastUpdated: Date;

  @Prop({
    type: {
      bankName: String,
      accountNumber: String,
      bik: String,
      correspondentAccount: String,
      inn: String,
      kpp: String,
    },
    required: true
  })
  bankDetails: {
    bankName: string;
    accountNumber: string;
    bik: string;
    correspondentAccount: string;
    inn: string;
    kpp: string;
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'DocumentModel' }] })
  documents?: Types.ObjectId[];

  @Prop({
    type: [{
      date: Date,
      operation: String,
      amount: Number,
      description: String,
      documentUrl: String,
    }],
    default: []
  })
  history: CompensationFundHistory[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export interface CompensationFundHistory {
  date: Date;
  operation: 'increase' | 'decrease' | 'transfer';
  amount: number;
  description: string;
  documentUrl?: string;
}

export const CompensationFundSchema = SchemaFactory.createForClass(CompensationFund);
