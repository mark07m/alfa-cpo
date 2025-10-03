import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true })
export class SiteSettings {
  @Prop({ required: true })
  siteName: string;

  @Prop({ required: true })
  siteDescription: string;

  @Prop({ required: true })
  contactEmail: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  workingHours: string;

  @Prop({
    type: {
      facebook: String,
      twitter: String,
      linkedin: String,
      telegram: String,
      vk: String,
    },
    default: {}
  })
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    vk?: string;
  };

  @Prop({
    type: {
      defaultTitle: String,
      defaultDescription: String,
      defaultKeywords: String,
      ogImage: String,
      twitterCard: String,
    },
    required: true
  })
  seoSettings: {
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string;
    ogImage?: string;
    twitterCard?: string;
  };

  @Prop({
    type: {
      primaryColor: String,
      secondaryColor: String,
      accentColor: String,
      logoUrl: String,
      faviconUrl: String,
    },
    required: true
  })
  themeSettings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  updatedBy: Types.ObjectId;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
