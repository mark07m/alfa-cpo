import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArbitraryManager, ArbitraryManagerDocument } from '@/database/schemas/arbitrary-manager.schema';
import { CreateArbitraryManagerDto } from './dto/create-arbitrary-manager.dto';
import { UpdateArbitraryManagerDto } from './dto/update-arbitrary-manager.dto';
import { RegistryQueryDto } from './dto/registry-query.dto';
import { ImportRegistryDto } from './dto/import-registry.dto';
import * as XLSX from 'xlsx';
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class RegistryService {
  constructor(
    @InjectModel(ArbitraryManager.name) private arbitraryManagerModel: Model<ArbitraryManagerDocument>,
  ) {}

  async create(createArbitraryManagerDto: CreateArbitraryManagerDto, userId: string): Promise<ArbitraryManager> {
    // Проверяем уникальность ИНН
    const existingByInn = await this.arbitraryManagerModel.findOne({
      inn: createArbitraryManagerDto.inn,
    });

    if (existingByInn) {
      throw new ConflictException('Арбитражный управляющий с таким ИНН уже существует');
    }

    // Проверяем уникальность номера в реестре
    const existingByRegistryNumber = await this.arbitraryManagerModel.findOne({
      registryNumber: createArbitraryManagerDto.registryNumber,
    });

    if (existingByRegistryNumber) {
      throw new ConflictException('Арбитражный управляющий с таким номером в реестре уже существует');
    }

    const arbitraryManager = new this.arbitraryManagerModel({
      ...createArbitraryManagerDto,
      joinDate: new Date(createArbitraryManagerDto.joinDate),
      excludeDate: createArbitraryManagerDto.excludeDate ? new Date(createArbitraryManagerDto.excludeDate) : undefined,
      birthDate: createArbitraryManagerDto.birthDate ? new Date(createArbitraryManagerDto.birthDate) : undefined,
      registrationDate: createArbitraryManagerDto.registrationDate ? new Date(createArbitraryManagerDto.registrationDate) : undefined,
      stateRegistryDate: createArbitraryManagerDto.stateRegistryDate ? new Date(createArbitraryManagerDto.stateRegistryDate) : undefined,
      criminalRecordDate: createArbitraryManagerDto.criminalRecordDate ? new Date(createArbitraryManagerDto.criminalRecordDate) : undefined,
      complianceDate: createArbitraryManagerDto.complianceDate ? new Date(createArbitraryManagerDto.complianceDate) : undefined,
      lastInspection: createArbitraryManagerDto.lastInspection ? new Date(createArbitraryManagerDto.lastInspection) : undefined,
      // Обработка вложенных объектов
      insurance: createArbitraryManagerDto.insurance ? {
        ...createArbitraryManagerDto.insurance,
        startDate: createArbitraryManagerDto.insurance.startDate ? new Date(createArbitraryManagerDto.insurance.startDate) : undefined,
        endDate: createArbitraryManagerDto.insurance.endDate ? new Date(createArbitraryManagerDto.insurance.endDate) : undefined,
        contractDate: createArbitraryManagerDto.insurance.contractDate ? new Date(createArbitraryManagerDto.insurance.contractDate) : undefined,
      } : undefined,
      compensationFundContributions: createArbitraryManagerDto.compensationFundContributions?.map(contrib => ({
        ...contrib,
        date: new Date(contrib.date),
      })),
      inspections: createArbitraryManagerDto.inspections?.map(inspection => ({
        ...inspection,
        startDate: new Date(inspection.startDate),
        endDate: new Date(inspection.endDate),
      })),
      disciplinaryMeasures: createArbitraryManagerDto.disciplinaryMeasures?.map(measure => ({
        ...measure,
        startDate: new Date(measure.startDate),
        endDate: new Date(measure.endDate),
      })),
      otherSroParticipation: createArbitraryManagerDto.otherSroParticipation?.map(participation => ({
        ...participation,
        joinDate: new Date(participation.joinDate),
        leaveDate: participation.leaveDate ? new Date(participation.leaveDate) : undefined,
      })),
      documents: createArbitraryManagerDto.documents?.map(id => new Types.ObjectId(id)),
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });

    const savedManager = await arbitraryManager.save();
    console.log('Saved manager ID:', savedManager._id);
    console.log('Saved manager data:', JSON.stringify(savedManager, null, 2));
    return savedManager;
  }

  async findAll(query: RegistryQueryDto) {
    const {
      search,
      region,
      status,
      sortBy = 'fullName',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    // Поиск по тексту
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { inn: { $regex: search, $options: 'i' } },
        { registryNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Фильтр по региону
    if (region) {
      filter.region = { $regex: region, $options: 'i' };
    }

    // Фильтр по статусу
    if (status) {
      filter.status = status;
    }

    // Сортировка
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Пагинация
    const skip = (page - 1) * limit;

    const [arbitraryManagers, total] = await Promise.all([
      this.arbitraryManagerModel
        .find(filter)
        .populate('documents', 'title fileName fileUrl')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.arbitraryManagerModel.countDocuments(filter),
    ]);

    return {
      data: arbitraryManagers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ArbitraryManager> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID арбитражного управляющего');
    }

    const arbitraryManager = await this.arbitraryManagerModel
      .findById(id)
      .populate('documents', 'title fileName fileUrl')
      .exec();

    if (!arbitraryManager) {
      throw new NotFoundException('Арбитражный управляющий не найден');
    }

    return arbitraryManager;
  }

  async findByInn(inn: string): Promise<ArbitraryManager> {
    const arbitraryManager = await this.arbitraryManagerModel
      .findOne({ inn })
      .populate('documents', 'title fileName fileUrl')
      .exec();

    if (!arbitraryManager) {
      throw new NotFoundException('Арбитражный управляющий с таким ИНН не найден');
    }

    return arbitraryManager;
  }

  async findByRegistryNumber(registryNumber: string): Promise<ArbitraryManager> {
    const arbitraryManager = await this.arbitraryManagerModel
      .findOne({ registryNumber })
      .populate('documents', 'title fileName fileUrl')
      .exec();

    if (!arbitraryManager) {
      throw new NotFoundException('Арбитражный управляющий с таким номером в реестре не найден');
    }

    return arbitraryManager;
  }

  async update(id: string, updateArbitraryManagerDto: UpdateArbitraryManagerDto, userId: string): Promise<ArbitraryManager> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID арбитражного управляющего');
    }

    // Проверяем уникальность ИНН, если он изменяется
    if (updateArbitraryManagerDto.inn) {
      const existingByInn = await this.arbitraryManagerModel.findOne({
        inn: updateArbitraryManagerDto.inn,
        _id: { $ne: id },
      });

      if (existingByInn) {
        throw new ConflictException('Арбитражный управляющий с таким ИНН уже существует');
      }
    }

    // Проверяем уникальность номера в реестре, если он изменяется
    if (updateArbitraryManagerDto.registryNumber) {
      const existingByRegistryNumber = await this.arbitraryManagerModel.findOne({
        registryNumber: updateArbitraryManagerDto.registryNumber,
        _id: { $ne: id },
      });

      if (existingByRegistryNumber) {
        throw new ConflictException('Арбитражный управляющий с таким номером в реестре уже существует');
      }
    }

    const updateData = {
      ...updateArbitraryManagerDto,
      updatedBy: new Types.ObjectId(userId),
    };

    // Преобразуем даты
    if (updateArbitraryManagerDto.joinDate) {
      (updateData as any).joinDate = new Date(updateArbitraryManagerDto.joinDate);
    }
    if (updateArbitraryManagerDto.excludeDate) {
      (updateData as any).excludeDate = new Date(updateArbitraryManagerDto.excludeDate);
    }
    if (updateArbitraryManagerDto.birthDate) {
      (updateData as any).birthDate = new Date(updateArbitraryManagerDto.birthDate);
    }
    if (updateArbitraryManagerDto.registrationDate) {
      (updateData as any).registrationDate = new Date(updateArbitraryManagerDto.registrationDate);
    }
    if (updateArbitraryManagerDto.stateRegistryDate) {
      (updateData as any).stateRegistryDate = new Date(updateArbitraryManagerDto.stateRegistryDate);
    }
    if (updateArbitraryManagerDto.criminalRecordDate) {
      (updateData as any).criminalRecordDate = new Date(updateArbitraryManagerDto.criminalRecordDate);
    }
    if (updateArbitraryManagerDto.complianceDate) {
      (updateData as any).complianceDate = new Date(updateArbitraryManagerDto.complianceDate);
    }
    if (updateArbitraryManagerDto.lastInspection) {
      (updateData as any).lastInspection = new Date(updateArbitraryManagerDto.lastInspection);
    }

    // Обработка вложенных объектов
    if (updateArbitraryManagerDto.insurance) {
      (updateData as any).insurance = {
        ...updateArbitraryManagerDto.insurance,
        startDate: updateArbitraryManagerDto.insurance.startDate ? new Date(updateArbitraryManagerDto.insurance.startDate) : undefined,
        endDate: updateArbitraryManagerDto.insurance.endDate ? new Date(updateArbitraryManagerDto.insurance.endDate) : undefined,
        contractDate: updateArbitraryManagerDto.insurance.contractDate ? new Date(updateArbitraryManagerDto.insurance.contractDate) : undefined,
      };
    }

    if (updateArbitraryManagerDto.compensationFundContributions) {
      (updateData as any).compensationFundContributions = updateArbitraryManagerDto.compensationFundContributions.map(contrib => ({
        ...contrib,
        date: new Date(contrib.date),
      }));
    }

    if (updateArbitraryManagerDto.inspections) {
      (updateData as any).inspections = updateArbitraryManagerDto.inspections.map(inspection => ({
        ...inspection,
        startDate: new Date(inspection.startDate),
        endDate: new Date(inspection.endDate),
      }));
    }

    if (updateArbitraryManagerDto.disciplinaryMeasures) {
      (updateData as any).disciplinaryMeasures = updateArbitraryManagerDto.disciplinaryMeasures.map(measure => ({
        ...measure,
        startDate: new Date(measure.startDate),
        endDate: new Date(measure.endDate),
      }));
    }

    if (updateArbitraryManagerDto.otherSroParticipation) {
      (updateData as any).otherSroParticipation = updateArbitraryManagerDto.otherSroParticipation.map(participation => ({
        ...participation,
        joinDate: new Date(participation.joinDate),
        leaveDate: participation.leaveDate ? new Date(participation.leaveDate) : undefined,
      }));
    }

    // Преобразуем документы
    if (updateArbitraryManagerDto.documents) {
      (updateData as any).documents = updateArbitraryManagerDto.documents.map(id => new Types.ObjectId(id));
    }

    const arbitraryManager = await this.arbitraryManagerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('documents', 'title fileName fileUrl')
      .exec();

    if (!arbitraryManager) {
      throw new NotFoundException('Арбитражный управляющий не найден');
    }

    return arbitraryManager;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID арбитражного управляющего');
    }

    const result = await this.arbitraryManagerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Арбитражный управляющий не найден');
    }
  }

  async exportToExcel(): Promise<Buffer> {
    const arbitraryManagers = await this.arbitraryManagerModel
      .find()
      .populate('documents', 'title fileName')
      .sort({ fullName: 1 })
      .exec();

    const data = arbitraryManagers.map(manager => ({
      'ФИО': manager.fullName,
      'ИНН': manager.inn,
      'Номер в реестре': manager.registryNumber,
      'СНИЛС': manager.snils || '',
      'Номер в Госреестре': manager.stateRegistryNumber || '',
      'Дата включения в Госреестр': manager.stateRegistryDate ? manager.stateRegistryDate.toLocaleDateString('ru-RU') : '',
      'Телефон': manager.phone,
      'Email': manager.email,
      'Регион': manager.region || '',
      'Населенный пункт': manager.city || '',
      'Статус': manager.status,
      'Дата вступления': manager.joinDate.toLocaleDateString('ru-RU'),
      'Дата исключения': manager.excludeDate ? manager.excludeDate.toLocaleDateString('ru-RU') : '',
      'Причина исключения': manager.excludeReason || '',
      'Дата рождения': manager.birthDate ? manager.birthDate.toLocaleDateString('ru-RU') : '',
      'Место рождения': manager.birthPlace || '',
      'Дата регистрации': manager.registrationDate ? manager.registrationDate.toLocaleDateString('ru-RU') : '',
      'Номер решения': manager.decisionNumber || '',
      'Образование': manager.education || '',
      'Опыт работы': manager.workExperience || '',
      'Стажировка': manager.internship || '',
      'Сертификат экзамена': manager.examCertificate || '',
      'Дисквалификация': manager.disqualification || '',
      'Судимость': manager.criminalRecord || '',
      'Дата судимости': manager.criminalRecordDate ? manager.criminalRecordDate.toLocaleDateString('ru-RU') : '',
      'Номер судимости': manager.criminalRecordNumber || '',
      'Наименование судимости': manager.criminalRecordName || '',
      'Страхование - Начало': manager.insurance?.startDate ? manager.insurance.startDate.toLocaleDateString('ru-RU') : '',
      'Страхование - Окончание': manager.insurance?.endDate ? manager.insurance.endDate.toLocaleDateString('ru-RU') : '',
      'Сумма договора страхования': manager.insurance?.amount || 0,
      'Номер договора страхования': manager.insurance?.contractNumber || '',
      'Дата договора страхования': manager.insurance?.contractDate ? manager.insurance.contractDate.toLocaleDateString('ru-RU') : '',
      'Страховая компания': manager.insurance?.insuranceCompany || '',
      'Взносы в компенсационный фонд': manager.compensationFundContributions?.map(contrib => 
        `${contrib.purpose}: ${contrib.amount}₽ (${contrib.date.toLocaleDateString('ru-RU')})`
      ).join('; ') || '',
      'Общий взнос в компенсационный фонд': manager.compensationFundContribution || 0,
      'Проверки': manager.inspections?.map(inspection => 
        `${inspection.type}: ${inspection.result} (${inspection.startDate.toLocaleDateString('ru-RU')} - ${inspection.endDate.toLocaleDateString('ru-RU')})`
      ).join('; ') || '',
      'Дисциплинарные взыскания': manager.disciplinaryMeasures?.map(measure => 
        `${measure.penalty} (${measure.startDate.toLocaleDateString('ru-RU')} - ${measure.endDate.toLocaleDateString('ru-RU')})`
      ).join('; ') || '',
      'Участие в других СРО': manager.otherSroParticipation?.map(participation => 
        `${participation.sroName} (${participation.status})`
      ).join('; ') || '',
      'Статус соответствия': manager.complianceStatus || '',
      'Дата соответствия': manager.complianceDate ? manager.complianceDate.toLocaleDateString('ru-RU') : '',
      'Номер соответствия': manager.complianceNumber || '',
      'Последняя проверка': manager.lastInspection ? manager.lastInspection.toLocaleDateString('ru-RU') : '',
      'Почтовый адрес': manager.postalAddress || '',
      'Штрафы': manager.penalties || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Реестр АУ');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async exportToCsv(): Promise<string> {
    const arbitraryManagers = await this.arbitraryManagerModel
      .find()
      .sort({ fullName: 1 })
      .exec();

    const headers = [
      'ФИО', 'ИНН', 'Номер в реестре', 'Телефон', 'Email', 'Регион', 'Статус',
      'Дата вступления', 'Дата исключения', 'Причина исключения', 'Дата рождения',
      'Место рождения', 'Дата регистрации', 'Номер решения', 'Образование',
      'Опыт работы', 'Стажировка', 'Сертификат экзамена', 'Дисквалификация',
      'Судимость', 'Страхование', 'Взнос в компенсационный фонд', 'Штрафы',
      'Статус соответствия', 'Последняя проверка', 'Почтовый адрес'
    ];

    const csvData = [
      headers.join(','),
      ...arbitraryManagers.map(manager => [
        `"${manager.fullName}"`,
        manager.inn,
        manager.registryNumber,
        manager.phone,
        manager.email,
        `"${manager.region || ''}"`,
        manager.status,
        manager.joinDate.toLocaleDateString('ru-RU'),
        manager.excludeDate ? manager.excludeDate.toLocaleDateString('ru-RU') : '',
        `"${manager.excludeReason || ''}"`,
        manager.birthDate ? manager.birthDate.toLocaleDateString('ru-RU') : '',
        `"${manager.birthPlace || ''}"`,
        manager.registrationDate ? manager.registrationDate.toLocaleDateString('ru-RU') : '',
        `"${manager.decisionNumber || ''}"`,
        `"${manager.education || ''}"`,
        `"${manager.workExperience || ''}"`,
        `"${manager.internship || ''}"`,
        `"${manager.examCertificate || ''}"`,
        `"${manager.disqualification || ''}"`,
        `"${manager.criminalRecord || ''}"`,
        `"${manager.insurance || ''}"`,
        manager.compensationFundContribution || 0,
        `"${manager.penalties || ''}"`,
        `"${manager.complianceStatus || ''}"`,
        manager.lastInspection ? manager.lastInspection.toLocaleDateString('ru-RU') : '',
        `"${manager.postalAddress || ''}"`
      ].join(','))
    ];

    return csvData.join('\n');
  }

  async importFromFile(importData: ImportRegistryDto, userId: string): Promise<{ success: number; errors: string[] }> {
    // В реальном приложении здесь была бы логика чтения файла
    // и парсинга данных для импорта
    // Пока возвращаем заглушку
    return {
      success: 0,
      errors: ['Функция импорта будет реализована в следующих версиях']
    };
  }

  async getStatistics() {
    const total = await this.arbitraryManagerModel.countDocuments();
    const active = await this.arbitraryManagerModel.countDocuments({ status: 'active' });
    const excluded = await this.arbitraryManagerModel.countDocuments({ status: 'excluded' });
    const suspended = await this.arbitraryManagerModel.countDocuments({ status: 'suspended' });

    const regions = await this.arbitraryManagerModel.aggregate([
      { $match: { region: { $exists: true, $ne: null } } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      total,
      byStatus: {
        active,
        excluded,
        suspended
      },
      byRegion: regions
    };
  }
}
