import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '@/common/types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.EDITOR 
  })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({
    type: {
      avatar: String,
      phone: String,
      position: String,
    },
  })
  profile?: {
    avatar?: string;
    phone?: string;
    position?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
