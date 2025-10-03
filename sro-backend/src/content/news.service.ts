import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from '@/database/schemas/news.schema';
import { NewsCategory, NewsCategoryDocument } from '@/database/schemas/news-category.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(NewsCategory.name) private newsCategoryModel: Model<NewsCategoryDocument>,
  ) {}

  async create(createNewsDto: CreateNewsDto, userId: string): Promise<News> {
    // Проверяем существование категории, если указана
    if (createNewsDto.category) {
      const category = await this.newsCategoryModel.findById(createNewsDto.category);
      if (!category) {
        throw new BadRequestException('Категория не найдена');
      }
    }

    const news = new this.newsModel({
      ...createNewsDto,
      publishedAt: new Date(createNewsDto.publishedAt),
      author: new Types.ObjectId(userId),
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });

    return news.save();
  }

  async findAll(query: NewsQueryDto) {
    const {
      search,
      category,
      tag,
      status,
      featured,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    // Поиск по тексту
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Фильтр по категории
    if (category) {
      filter.category = new Types.ObjectId(category);
    }

    // Фильтр по тегу
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Фильтр по статусу
    if (status) {
      filter.status = status;
    }

    // Фильтр по featured
    if (featured !== undefined) {
      filter.featured = featured;
    }

    // Сортировка
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Пагинация
    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.newsModel
        .find(filter)
        .populate('author', 'name email')
        .populate('category', 'name slug color')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.newsModel.countDocuments(filter),
    ]);

    return {
      data: news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<News> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID новости');
    }

    const news = await this.newsModel
      .findById(id)
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .exec();

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    // Увеличиваем счетчик просмотров
    await this.newsModel.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, userId: string): Promise<News> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID новости');
    }

    // Проверяем существование категории, если указана
    if (updateNewsDto.category) {
      const category = await this.newsCategoryModel.findById(updateNewsDto.category);
      if (!category) {
        throw new BadRequestException('Категория не найдена');
      }
    }

    const updateData = {
      ...updateNewsDto,
      updatedBy: new Types.ObjectId(userId),
    };

    if (updateNewsDto.publishedAt) {
      (updateData as any).publishedAt = new Date(updateNewsDto.publishedAt);
    }

    const news = await this.newsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .exec();

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return news;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID новости');
    }

    const result = await this.newsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Новость не найдена');
    }
  }

  async getFeaturedNews(limit: number = 5): Promise<News[]> {
    return this.newsModel
      .find({ featured: true, status: 'published' })
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getLatestNews(limit: number = 10): Promise<News[]> {
    return this.newsModel
      .find({ status: 'published' })
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }
}
