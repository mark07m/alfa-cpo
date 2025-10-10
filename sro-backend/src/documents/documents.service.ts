import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DocumentModel, DocumentDocument } from '@/database/schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

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

  async uploadDocument(
    file: Express.Multer.File,
    uploadDocumentDto: UploadDocumentDto,
    userId: string,
  ): Promise<DocumentModel> {
    try {
      // Создаем уникальное имя файла
      const fileExtension = path.extname(file.originalname);
      const fileName = `${randomUUID()}${fileExtension}`;
      
      // Создаем директории
      const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      const fileUrl = `/uploads/documents/${fileName}`;

      // Сохраняем файл
      await fs.promises.writeFile(filePath, file.buffer);

      // Определяем тип файла
      const fileType = fileExtension.substring(1).toLowerCase();

      // Создаем документ
      const document = new this.documentModel({
        title: uploadDocumentDto.title,
        description: uploadDocumentDto.description,
        category: uploadDocumentDto.category,
        fileUrl,
        fileName,
        originalName: file.originalname,
        fileSize: file.size,
        fileType,
        mimeType: file.mimetype,
        version: uploadDocumentDto.version || '1.0',
        isPublic: uploadDocumentDto.isPublic || false,
        tags: uploadDocumentDto.tags || [],
        uploadedAt: new Date(),
        downloadCount: 0,
        createdBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
      });

      return document.save();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new BadRequestException('Ошибка при загрузке документа');
    }
  }

  async getVersions(documentId: string) {
    if (!Types.ObjectId.isValid(documentId)) {
      throw new BadRequestException('Неверный ID документа');
    }
    const doc = await this.documentModel.findById(documentId).lean().exec();
    if (!doc) throw new NotFoundException('Документ не найден');
    return doc.versions || [];
  }

  async addVersion(
    documentId: string,
    file: Express.Multer.File,
    changeLog: string | undefined,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(documentId)) {
      throw new BadRequestException('Неверный ID документа');
    }
    if (!file) throw new BadRequestException('Файл не предоставлен');

    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    const fileUrl = `/uploads/documents/${fileName}`;
    await fs.promises.writeFile(filePath, file.buffer);

    const fileType = fileExtension.substring(1).toLowerCase();

    const doc = await this.documentModel.findById(documentId);
    if (!doc) throw new NotFoundException('Документ не найден');

    // Автоинкремент текстовой версии на основе последней версии
    let nextVersion = '1.0';
    if (doc.versions && doc.versions.length > 0) {
      const last = doc.versions[doc.versions.length - 1];
      const [major, minor] = (last.version || '1.0').split('.').map(n => parseInt(n || '0', 10));
      nextVersion = `${major}.${(minor || 0) + 1}`;
    }

    doc.versions = doc.versions || [];
    doc.versions.push({
      version: nextVersion,
      fileUrl,
      fileName,
      mimeType: file.mimetype,
      fileSize: file.size,
      changeLog,
      createdAt: new Date(),
      createdBy: new Types.ObjectId(userId),
    } as any);

    await doc.save();
    const saved = doc.versions[doc.versions.length - 1];
    return saved;
  }

  async deleteVersion(documentId: string, versionId: string): Promise<void> {
    if (!Types.ObjectId.isValid(documentId) || !Types.ObjectId.isValid(versionId)) {
      throw new BadRequestException('Неверные ID');
    }
    const doc = await this.documentModel.findById(documentId);
    if (!doc) throw new NotFoundException('Документ не найден');

    const initialLength = (doc.versions || []).length;
    doc.versions = (doc.versions || []).filter((v: any) => String(v._id) !== String(versionId));
    if (doc.versions.length === initialLength) {
      throw new NotFoundException('Версия не найдена');
    }
    await doc.save();
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
        totalPages: Math.ceil(total / limit),
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

  async bulkRemove(ids: string[]): Promise<void> {
    // Валидируем все ID
    const validIds = ids.filter(id => Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      throw new BadRequestException('Неверные ID документов');
    }

    const result = await this.documentModel.deleteMany({ _id: { $in: validIds } }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Документы не найдены');
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
