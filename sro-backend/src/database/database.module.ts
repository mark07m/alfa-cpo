import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@/config/database.config';
import { User, UserSchema } from './schemas/user.schema';
import { ArbitraryManager, ArbitraryManagerSchema } from './schemas/arbitrary-manager.schema';
import { News, NewsSchema } from './schemas/news.schema';
import { NewsCategory, NewsCategorySchema } from './schemas/news-category.schema';
import { DocumentSchema, DocumentSchemaFactory } from './schemas/document.schema';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ArbitraryManager.name, schema: ArbitraryManagerSchema },
      { name: News.name, schema: NewsSchema },
      { name: NewsCategory.name, schema: NewsCategorySchema },
      { name: DocumentSchema.name, schema: DocumentSchemaFactory },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
