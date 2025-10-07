import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { RegisterEventDto } from './dto/register-event.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { UserRole, Permission } from '@/common/types';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    const event = await this.eventsService.create(createEventDto, req.user.id);
    return ResponseUtil.created(event, 'Мероприятие успешно создано');
  }

  @Get()
  async findAll(@Query() query: EventQueryDto) {
    try {
      const result = await this.eventsService.findAll(query);
      return ResponseUtil.paginated(result.data, result.pagination, 'Мероприятия успешно получены');
    } catch (error) {
      console.error('Error in findAll events:', error);
      throw error;
    }
  }

  @Get('upcoming')
  async getUpcomingEvents(@Query('limit') limit?: number) {
    const events = await this.eventsService.getUpcomingEvents(limit);
    return ResponseUtil.success(events, 'Предстоящие мероприятия получены');
  }

  @Get('featured')
  async getFeaturedEvents(@Query('limit') limit?: number) {
    const events = await this.eventsService.getFeaturedEvents(limit);
    return ResponseUtil.success(events, 'Рекомендуемые мероприятия получены');
  }

  @Get('calendar')
  async getCalendar(@Query() query: CalendarQueryDto) {
    const calendar = await this.eventsService.getCalendar(query);
    return ResponseUtil.success(calendar, 'Календарь мероприятий получен');
  }

  @Get('types')
  async getEventTypes() {
    const types = await this.eventsService.getEventTypes();
    return ResponseUtil.success(types, 'Типы мероприятий получены');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return ResponseUtil.success(event, 'Мероприятие получено');
  }

  @Post(':id/register')
  @HttpCode(HttpStatus.OK)
  async registerForEvent(@Param('id') id: string, @Body() registerEventDto: RegisterEventDto) {
    const registration = await this.eventsService.registerForEvent(id, registerEventDto);
    return ResponseUtil.success(registration, 'Регистрация на мероприятие успешна');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    const event = await this.eventsService.update(id, updateEventDto, req.user.id);
    return ResponseUtil.updated(event, 'Мероприятие успешно обновлено');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);
    return ResponseUtil.deleted('Мероприятие успешно удалено');
  }
}
