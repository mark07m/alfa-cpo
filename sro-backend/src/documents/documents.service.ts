import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentModel, DocumentDocument } from '@/database/schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentModel.name) private documentModel: Model<DocumentDocument>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto, userId: string): Promise<DocumentModel> {
    const document = new this.documentModel({
      ...createDocumentDto,
      uploadedAt: new Date(),
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });

    return document.save();
  }

  async findAll(query: DocumentQueryDto) {
    const {
      search,
      category,
      tag,
      isPublic,
      sortBy = 'uploadedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    // Поиск по тексту
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } },
      ];
    }

    // Фильтр по категории
    if (category) {
      filter.category = category;
    }

    // Фильтр по тегу
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Фильтр по публичности
    if (isPublic !== undefined) {
      filter.isPublic = isPublic;
    }

    // Сортировка
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Пагинация
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.documentModel
        .find(filter)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.documentModel.countDocuments(filter),
    ]);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<DocumentModel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID документа');
    }

    const document = await this.documentModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto, userId: string): Promise<DocumentModel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID документа');
    }

    const updateData = {
      ...updateDocumentDto,
      updatedBy: new Types.ObjectId(userId),
    };

    const document = await this.documentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    return document;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID документа');
    }

    const result = await this.documentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Документ не найден');
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID документа');
    }

    await this.documentModel.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).exec();
  }

  async getCategories(): Promise<Array<{ value: string; label: string; count: number }>> {
    const categories = await this.documentModel.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryLabels = {
      'regulatory': 'Нормативные документы',
      'rules': 'Правила профессиональной деятельности',
      'reports': 'Отчеты',
      'compensation-fund': 'Компенсационный фонд',
      'labor-activity': 'Трудовая деятельность',
      'accreditation': 'Аккредитация',
      'other': 'Прочие документы'
    };

    return categories.map(cat => ({
      value: cat._id,
      label: categoryLabels[cat._id] || cat._id,
      count: cat.count
    }));
  }

  async getPublicDocuments(query: DocumentQueryDto) {
    const publicQuery = { ...query, isPublic: true };
    return this.findAll(publicQuery);
  }

  async getDocumentsByCategory(category: string, limit: number = 10): Promise<DocumentModel[]> {
    return this.documentModel
      .find({ category, isPublic: true })
      .populate('createdBy', 'name email')
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .exec();
  }
}
