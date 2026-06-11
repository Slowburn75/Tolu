import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Get('banners')
  async findActive() {
    return this.bannersService.findActive();
  }

  @Get('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.bannersService.findAll();
  }

  @Post('admin/banners')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() body: { title: string; subtitle?: string; link?: string; image: string; order?: number; isActive?: boolean }) {
    return this.bannersService.create(body);
  }

  @Patch('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() body: Partial<{ title: string; subtitle: string; link: string; image: string; order: number; isActive: boolean }>) {
    return this.bannersService.update(id, body);
  }

  @Delete('admin/banners/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }
}
