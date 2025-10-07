import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from '@/database/schemas/news.schema';
import { NewsCategory, NewsCategoryDocument } from '@/database/schemas/news-category.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';

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
        totalPages: Math.ceil(total / limit),
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

  async getPublicNews(category?: string, limit: number = 10): Promise<News[]> {
    const filter: any = { status: 'published' };
    
    if (category) {
      const categoryDoc = await this.newsCategoryModel.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    return this.newsModel
      .find(filter)
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async searchNews(query: string, limit: number = 10): Promise<News[]> {
    const searchRegex = { $regex: query, $options: 'i' };
    
    return this.newsModel
      .find({
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { excerpt: searchRegex },
        ],
        status: 'published'
      })
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getNewsByCategory(categorySlug: string, limit: number = 10): Promise<News[]> {
    const category = await this.newsCategoryModel.findOne({ slug: categorySlug });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return this.newsModel
      .find({ category: category._id, status: 'published' })
      .populate('author', 'name email')
      .populate('category', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getNewsCategories(): Promise<NewsCategory[]> {
    return this.newsCategoryModel
      .find()
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  async createNewsCategory(createCategoryDto: CreateNewsCategoryDto): Promise<NewsCategory> {
    const category = new this.newsCategoryModel(createCategoryDto);
    return category.save();
  }

  async updateNewsCategory(id: string, updateCategoryDto: UpdateNewsCategoryDto): Promise<NewsCategory> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID категории');
    }

    const category = await this.newsCategoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async deleteNewsCategory(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID категории');
    }

    // Проверяем, есть ли новости в этой категории
    const newsCount = await this.newsModel.countDocuments({ category: id });
    if (newsCount > 0) {
      throw new BadRequestException('Нельзя удалить категорию, в которой есть новости');
    }

    const result = await this.newsCategoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Категория не найдена');
    }
  }

  async updateStatus(id: string, status: string, userId: string): Promise<News> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID новости');
    }

    const updateData: any = {
      status,
      updatedBy: new Types.ObjectId(userId),
    };

    if (status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
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

  async bulkRemove(ids: string[]): Promise<void> {
    // Проверяем валидность всех ID
    const invalidIds = ids.filter(id => !Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException('Некоторые ID новостей неверны');
    }

    const result = await this.newsModel.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Новости не найдены');
    }
  }
}
