import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AccreditedOrganization, AccreditedOrganizationDocument } from '@/database/schemas/accredited-organization.schema';
import { CreateAccreditedOrganizationDto } from './dto/create-accredited-organization.dto';
import { UpdateAccreditedOrganizationDto } from './dto/update-accredited-organization.dto';
import { AccreditedOrganizationQueryDto } from './dto/acc-org-query.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class AccreditedOrganizationsService {
  constructor(
    @InjectModel(AccreditedOrganization.name) private readonly accOrgModel: Model<AccreditedOrganizationDocument>,
  ) {}

  async create(dto: CreateAccreditedOrganizationDto, userId: string): Promise<AccreditedOrganization> {
    await this.ensureUnique(dto);
    const created = await this.accOrgModel.create({
      ...dto,
      accreditationDate: new Date(dto.accreditationDate),
      accreditationExpiryDate: new Date(dto.accreditationExpiryDate),
      createdBy: userId,
      updatedBy: userId,
    });
    return created.toObject();
  }

  async findAll(query: AccreditedOrganizationQueryDto): Promise<{ data: AccreditedOrganization[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const filter: FilterQuery<AccreditedOrganizationDocument> = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { shortName: { $regex: query.search, $options: 'i' } },
        { inn: { $regex: query.search, $options: 'i' } },
        { ogrn: { $regex: query.search, $options: 'i' } },
        { accreditationNumber: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) filter.status = query.status;
    if (query.accreditationType) filter.accreditationType = query.accreditationType;
    if (query.region) filter.region = query.region;

    if (query.dateFrom || query.dateTo) {
      filter.accreditationDate = {} as any;
      if (query.dateFrom) (filter.accreditationDate as any).$gte = new Date(query.dateFrom);
      if (query.dateTo) (filter.accreditationDate as any).$lte = new Date(query.dateTo);
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    if (query.sortBy) {
      sort[query.sortBy] = query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = -1;
    }

    const [data, total] = await Promise.all([
      this.accOrgModel.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
      this.accOrgModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;
    return { data, pagination: { page, limit, total, totalPages } };
  }

  async findOne(id: string): Promise<AccreditedOrganization> {
    const org = await this.accOrgModel.findById(id).lean().exec();
    if (!org) throw new NotFoundException('Организация не найдена');
    return org;
  }

  async update(id: string, dto: UpdateAccreditedOrganizationDto, userId: string): Promise<AccreditedOrganization> {
    if (dto.inn || dto.ogrn || dto.accreditationNumber) {
      await this.ensureUnique(dto, id);
    }

    const updated = await this.accOrgModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.accreditationDate && { accreditationDate: new Date(dto.accreditationDate) }),
        ...(dto.accreditationExpiryDate && { accreditationExpiryDate: new Date(dto.accreditationExpiryDate) }),
        updatedBy: userId,
      },
      { new: true }
    ).lean().exec();

    if (!updated) throw new NotFoundException('Организация не найдена');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.accOrgModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Организация не найдена');
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const { deletedCount } = await this.accOrgModel.deleteMany({ _id: { $in: ids } }).exec();
    return deletedCount || 0;
  }

  async getStats(): Promise<any> {
    const total = await this.accOrgModel.countDocuments();
    const [active, suspended, revoked, expired] = await Promise.all([
      this.accOrgModel.countDocuments({ status: 'active' }),
      this.accOrgModel.countDocuments({ status: 'suspended' }),
      this.accOrgModel.countDocuments({ status: 'revoked' }),
      this.accOrgModel.countDocuments({ status: 'expired' }),
    ]);

    const byTypeAgg = await this.accOrgModel.aggregate([
      { $group: { _id: '$accreditationType', count: { $sum: 1 } } },
    ]);
    const byType = {
      educational: 0,
      training: 0,
      assessment: 0,
      other: 0,
    } as Record<string, number>;
    byTypeAgg.forEach((i) => (byType[i._id] = i.count));

    const expiringSoon = await this.getExpiringSoonCount(30);

    return { total, active, suspended, revoked, expired, byType, recentAdditions: 0, expiringSoon };
  }

  async getExpiringSoon(days: number = 30): Promise<AccreditedOrganization[]> {
    const now = new Date();
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return this.accOrgModel.find({ accreditationExpiryDate: { $gte: now, $lte: target } }).lean().exec();
  }

  private async getExpiringSoonCount(days: number): Promise<number> {
    const now = new Date();
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return this.accOrgModel.countDocuments({ accreditationExpiryDate: { $gte: now, $lte: target } });
  }

  async exportToExcel(filters: AccreditedOrganizationQueryDto): Promise<Buffer> {
    const { data } = await this.findAll({ ...filters, page: 1, limit: 10000 });
    const rows = data.map((org) => ({
      'Название': org.name,
      'Краткое название': org.shortName || '',
      'ИНН': org.inn,
      'КПП': org.kpp || '',
      'ОГРН': org.ogrn,
      'Юр. адрес': org.legalAddress,
      'Факт. адрес': org.actualAddress || '',
      'Телефон': org.phone,
      'Email': org.email,
      'Сайт': org.website || '',
      'Руководитель': org.directorName,
      'Должность': org.directorPosition,
      '№ аккредитации': org.accreditationNumber,
      'Дата аккред.': org.accreditationDate ? new Date(org.accreditationDate).toLocaleDateString('ru-RU') : '',
      'Срок до': org.accreditationExpiryDate ? new Date(org.accreditationExpiryDate).toLocaleDateString('ru-RU') : '',
      'Статус': org.status,
      'Тип': org.accreditationType,
      'Регион': org.region || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Организации');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  async checkInnUnique(inn: string, excludeId?: string): Promise<boolean> {
    const exists = await this.accOrgModel.exists({ inn, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    return !exists;
  }

  async checkOgrnUnique(ogrn: string, excludeId?: string): Promise<boolean> {
    const exists = await this.accOrgModel.exists({ ogrn, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    return !exists;
  }

  async checkAccreditationNumberUnique(accreditationNumber: string, excludeId?: string): Promise<boolean> {
    const exists = await this.accOrgModel.exists({ accreditationNumber, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    return !exists;
  }

  private async ensureUnique(dto: Partial<CreateAccreditedOrganizationDto>, excludeId?: string) {
    if (dto.inn) {
      const notUnique = !(await this.checkInnUnique(dto.inn, excludeId));
      if (notUnique) throw new ConflictException('ИНН уже существует');
    }
    if (dto.ogrn) {
      const notUnique = !(await this.checkOgrnUnique(dto.ogrn, excludeId));
      if (notUnique) throw new ConflictException('ОГРН уже существует');
    }
    if (dto.accreditationNumber) {
      const notUnique = !(await this.checkAccreditationNumberUnique(dto.accreditationNumber, excludeId));
      if (notUnique) throw new ConflictException('Номер аккредитации уже существует');
    }
  }
}


