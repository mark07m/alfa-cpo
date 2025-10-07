import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUtil } from '@/common/utils/response.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return ResponseUtil.created(user, 'Пользователь успешно создан');
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return ResponseUtil.success(users, 'Пользователи успешно получены');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return ResponseUtil.success(user, 'Пользователь получен');
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return ResponseUtil.updated(user, 'Пользователь успешно обновлен');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return ResponseUtil.deleted('Пользователь успешно удален');
  }
}
