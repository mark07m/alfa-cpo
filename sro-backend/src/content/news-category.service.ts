import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NewsCategory, NewsCategoryDocument } from '@/database/schemas/news-category.schema';
import { News, NewsDocument } from '@/database/schemas/news.schema';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';

@Injectable()
export class NewsCategoryService {
  constructor(
    @InjectModel(NewsCategory.name) private newsCategoryModel: Model<NewsCategoryDocument>,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  async create(createNewsCategoryDto: CreateNewsCategoryDto): Promise<NewsCategory> {
    // Проверяем уникальность slug
    const existingCategory = await this.newsCategoryModel.findOne({
      slug: createNewsCategoryDto.slug,
    });

    if (existingCategory) {
      throw new ConflictException('Категория с таким slug уже существует');
    }

    const category = new this.newsCategoryModel(createNewsCategoryDto);
    return category.save();
  }

  async findAll(): Promise<NewsCategory[]> {
    return this.newsCategoryModel
      .find()
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async findActive(): Promise<NewsCategory[]> {
    return this.newsCategoryModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<NewsCategory> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID категории');
    }

    const category = await this.newsCategoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async findBySlug(slug: string): Promise<NewsCategory> {
    const category = await this.newsCategoryModel.findOne({ slug }).exec();
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async update(id: string, updateNewsCategoryDto: UpdateNewsCategoryDto): Promise<NewsCategory> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID категории');
    }

    // Проверяем уникальность slug, если он изменяется
    if (updateNewsCategoryDto.slug) {
      const existingCategory = await this.newsCategoryModel.findOne({
        slug: updateNewsCategoryDto.slug,
        _id: { $ne: id },
      });

      if (existingCategory) {
        throw new ConflictException('Категория с таким slug уже существует');
      }
    }

    const category = await this.newsCategoryModel
      .findByIdAndUpdate(id, updateNewsCategoryDto, { new: true })
      .exec();

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    return category;
  }

  async remove(id: string): Promise<void> {
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

  async updateOrder(categories: { id: string; order: number }[]): Promise<NewsCategory[]> {
    const updatePromises = categories.map(({ id, order }) =>
      this.newsCategoryModel.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    return this.findAll();
  }
}
