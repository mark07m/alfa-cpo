import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BlockedIpDocument = BlockedIp & Document;

@Schema({ timestamps: true, collection: 'blocked_ips' })
export class BlockedIp {
  @Prop({ required: true, index: true })
  ipAddress: string;

  @Prop()
  reason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop()
  expiresAt?: Date;
}

export const BlockedIpSchema = SchemaFactory.createForClass(BlockedIp);
BlockedIpSchema.index({ ipAddress: 1 }, { unique: true });
BlockedIpSchema.index({ expiresAt: 1 });

