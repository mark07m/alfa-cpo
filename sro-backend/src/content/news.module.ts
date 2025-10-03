import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { NewsCategoryService } from './news-category.service';
import { NewsCategoryController } from './news-category.controller';
import { News, NewsSchema } from '@/database/schemas/news.schema';
import { NewsCategory, NewsCategorySchema } from '@/database/schemas/news-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: NewsCategory.name, schema: NewsCategorySchema },
    ]),
  ],
  controllers: [NewsController, NewsCategoryController],
  providers: [NewsService, NewsCategoryService],
  exports: [NewsService, NewsCategoryService],
})
export class NewsModule {}
