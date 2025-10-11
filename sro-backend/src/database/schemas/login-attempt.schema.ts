import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoginAttemptDocument = LoginAttempt & Document;

@Schema({ timestamps: true })
export class LoginAttempt {
  @Prop()
  email?: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent?: string;

  @Prop({ 
    type: String, 
    enum: ['success', 'failed', 'blocked'], 
    required: true 
  })
  status: 'success' | 'failed' | 'blocked';

  @Prop()
  failureReason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop()
  location?: string;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);
// Indexes to support security analytics and rate limiting checks
LoginAttemptSchema.index({ createdAt: -1 });
LoginAttemptSchema.index({ ipAddress: 1, createdAt: -1 });
