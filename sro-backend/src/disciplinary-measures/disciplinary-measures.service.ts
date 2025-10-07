import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DisciplinaryMeasure, DisciplinaryMeasureDocument } from '@/database/schemas/disciplinary-measure.schema';
import { CreateDisciplinaryMeasureDto } from './dto/create-disciplinary-measure.dto';
import { UpdateDisciplinaryMeasureDto } from './dto/update-disciplinary-measure.dto';
import { DisciplinaryMeasureQueryDto } from './dto/disciplinary-measure-query.dto';

@Injectable()
export class DisciplinaryMeasuresService {
  constructor(
    @InjectModel(DisciplinaryMeasure.name) private disciplinaryMeasureModel: Model<DisciplinaryMeasureDocument>,
  ) {}

  async create(createDisciplinaryMeasureDto: CreateDisciplinaryMeasureDto, userId: string): Promise<DisciplinaryMeasure> {
    try {
      const disciplinaryMeasure = new this.disciplinaryMeasureModel({
        ...createDisciplinaryMeasureDto,
        managerId: new Types.ObjectId(createDisciplinaryMeasureDto.managerId),
        documents: createDisciplinaryMeasureDto.documents?.map(id => new Types.ObjectId(id)),
        createdBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
      });

      return await disciplinaryMeasure.save();
    } catch (error) {
      throw new BadRequestException('Ошибка при создании дисциплинарной меры: ' + error.message);
    }
  }

  async findAll(query: DisciplinaryMeasureQueryDto) {
    const {
      managerId,
      type,
      status,
      appealStatus,
      decisionNumber,
      dateFrom,
      dateTo,
      appealDeadlineFrom,
      appealDeadlineTo,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    if (managerId) {
      filter.managerId = new Types.ObjectId(managerId);
    }

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    if (appealStatus) {
      filter.appealStatus = appealStatus;
    }

    if (decisionNumber) {
      filter.decisionNumber = { $regex: decisionNumber, $options: 'i' };
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date.$lte = new Date(dateTo);
      }
    }

    if (appealDeadlineFrom || appealDeadlineTo) {
      filter.appealDeadline = {};
      if (appealDeadlineFrom) {
        filter.appealDeadline.$gte = new Date(appealDeadlineFrom);
      }
      if (appealDeadlineTo) {
        filter.appealDeadline.$lte = new Date(appealDeadlineTo);
      }
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [disciplinaryMeasures, total] = await Promise.all([
      this.disciplinaryMeasureModel
        .find(filter)
        .populate('managerId', 'fullName inn registryNumber')
        .populate('documents', 'name url type')
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.disciplinaryMeasureModel.countDocuments(filter),
    ]);

    return {
      data: disciplinaryMeasures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<DisciplinaryMeasure> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID дисциплинарной меры');
    }

    const disciplinaryMeasure = await this.disciplinaryMeasureModel
      .findById(id)
      .populate('managerId', 'fullName inn registryNumber')
      .populate('documents', 'name url type')
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!disciplinaryMeasure) {
      throw new NotFoundException('Дисциплинарная мера не найдена');
    }

    return disciplinaryMeasure;
  }

  async update(id: string, updateDisciplinaryMeasureDto: UpdateDisciplinaryMeasureDto, userId: string): Promise<DisciplinaryMeasure> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID дисциплинарной меры');
    }

    const updateData: any = {
      ...updateDisciplinaryMeasureDto,
      updatedBy: new Types.ObjectId(userId),
    };

    if (updateDisciplinaryMeasureDto.managerId) {
      updateData.managerId = new Types.ObjectId(updateDisciplinaryMeasureDto.managerId);
    }

    if (updateDisciplinaryMeasureDto.documents) {
      updateData.documents = updateDisciplinaryMeasureDto.documents.map(id => new Types.ObjectId(id));
    }

    const disciplinaryMeasure = await this.disciplinaryMeasureModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('managerId', 'fullName inn registryNumber')
      .populate('documents', 'name url type')
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!disciplinaryMeasure) {
      throw new NotFoundException('Дисциплинарная мера не найдена');
    }

    return disciplinaryMeasure;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID дисциплинарной меры');
    }

    const result = await this.disciplinaryMeasureModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Дисциплинарная мера не найдена');
    }
  }

  async getStatistics() {
    const stats = await this.disciplinaryMeasureModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          warning: {
            $sum: { $cond: [{ $eq: ['$type', 'warning'] }, 1, 0] }
          },
          reprimand: {
            $sum: { $cond: [{ $eq: ['$type', 'reprimand'] }, 1, 0] }
          },
          exclusion: {
            $sum: { $cond: [{ $eq: ['$type', 'exclusion'] }, 1, 0] }
          },
          suspension: {
            $sum: { $cond: [{ $eq: ['$type', 'suspension'] }, 1, 0] }
          },
          other: {
            $sum: { $cond: [{ $eq: ['$type', 'other'] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          expired: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
          },
          withAppeal: {
            $sum: { $cond: [{ $ne: ['$appealStatus', 'none'] }, 1, 0] }
          },
          appealSubmitted: {
            $sum: { $cond: [{ $eq: ['$appealStatus', 'submitted'] }, 1, 0] }
          },
          appealApproved: {
            $sum: { $cond: [{ $eq: ['$appealStatus', 'approved'] }, 1, 0] }
          },
          appealRejected: {
            $sum: { $cond: [{ $eq: ['$appealStatus', 'rejected'] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      warning: 0,
      reprimand: 0,
      exclusion: 0,
      suspension: 0,
      other: 0,
      active: 0,
      cancelled: 0,
      expired: 0,
      withAppeal: 0,
      appealSubmitted: 0,
      appealApproved: 0,
      appealRejected: 0,
    };
  }
}
