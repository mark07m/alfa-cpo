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

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_CREATE)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.userId);
  }

  @Get()
  findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get('upcoming')
  getUpcomingEvents(@Query('limit') limit?: number) {
    return this.eventsService.getUpcomingEvents(limit);
  }

  @Get('featured')
  getFeaturedEvents(@Query('limit') limit?: number) {
    return this.eventsService.getFeaturedEvents(limit);
  }

  @Get('calendar')
  getCalendar(@Query() query: CalendarQueryDto) {
    return this.eventsService.getCalendar(query);
  }

  @Get('types')
  getEventTypes() {
    return this.eventsService.getEventTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post(':id/register')
  @HttpCode(HttpStatus.OK)
  registerForEvent(@Param('id') id: string, @Body() registerEventDto: RegisterEventDto) {
    return this.eventsService.registerForEvent(id, registerEventDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.EDITOR)
  @RequirePermissions(Permission.EVENTS_UPDATE)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.eventsService.update(id, updateEventDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @RequirePermissions(Permission.EVENTS_DELETE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
