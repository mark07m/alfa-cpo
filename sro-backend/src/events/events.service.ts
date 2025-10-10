import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '@/database/schemas/event.schema';
import { EventType, EventTypeDocument } from '@/database/schemas/event-type.schema';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventType.name) private eventTypeModel: Model<EventTypeDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    if (createEventDto.type) {
      const eventType = await this.eventTypeModel.findById(createEventDto.type);
      if (!eventType) {
        throw new BadRequestException('Тип мероприятия не найден');
      }
    }

    const event = new this.eventModel({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: createEventDto.endDate ? new Date(createEventDto.endDate) : undefined,
      registrationDeadline: createEventDto.registrationDeadline ? new Date(createEventDto.registrationDeadline) : undefined,
      createdBy: new Types.ObjectId(userId),
      updatedBy: new Types.ObjectId(userId),
    });

    return event.save();
  }

  async findAll(query: EventQueryDto) {
    const {
      search,
      type,
      status,
      tag,
      location,
      featured,
      registrationRequired,
      startDateFrom,
      startDateTo,
      sortBy = 'startDate',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) {
      filter.type = new Types.ObjectId(type);
    }

    if (status) {
      filter.status = status;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (registrationRequired !== undefined) {
      filter.registrationRequired = registrationRequired;
    }

    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) {
        filter.startDate.$gte = new Date(startDateFrom);
      }
      if (startDateTo) {
        filter.startDate.$lte = new Date(startDateTo);
      }
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .populate('type', 'name slug color icon')
        .populate('materials', 'title fileName originalName')
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.eventModel.countDocuments(filter),
    ]);

    return {
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Event> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID мероприятия');
    }

    const event = await this.eventModel
      .findById(id)
      .populate('type', 'name slug color icon')
      .populate('materials', 'title fileName originalName')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!event) {
      throw new NotFoundException('Мероприятие не найдено');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID мероприятия');
    }

    if (updateEventDto.type) {
      const eventType = await this.eventTypeModel.findById(updateEventDto.type);
      if (!eventType) {
        throw new BadRequestException('Тип мероприятия не найден');
      }
    }

    const updateData = {
      ...updateEventDto,
      updatedBy: new Types.ObjectId(userId),
    } as any;

    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }
    if (updateEventDto.registrationDeadline) {
      updateData.registrationDeadline = new Date(updateEventDto.registrationDeadline);
    }

    const event = await this.eventModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('type', 'name slug color icon')
      .populate('materials', 'title fileName originalName')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!event) {
      throw new NotFoundException('Мероприятие не найдено');
    }

    return event;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный ID мероприятия');
    }

    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Мероприятие не найдено');
    }
  }

  async registerForEvent(eventId: string, registerEventDto: RegisterEventDto): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(eventId)) {
      throw new BadRequestException('Неверный ID мероприятия');
    }

    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('Мероприятие не найдено');
    }

    if (event.status !== 'published') {
      throw new BadRequestException('Мероприятие недоступно для регистрации');
    }

    if (!event.registrationRequired) {
      throw new BadRequestException('Регистрация на данное мероприятие не требуется');
    }

    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      throw new BadRequestException('Срок регистрации истек');
    }

    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw new BadRequestException('Достигнуто максимальное количество участников');
    }

    await this.eventModel.findByIdAndUpdate(eventId, { $inc: { currentParticipants: 1 } }).exec();

    return {
      success: true,
      message: 'Регистрация на мероприятие прошла успешно'
    };
  }

  async getCalendar(query: CalendarQueryDto) {
    const {
      startDate,
      endDate,
      type,
      status = 'published'
    } = query;

    const filter: any = { status };

    if (type) {
      filter.type = new Types.ObjectId(type);
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) {
        filter.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.startDate.$lte = new Date(endDate);
      }
    }

    const events = await this.eventModel
      .find(filter)
      .populate('type', 'name slug color icon')
      .select('title startDate endDate location type status featured')
      .sort({ startDate: 1 })
      .exec();

    return events;
  }

  async getUpcomingEvents(limit: number = 5): Promise<Event[]> {
    const now = new Date();
    
    return this.eventModel
      .find({
        status: 'published',
        startDate: { $gte: now }
      })
      .populate('type', 'name slug color icon')
      .sort({ startDate: 1 })
      .limit(limit)
      .exec();
  }

  async getFeaturedEvents(limit: number = 3): Promise<Event[]> {
    const now = new Date();
    
    return this.eventModel
      .find({
        status: 'published',
        featured: true,
        startDate: { $gte: now }
      })
      .populate('type', 'name slug color icon')
      .sort({ startDate: 1 })
      .limit(limit)
      .exec();
  }

  async getEventTypes(): Promise<EventType[]> {
    return this.eventTypeModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async createEventType(dto: CreateEventTypeDto): Promise<EventType> {
    const created = new this.eventTypeModel({
      ...dto,
      name: dto.name.trim(),
      slug: dto.slug.trim(),
    });
    return created.save();
  }

  async updateEventType(id: string, dto: UpdateEventTypeDto): Promise<EventType> {
    if (!Types.ObjectId.isValid(id)) {
      throw new (await import('@nestjs/common')).BadRequestException('Неверный ID типа мероприятия');
    }
    const updated = await this.eventTypeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new (await import('@nestjs/common')).NotFoundException('Тип мероприятия не найден');
    }
    return updated as any;
  }

  async deleteEventType(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new (await import('@nestjs/common')).BadRequestException('Неверный ID типа мероприятия');
    }
    const res = await this.eventTypeModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new (await import('@nestjs/common')).NotFoundException('Тип мероприятия не найден');
    }
  }

  // Participants subdocument operations
  async listParticipants(eventId: string) {
    if (!Types.ObjectId.isValid(eventId)) throw new BadRequestException('Неверный ID мероприятия');
    const event = await this.eventModel.findById(eventId).lean().exec();
    if (!event) throw new NotFoundException('Мероприятие не найдено');
    return (event as any).participants || [];
  }

  async addParticipant(eventId: string, dto: any, userId: string) {
    if (!Types.ObjectId.isValid(eventId)) throw new BadRequestException('Неверный ID мероприятия');
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException('Мероприятие не найдено');

    const participant = {
      _id: new Types.ObjectId(),
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      registeredAt: new Date(),
      status: dto.status || 'pending',
      organization: dto.organization,
      position: dto.position,
      createdBy: new Types.ObjectId(userId),
    } as any;

    (event as any).participants = (event as any).participants || [];
    (event as any).participants.push(participant);
    await event.save();
    return participant;
  }

  async updateParticipant(eventId: string, participantId: string, dto: any, userId: string) {
    if (!Types.ObjectId.isValid(eventId) || !Types.ObjectId.isValid(participantId)) {
      throw new BadRequestException('Неверные ID');
    }
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException('Мероприятие не найдено');
    const participants = (event as any).participants || [];
    const idx = participants.findIndex((p: any) => String(p._id) === String(participantId));
    if (idx === -1) throw new NotFoundException('Участник не найден');
    const updated = { ...participants[idx], ...dto };
    participants[idx] = updated;
    await event.save();
    return updated;
  }

  async deleteParticipant(eventId: string, participantId: string) {
    if (!Types.ObjectId.isValid(eventId) || !Types.ObjectId.isValid(participantId)) {
      throw new BadRequestException('Неверные ID');
    }
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) throw new NotFoundException('Мероприятие не найдено');
    const before = ((event as any).participants || []).length;
    (event as any).participants = ((event as any).participants || []).filter((p: any) => String(p._id) !== String(participantId));
    if (((event as any).participants || []).length === before) {
      throw new NotFoundException('Участник не найден');
    }
    await event.save();
  }

  async exportParticipantsCsv(eventId: string): Promise<string> {
    if (!Types.ObjectId.isValid(eventId)) throw new BadRequestException('Неверный ID мероприятия');
    const event = await this.eventModel.findById(eventId).lean().exec();
    if (!event) throw new NotFoundException('Мероприятие не найдено');
    const participants = ((event as any).participants || []) as any[];
    const header = ['ФИО','Email','Телефон','Организация','Должность','Статус','Дата регистрации'];
    const rows = participants.map(p => [p.fullName||'', p.email||'', p.phone||'', p.organization||'', p.position||'', p.status||'', p.registeredAt ? new Date(p.registeredAt).toISOString() : '']);
    return [header, ...rows].map(r => r.join(',')).join('\n');
  }

  async updateStatus(id: string, status: 'draft'|'published'|'cancelled'|'completed', userId: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Неверный ID мероприятия');
    const updated = await this.eventModel.findByIdAndUpdate(id, { status, updatedBy: new Types.ObjectId(userId) }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Мероприятие не найдено');
    return updated;
  }

  async bulkDelete(ids: string[]) {
    const validIds = (ids || []).filter(id => Types.ObjectId.isValid(id));
    if (!validIds.length) throw new BadRequestException('Неверные ID мероприятий');
    await this.eventModel.deleteMany({ _id: { $in: validIds } }).exec();
  }
}
