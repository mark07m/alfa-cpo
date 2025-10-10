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
  Res,
  Header
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventTypeDto } from './dto/create-event-type.dto';
import { UpdateEventTypeDto } from './dto/update-event-type.dto';
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
import type { Response } from 'express';

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

  @Post('types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  @HttpCode(HttpStatus.CREATED)
  async createEventType(@Body() dto: CreateEventTypeDto) {
    const created = await this.eventsService.createEventType(dto);
    return ResponseUtil.created(created, 'Тип мероприятия создан');
  }

  @Patch('types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  async updateEventType(@Param('id') id: string, @Body() dto: UpdateEventTypeDto) {
    const updated = await this.eventsService.updateEventType(id, dto);
    return ResponseUtil.updated(updated, 'Тип мероприятия обновлен');
  }

  @Delete('types/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEventType(@Param('id') id: string) {
    await this.eventsService.deleteEventType(id);
    return ResponseUtil.deleted('Тип мероприятия удален');
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

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  async updateStatus(@Param('id') id: string, @Body() body: { status: 'draft'|'published'|'cancelled'|'completed' }, @Request() req) {
    const updated = await (this.eventsService as any).updateStatus(id, body.status, req.user.id);
    return ResponseUtil.updated(updated, 'Статус мероприятия обновлен');
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

  @Delete('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkDelete(@Body() body: { ids: string[] }) {
    await (this.eventsService as any).bulkDelete(body.ids || []);
    return ResponseUtil.deleted('Мероприятия успешно удалены');
  }

  // Participants endpoints
  @Get(':eventId/participants')
  async listParticipants(@Param('eventId') eventId: string) {
    const participants = await (this.eventsService as any).listParticipants(eventId);
    return ResponseUtil.success(participants, 'Участники получены');
  }

  @Post(':eventId/participants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  async addParticipant(@Param('eventId') eventId: string, @Body() body: any, @Request() req) {
    const participant = await (this.eventsService as any).addParticipant(eventId, body, req.user.id);
    return ResponseUtil.created(participant, 'Участник добавлен');
  }

  @Patch(':eventId/participants/:participantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  async updateParticipant(@Param('eventId') eventId: string, @Param('participantId') participantId: string, @Body() body: any, @Request() req) {
    const participant = await (this.eventsService as any).updateParticipant(eventId, participantId, body, req.user.id);
    return ResponseUtil.updated(participant, 'Участник обновлен');
  }

  @Delete(':eventId/participants/:participantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteParticipant(@Param('eventId') eventId: string, @Param('participantId') participantId: string) {
    await (this.eventsService as any).deleteParticipant(eventId, participantId);
    return ResponseUtil.deleted('Участник удален');
  }

  @Get(':eventId/participants/export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="participants.csv"')
  async exportParticipants(@Param('eventId') eventId: string, @Res() res: Response) {
    try {
      const csv = await (this.eventsService as any).exportParticipantsCsv(eventId);
      res.send(csv);
    } catch (e) {
      res.status(500).json({ message: 'Ошибка экспорта участников' });
    }
  }
}
