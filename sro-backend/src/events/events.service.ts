import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from '@/database/schemas/event.schema';
import { EventType, EventTypeDocument } from '@/database/schemas/event-type.schema';
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
    // Проверяем существование типа мероприятия, если указан
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

    // Поиск по тексту
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    // Фильтр по типу
    if (type) {
      filter.type = new Types.ObjectId(type);
    }

    // Фильтр по статусу
    if (status) {
      filter.status = status;
    }

    // Фильтр по тегу
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Фильтр по местоположению
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Фильтр по featured
    if (featured !== undefined) {
      filter.featured = featured;
    }

    // Фильтр по необходимости регистрации
    if (registrationRequired !== undefined) {
      filter.registrationRequired = registrationRequired;
    }

    // Фильтр по дате начала
    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) {
        filter.startDate.$gte = new Date(startDateFrom);
      }
      if (startDateTo) {
        filter.startDate.$lte = new Date(startDateTo);
      }
    }

    // Сортировка
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Пагинация
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

    // Проверяем существование типа мероприятия, если указан
    if (updateEventDto.type) {
      const eventType = await this.eventTypeModel.findById(updateEventDto.type);
      if (!eventType) {
        throw new BadRequestException('Тип мероприятия не найден');
      }
    }

    const updateData = {
      ...updateEventDto,
      updatedBy: new Types.ObjectId(userId),
    };

    // Обрабатываем даты
    if (updateEventDto.startDate) {
      (updateData as any).startDate = new Date(updateEventDto.startDate);
    }
    if (updateEventDto.endDate) {
      (updateData as any).endDate = new Date(updateEventDto.endDate);
    }
    if (updateEventDto.registrationDeadline) {
      (updateData as any).registrationDeadline = new Date(updateEventDto.registrationDeadline);
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

    // Увеличиваем счетчик участников
    await this.eventModel.findByIdAndUpdate(eventId, { $inc: { currentParticipants: 1 } }).exec();

    // Здесь можно добавить логику сохранения данных регистрации в отдельную коллекцию
    // или отправки уведомлений

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

    // Фильтр по типу
    if (type) {
      filter.type = new Types.ObjectId(type);
    }

    // Фильтр по дате
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
}
