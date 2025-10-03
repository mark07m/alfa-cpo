import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Page, PageDocument } from '@/database/schemas/page.schema';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageQueryDto } from './dto/page-query.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
  ) {}

  async create(createPageDto: CreatePageDto, userId: string): Promise<Page> {
    try {
      // Проверяем уникальность slug
      const existingPage = await this.pageModel.findOne({ slug: createPageDto.slug }).exec();
      if (existingPage) {
        throw new ConflictException('Страница с таким slug уже существует');
      }

      const page = new this.pageModel({
        ...createPageDto,
        createdBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
        publishedAt: createPageDto.status === 'published' ? new Date() : createPageDto.publishedAt,
      });

      return await page.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Ошибка при создании страницы: ' + error.message);
    }
  }

  async findAll(query: PageQueryDto) {
    const {
      search,
      status,
      template,
      publishedAtFrom,
      publishedAtTo,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (template) {
      filter.template = template;
    }

    if (publishedAtFrom || publishedAtTo) {
      filter.publishedAt = {};
      if (publishedAtFrom) {
        filter.publishedAt.$gte = new Date(publishedAtFrom);
      }
      if (publishedAtTo) {
        filter.publishedAt.$lte = new Date(publishedAtTo);
      }
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [pages, total] = await Promise.all([
      this.pageModel
        .find(filter)
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.pageModel.countDocuments(filter),
    ]);

    return {
      data: pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Page> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID страницы');
    }

    const page = await this.pageModel
      .findById(id)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!page) {
      throw new NotFoundException('Страница не найдена');
    }

    return page;
  }

  async findBySlug(slug: string): Promise<Page> {
    const page = await this.pageModel
      .findOne({ slug, status: 'published' })
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!page) {
      throw new NotFoundException('Страница не найдена');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string): Promise<Page> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID страницы');
    }

    // Если обновляется slug, проверяем уникальность
    if (updatePageDto.slug) {
      const existingPage = await this.pageModel.findOne({ 
        slug: updatePageDto.slug,
        _id: { $ne: id }
      }).exec();
      
      if (existingPage) {
        throw new ConflictException('Страница с таким slug уже существует');
      }
    }

    const updateData: any = {
      ...updatePageDto,
      updatedBy: new Types.ObjectId(userId),
    };

    // Если статус меняется на published, устанавливаем publishedAt
    if (updatePageDto.status === 'published' && !updatePageDto.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const page = await this.pageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!page) {
      throw new NotFoundException('Страница не найдена');
    }

    return page;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID страницы');
    }

    const result = await this.pageModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Страница не найдена');
    }
  }

  async getStatistics() {
    const stats = await this.pageModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          published: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draft: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          archived: {
            $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
          },
          withSeo: {
            $sum: { 
              $cond: [
                { $and: [
                  { $ne: ['$seoTitle', null] },
                  { $ne: ['$seoDescription', null] }
                ]}, 
                1, 
                0
              ]
            }
          },
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      withSeo: 0,
    };
  }

  async getTemplates() {
    const templates = await this.pageModel.distinct('template', { template: { $ne: null } });
    return templates;
  }

  async getSlugs() {
    const pages = await this.pageModel
      .find({ status: 'published' }, 'slug title')
      .sort({ title: 1 })
      .exec();
    
    return pages.map(page => ({
      slug: page.slug,
      title: page.title,
    }));
  }
}
