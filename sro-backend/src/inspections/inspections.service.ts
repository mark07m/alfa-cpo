import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inspection, InspectionDocument } from '@/database/schemas/inspection.schema';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionQueryDto } from './dto/inspection-query.dto';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectModel(Inspection.name) private inspectionModel: Model<InspectionDocument>,
  ) {}

  async create(createInspectionDto: CreateInspectionDto, userId: string): Promise<Inspection> {
    try {
      const inspection = new this.inspectionModel({
        ...createInspectionDto,
        managerId: new Types.ObjectId(createInspectionDto.managerId),
        documents: createInspectionDto.documents?.map(id => new Types.ObjectId(id)),
        createdBy: new Types.ObjectId(userId),
        updatedBy: new Types.ObjectId(userId),
      });

      return await inspection.save();
    } catch (error) {
      throw new BadRequestException('Ошибка при создании проверки: ' + error.message);
    }
  }

  async findAll(query: InspectionQueryDto) {
    const {
      managerId,
      type,
      status,
      inspector,
      result,
      scheduledDateFrom,
      scheduledDateTo,
      completedDateFrom,
      completedDateTo,
      page = 1,
      limit = 10,
      sortBy = 'scheduledDate',
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

    if (inspector) {
      filter.inspector = { $regex: inspector, $options: 'i' };
    }

    if (result) {
      filter.result = result;
    }

    if (scheduledDateFrom || scheduledDateTo) {
      filter.scheduledDate = {};
      if (scheduledDateFrom) {
        filter.scheduledDate.$gte = new Date(scheduledDateFrom);
      }
      if (scheduledDateTo) {
        filter.scheduledDate.$lte = new Date(scheduledDateTo);
      }
    }

    if (completedDateFrom || completedDateTo) {
      filter.completedDate = {};
      if (completedDateFrom) {
        filter.completedDate.$gte = new Date(completedDateFrom);
      }
      if (completedDateTo) {
        filter.completedDate.$lte = new Date(completedDateTo);
      }
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [inspections, total] = await Promise.all([
      this.inspectionModel
        .find(filter)
        .populate('managerId', 'fullName inn registryNumber')
        .populate('documents', 'name url type')
        .populate('createdBy', 'email')
        .populate('updatedBy', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.inspectionModel.countDocuments(filter),
    ]);

    return {
      data: inspections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Inspection> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID проверки');
    }

    const inspection = await this.inspectionModel
      .findById(id)
      .populate('managerId', 'fullName inn registryNumber')
      .populate('documents', 'name url type')
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!inspection) {
      throw new NotFoundException('Проверка не найдена');
    }

    return inspection;
  }

  async update(id: string, updateInspectionDto: UpdateInspectionDto, userId: string): Promise<Inspection> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID проверки');
    }

    const updateData: any = {
      ...updateInspectionDto,
      updatedBy: new Types.ObjectId(userId),
    };

    if (updateInspectionDto.managerId) {
      updateData.managerId = new Types.ObjectId(updateInspectionDto.managerId);
    }

    if (updateInspectionDto.documents) {
      updateData.documents = updateInspectionDto.documents.map(id => new Types.ObjectId(id));
    }

    const inspection = await this.inspectionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('managerId', 'fullName inn registryNumber')
      .populate('documents', 'name url type')
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .exec();

    if (!inspection) {
      throw new NotFoundException('Проверка не найдена');
    }

    return inspection;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID проверки');
    }

    const result = await this.inspectionModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Проверка не найдена');
    }
  }

  async getStatistics() {
    const stats = await this.inspectionModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          planned: {
            $sum: { $cond: [{ $eq: ['$type', 'planned'] }, 1, 0] }
          },
          unplanned: {
            $sum: { $cond: [{ $eq: ['$type', 'unplanned'] }, 1, 0] }
          },
          scheduled: {
            $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          passed: {
            $sum: { $cond: [{ $eq: ['$result', 'passed'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$result', 'failed'] }, 1, 0] }
          },
          needsImprovement: {
            $sum: { $cond: [{ $eq: ['$result', 'needs_improvement'] }, 1, 0] }
          },
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      planned: 0,
      unplanned: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      passed: 0,
      failed: 0,
      needsImprovement: 0,
    };
  }
}
