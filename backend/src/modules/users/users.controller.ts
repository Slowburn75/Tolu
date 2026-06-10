import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, AdminUpdateUserDto } from './users.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query.page, query.limit, query.search);
  }

  @Get('admin/users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser('id') userId: string) {
    if (id !== userId) {
      return { message: 'You can only update your own profile' };
    }
    return this.usersService.update(id, dto);
  }

  @Patch('admin/users/:id/block')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async block(@Param('id') id: string) {
    return this.usersService.block(id);
  }

  @Patch('admin/users/:id/unblock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async unblock(@Param('id') id: string) {
    return this.usersService.unblock(id);
  }
}
